import { FriendshipStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { validateSearchTerm } from '../utils/validation.js';
import { handleSocialEvent } from './auto-verify.service.js';
import { notifyFriendAccepted, notifyFriendRequest } from './notification.service.js';

const MAX_FRIENDS = 500;

/**
 * Envia uma solicitação de amizade
 */
export async function sendFriendRequest(userId: string, targetUserId: string) {
  // Validação: não pode adicionar a si mesmo
  if (userId === targetUserId) {
    throw new Error('Você não pode enviar solicitação de amizade para si mesmo');
  }

  // Verificar se o usuário alvo existe
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new Error('Usuário não encontrado');
  }

  // LIMPAR SOLICITAÇÕES ANTIGAS PRIMEIRO (previne erro de unique constraint)
  await prisma.friendRequest.deleteMany({
    where: {
      OR: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId },
      ],
      status: { not: FriendshipStatus.PENDING },
    },
  });

  // Verificar se já existe uma solicitação pendente
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId },
      ],
      status: FriendshipStatus.PENDING,
    },
  });

  if (existingRequest) {
    throw new Error('Já existe uma solicitação de amizade pendente');
  }

  // Verificar se já são amigos
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId, friendId: targetUserId },
        { userId: targetUserId, friendId: userId },
      ],
    },
  });

  if (existingFriendship) {
    throw new Error('Vocês já são amigos');
  }

  // Verificar se foi bloqueado
  const blockedRequest = await prisma.friendRequest.findFirst({
    where: {
      senderId: targetUserId,
      receiverId: userId,
      status: FriendshipStatus.BLOCKED,
    },
  });

  if (blockedRequest) {
    throw new Error('Não é possível enviar solicitação para este usuário');
  }

  // Verificar limite de amigos do usuário
  const userFriendsCount = await prisma.friendship.count({
    where: {
      OR: [{ userId }, { friendId: userId }],
    },
  });

  if (userFriendsCount >= MAX_FRIENDS) {
    throw new Error(`Você atingiu o limite máximo de ${MAX_FRIENDS} amigos`);
  }
  
  // Criar solicitação
  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId: userId,
      receiverId: targetUserId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      receiver: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          level: true,
          xp: true,
        },
      },
      sender: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
    },
  });

  // Criar notificação para o receptor
  let notification = null;
  try {
    notification = await notifyFriendRequest(
      targetUserId,
      friendRequest.sender.name || friendRequest.sender.username
    );
  } catch (error) {
    console.error('[FRIEND SERVICE] Erro ao criar notificação de friend request:', error);
  }

  return {
    ...friendRequest,
    notification, // Inclui notificação na resposta
  };
}

/**
 * Aceita uma solicitação de amizade
 */
export async function acceptFriendRequest(userId: string, requestId: string) {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
    include: {
      sender: true,
      receiver: true,
    },
  });

  if (!request) {
    throw new Error('Solicitação não encontrada');
  }

  if (request.receiverId !== userId) {
    throw new Error('Você não tem permissão para aceitar esta solicitação');
  }

  if (request.status !== FriendshipStatus.PENDING) {
    throw new Error('Esta solicitação não está mais pendente');
  }

  // Verificar limite de amigos
  const receiverFriendsCount = await prisma.friendship.count({
    where: {
      OR: [{ userId }, { friendId: userId }],
    },
  });

  if (receiverFriendsCount >= MAX_FRIENDS) {
    throw new Error(`Você atingiu o limite máximo de ${MAX_FRIENDS} amigos`);
  }

  // Atualizar solicitação e criar amizade em uma transação
  const result = await prisma.$transaction(async (tx) => {
    // Atualizar status da solicitação
    await tx.friendRequest.update({
      where: { id: requestId },
      data: { status: FriendshipStatus.ACCEPTED },
    });

    // Criar amizade bidirecional
    await tx.friendship.createMany({
      data: [
        {
          userId: request.senderId,
          friendId: request.receiverId,
        },
        {
          userId: request.receiverId,
          friendId: request.senderId,
        },
      ],
    });

    return tx.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            level: true,
            xp: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });
  });

  // Criar notificação para quem enviou a solicitação
  let notification = null;
  if (result) {
    try {
      notification = await notifyFriendAccepted(
        request.senderId,
        result.receiver.name || result.receiver.username
      );
    } catch (error) {
      console.error('[FRIEND SERVICE] Erro ao criar notificação de friend accepted:', error);
    }

    // Verifica e completa desafios auto-verificáveis para ambos usuários
    // (ex: "Conecte-se com um Novo Amigo")
    handleSocialEvent(request.senderId, 'FRIENDSHIP_CREATED').catch((error) => {
      console.error('[FRIEND SERVICE] Erro ao verificar desafios automáticos (sender):', error);
    });
    handleSocialEvent(userId, 'FRIENDSHIP_CREATED').catch((error) => {
      console.error('[FRIEND SERVICE] Erro ao verificar desafios automáticos (receiver):', error);
    });
  }

  return {
    ...result,
    notification, // Inclui notificação na resposta
  };
}

/**
 * Rejeita uma solicitação de amizade
 */
export async function rejectFriendRequest(userId: string, requestId: string) {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error('Solicitação não encontrada');
  }

  if (request.receiverId !== userId) {
    throw new Error('Você não tem permissão para rejeitar esta solicitação');
  }

  if (request.status !== FriendshipStatus.PENDING) {
    throw new Error('Esta solicitação não está mais pendente');
  }

  // Em vez de apenas atualizar para REJECTED, vamos deletar a solicitação
  // Isso permite que o remetente possa tentar novamente no futuro se desejar
  await prisma.friendRequest.delete({
    where: { id: requestId },
  });

  return {
    success: true,
    message: 'Solicitação rejeitada',
    senderId: request.senderId,
    receiverId: request.receiverId,
  };
}

/**
 * Cancela uma solicitação de amizade enviada
 */
export async function cancelFriendRequest(userId: string, requestId: string) {
  const request = await prisma.friendRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new Error('Solicitação não encontrada');
  }

  // Apenas o remetente pode cancelar
  if (request.senderId !== userId) {
    throw new Error('Você não tem permissão para cancelar esta solicitação');
  }

  if (request.status !== FriendshipStatus.PENDING) {
    throw new Error('Esta solicitação não está mais pendente');
  }

  // Deleta a solicitação
  await prisma.friendRequest.delete({
    where: { id: requestId },
  });

  return {
    success: true,
    message: 'Solicitação cancelada',
    senderId: request.senderId,
    receiverId: request.receiverId,
  };
}/**
 * Remove um amigo
 */
export async function removeFriend(userId: string, friendId: string) {
  // Verificar se são amigos
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    },
  });

  if (!friendship) {
    throw new Error('Vocês não são amigos');
  }

  // Remover amizade e solicitação em uma transação
  await prisma.$transaction(async (tx) => {
    // Remover amizade bidirecional
    await tx.friendship.deleteMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    // Remover/Limpar solicitações de amizade antigas entre esses usuários
    // Isso permite que eles possam se adicionar novamente no futuro
    await tx.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
    });
  });

  return { success: true, message: 'Amigo removido com sucesso' };
}

/**
 * Bloqueia um usuário
 */
export async function blockUser(userId: string, targetUserId: string) {
  if (userId === targetUserId) {
    throw new Error('Você não pode bloquear a si mesmo');
  }

  // Remover amizade se existir
  await prisma.friendship.deleteMany({
    where: {
      OR: [
        { userId, friendId: targetUserId },
        { userId: targetUserId, friendId: userId },
      ],
    },
  });

  // Verificar se já existe uma solicitação
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      senderId: targetUserId,
      receiverId: userId,
    },
  });

  if (existingRequest) {
    // Atualizar para bloqueado
    await prisma.friendRequest.update({
      where: { id: existingRequest.id },
      data: { status: FriendshipStatus.BLOCKED },
    });
  } else {
    // Criar registro de bloqueio
    await prisma.friendRequest.create({
      data: {
        senderId: targetUserId,
        receiverId: userId,
        status: FriendshipStatus.BLOCKED,
      },
    });
  }

  return { success: true, message: 'Usuário bloqueado com sucesso' };
}

/**
 * Retorna lista de amigos do usuário
 */
export async function getFriendsList(userId: string) {
  const friendships = await prisma.friendship.findMany({
    where: { userId },
    include: {
      friend: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          level: true,
          xp: true,
          currentStreak: true,
          coins: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return friendships.map((f) => ({
    ...f.friend,
    friendshipDate: f.createdAt,
  }));
}

/**
 * Retorna solicitações de amizade pendentes recebidas
 */
export async function getPendingRequests(userId: string) {
  const requests = await prisma.friendRequest.findMany({
    where: {
      receiverId: userId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          level: true,
          xp: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return requests;
}

/**
 * Retorna solicitações enviadas pelo usuário
 */
export async function getSentRequests(userId: string) {
  const requests = await prisma.friendRequest.findMany({
    where: {
      senderId: userId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      receiver: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          level: true,
          xp: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return requests;
}

/**
 * Busca usuários por username
 */
export async function searchUsers(currentUserId: string, query: string) {
  // Valida e sanitiza o termo de busca
  const validation = validateSearchTerm(query);
  
  if (!validation.valid) {
    throw new Error(validation.error || 'Termo de busca inválido');
  }

  const sanitizedQuery = validation.sanitized!;

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: currentUserId } },
        {
          OR: [
            { username: { contains: sanitizedQuery, mode: 'insensitive' } },
            { name: { contains: sanitizedQuery, mode: 'insensitive' } },
          ],
        },
      ],
    },
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
      level: true,
      xp: true,
    },
    take: 20,
  });

  // Verificar status de amizade/solicitação para cada usuário
  const usersWithStatus = await Promise.all(
    users.map(async (user) => {
      // Verificar se são amigos
      const friendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: currentUserId, friendId: user.id },
            { userId: user.id, friendId: currentUserId },
          ],
        },
      });

      if (friendship) {
        return { ...user, status: 'FRIENDS' as const };
      }

      // Verificar se há solicitação pendente
      const request = await prisma.friendRequest.findFirst({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: user.id },
            { senderId: user.id, receiverId: currentUserId },
          ],
          status: FriendshipStatus.PENDING,
        },
      });

      if (request) {
        return {
          ...user,
          status: request.senderId === currentUserId ? ('SENT' as const) : ('RECEIVED' as const),
        };
      }

      // Verificar se foi bloqueado
      const blocked = await prisma.friendRequest.findFirst({
        where: {
          senderId: user.id,
          receiverId: currentUserId,
          status: FriendshipStatus.BLOCKED,
        },
      });

      if (blocked) {
        return { ...user, status: 'BLOCKED' as const };
      }

      return { ...user, status: 'NONE' as const };
    })
  );

  return usersWithStatus;
}

/**
 * Retorna estatísticas de amigos do usuário
 */
export async function getFriendStats(userId: string) {
  const friendsCount = await prisma.friendship.count({
    where: { userId },
  });

  const pendingRequestsCount = await prisma.friendRequest.count({
    where: {
      receiverId: userId,
      status: FriendshipStatus.PENDING,
    },
  });

  const sentRequestsCount = await prisma.friendRequest.count({
    where: {
      senderId: userId,
      status: FriendshipStatus.PENDING,
    },
  });

  return {
    friendsCount,
    pendingRequestsCount,
    sentRequestsCount,
    maxFriends: MAX_FRIENDS,
  };
}

/**
 * Retorna atividades recentes dos amigos (Feed Social)
 * Versão profissional usando Prisma e reward_history como fonte única
 */
export async function getFriendActivity(userId: string, limit: number = 20, offset: number = 0) {
  try {
    console.log('[FEED SERVICE] Iniciando busca - userId:', userId);
    
    // Buscar IDs dos amigos
    const friendships = await prisma.friendship.findMany({
      where: { userId },
      select: { friendId: true },
    });

    const friendIds = friendships.map((f) => f.friendId);

    console.log('[FEED SERVICE] Amigos encontrados:', friendIds.length);

    if (friendIds.length === 0) {
      console.log('[FEED SERVICE] Usuário não tem amigos, retornando array vazio');
      return [];
    }

    // Buscar atividades do reward_history
    const allActivities = await prisma.rewardHistory.findMany({
      where: {
        userId: { in: friendIds },
        source: {
          in: [
            'CHALLENGE_COMPLETION',
            'BADGE_ACHIEVEMENT',
            'LEVEL_PROGRESSION',
          ],
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            level: true,
            currentStreak: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('[FEED SERVICE] Atividades brutas encontradas:', allActivities.length);

    // Buscar UserChallenges para atividades de CHALLENGE_COMPLETION
    const challengeCompletionIds = allActivities
      .filter(a => a.source === 'CHALLENGE_COMPLETION' && a.sourceId)
      .map(a => a.sourceId as string);

    console.log('[FEED SERVICE] 🔍 IDs de desafios para buscar:', challengeCompletionIds);

    const userChallenges = challengeCompletionIds.length > 0
      ? await prisma.userChallenge.findMany({
          where: {
            id: { in: challengeCompletionIds },
          },
          select: {
            id: true,
            photoUrl: true,
            caption: true,
            challenge: {
              select: {
                category: true,
              },
            },
          },
        })
      : [];

    console.log('[FEED SERVICE] 📦 UserChallenges encontrados:', userChallenges.length);
    console.log('[FEED SERVICE] 📸 UserChallenges com foto:', userChallenges.filter(uc => uc.photoUrl).length);
    
    // Log detalhado dos UserChallenges com foto
    userChallenges.forEach(uc => {
      if (uc.photoUrl) {
        console.log('[FEED SERVICE] 📷 UserChallenge:', {
          id: uc.id,
          photoUrl: uc.photoUrl?.substring(0, 80) + '...',
          caption: uc.caption,
        });
      }
    });

    // Criar mapa de UserChallenges para acesso rápido
    const userChallengeMap = new Map(
      userChallenges.map(uc => [uc.id, uc])
    );

    // Buscar convites associados aos UserChallenges (para saber se foi desafiado por alguém)
    const invitations = challengeCompletionIds.length > 0
      ? await prisma.challengeInvitation.findMany({
          where: {
            userChallengeId: { in: challengeCompletionIds },
            status: 'ACCEPTED', // Apenas convites aceitos
          },
          select: {
            userChallengeId: true,
            fromUser: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        })
      : [];

    const invitationMap = new Map(
      invitations.map(inv => [inv.userChallengeId, inv])
    );

    console.log('[FEED SERVICE] 🎯 Convites encontrados:', invitations.length);

    // Agrupar por sourceId (unificar XP + Moedas de uma mesma tarefa)
    const groupedMap = new Map<string, any>();
    
    for (const activity of allActivities) {
      const key = activity.sourceId || activity.id;
      const userChallenge = activity.sourceId ? userChallengeMap.get(activity.sourceId) : null;
      
      if (!groupedMap.has(key)) {
        // Primeira entrada para esta atividade
        groupedMap.set(key, {
          id: activity.id, // Usar primeiro ID encontrado
          source: activity.source,
          sourceId: activity.sourceId,
          userId: activity.user.id,
          username: activity.user.username,
          name: activity.user.name,
          avatarUrl: activity.user.avatarUrl,
          level: activity.user.level,
          currentStreak: activity.user.currentStreak,
          description: activity.description,
          createdAt: activity.createdAt,
          xpAmount: activity.type === 'XP' ? activity.amount : 0,
          coinsAmount: activity.type === 'COINS' ? activity.amount : 0,
          // Dados do desafio (se houver)
          photoUrl: userChallenge?.photoUrl || null,
          caption: userChallenge?.caption || null,
          category: userChallenge?.challenge?.category || null,
        });
      } else {
        // Somar XP ou Moedas à entrada existente
        const existing = groupedMap.get(key);
        if (activity.type === 'XP') {
          existing.xpAmount += activity.amount;
        } else if (activity.type === 'COINS') {
          existing.coinsAmount += activity.amount;
        }
        // Preservar photoUrl e caption se ainda não estiverem definidos
        if (!existing.photoUrl && userChallenge?.photoUrl) {
          existing.photoUrl = userChallenge.photoUrl;
        }
        if (!existing.caption && userChallenge?.caption) {
          existing.caption = userChallenge.caption;
        }
        if (!existing.category && userChallenge?.challenge?.category) {
          existing.category = userChallenge.challenge.category;
        }
      }
    }

    // Converter Map para array e ordenar por data
    const groupedActivities = Array.from(groupedMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    console.log('[FEED SERVICE] Atividades agrupadas:', groupedActivities.length);

    // Mapear para formato do feed
    const mappedActivities = groupedActivities.map((activity) => {
      let type = '';
      let metadata = '';

      switch (activity.source) {
        case 'CHALLENGE_COMPLETION':
          type = 'CHALLENGE_COMPLETED';
          metadata = activity.category || '';
          break;
        case 'BADGE_ACHIEVEMENT':
          type = 'BADGE_EARNED';
          metadata = '';
          break;
        case 'LEVEL_PROGRESSION':
          type = 'LEVEL_UP';
          metadata = String(activity.level);
          break;
        default:
          if (activity.source.includes('streak')) {
            type = 'STREAK_MILESTONE';
            metadata = String(activity.currentStreak);
          }
      }

      const result = {
        id: activity.id,
        type,
        userId: activity.userId,
        username: activity.username,
        name: activity.name,
        avatarUrl: activity.avatarUrl,
        description: activity.description,
        metadata,
        photoUrl: activity.photoUrl,
        caption: activity.caption,
        createdAt: activity.createdAt.toISOString(),
        xpReward: activity.xpAmount, // XP total (somado)
        coinsReward: activity.coinsAmount, // Moedas total (somado)
        invitedBy: null as any, // Será preenchido se houver convite
      };

      // Se for um desafio completado e houver um convite vinculado, incluir informação de quem desafiou
      if (activity.source === 'CHALLENGE_COMPLETION' && activity.sourceId) {
        const invitation = invitationMap.get(activity.sourceId);
        if (invitation?.fromUser) {
          result.invitedBy = {
            id: invitation.fromUser.id,
            name: invitation.fromUser.name,
            username: invitation.fromUser.username,
            avatarUrl: invitation.fromUser.avatarUrl,
          };
          console.log('[FEED SERVICE] 🎯 Desafio com convite detectado:', {
            activityId: result.id,
            invitedBy: result.invitedBy.name,
          });
        }
      }

      // Log detalhado para debug
      if (activity.photoUrl) {
        console.log('[FEED SERVICE] 📸 Atividade COM FOTO:', {
          id: result.id,
          photoUrl: result.photoUrl,
          caption: result.caption,
          source: activity.source,
          sourceId: activity.sourceId,
        });
      }

      return result;
    });

    console.log('[FEED SERVICE] 📊 Total de atividades retornadas:', mappedActivities.length);
    console.log('[FEED SERVICE] 📸 Atividades com foto:', mappedActivities.filter(a => a.photoUrl).length);

    return mappedActivities;
  } catch (error) {
    console.error('[FEED SERVICE] Erro na função getFriendActivity:', error);
    throw error;
  }
}

/**
 * Retorna amigos em comum entre dois usuários
 */
export async function getMutualFriends(userId: string, friendId: string) {
  const userFriends = await prisma.friendship.findMany({
    where: { userId },
    select: { friendId: true },
  });

  const friendFriends = await prisma.friendship.findMany({
    where: { userId: friendId },
    select: { friendId: true },
  });

  const userFriendIds = userFriends.map((f) => f.friendId);
  const friendFriendIds = friendFriends.map((f) => f.friendId);

  const mutualFriendIds = userFriendIds.filter((id) => friendFriendIds.includes(id));

  const mutualFriends = await prisma.user.findMany({
    where: {
      id: { in: mutualFriendIds },
    },
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
      level: true,
      xp: true,
    },
  });

  return mutualFriends;
}
