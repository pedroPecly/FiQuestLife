import { FriendshipStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { validateSearchTerm } from '../utils/validation';

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
    },
  });

  return friendRequest;
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
      },
    });
  });

  return result;
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
 * Tipos: CHALLENGE_COMPLETED, BADGE_EARNED, LEVEL_UP, STREAK_MILESTONE
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

    console.log('[FEED SERVICE] Amigos encontrados:', friendIds.length, 'IDs:', friendIds);

    if (friendIds.length === 0) {
      console.log('[FEED SERVICE] Usuário não tem amigos, retornando array vazio');
      return [];
    }

    console.log('[FEED SERVICE] Executando query SQL...');

    // Criar placeholders para os IDs ($1, $2, $3, etc)
    const placeholders = friendIds.map((_, index) => `$${index + 1}`).join(',');

    // Buscar atividades dos amigos - usando IN ao invés de ANY
    const activities = await prisma.$queryRawUnsafe<any[]>(
      `
      (
        SELECT 
          'CHALLENGE_COMPLETED' as type,
          uc.user_id as "userId",
          u.username,
          u.name,
          u.avatar_url as "avatarUrl",
          c.title as description,
          CAST(c.category as TEXT) as metadata,
          uc.completed_at as "createdAt",
          c.xp_reward as "xpReward"
        FROM user_challenges uc
        JOIN users u ON u.id = uc.user_id
        JOIN challenges c ON c.id = uc.challenge_id
        WHERE uc.user_id IN (${placeholders})
          AND uc.status = 'COMPLETED'
          AND uc.completed_at IS NOT NULL
          AND uc.completed_at > NOW() - INTERVAL '7 days'
      )
      UNION ALL
      (
        SELECT 
          'BADGE_EARNED' as type,
          ub.user_id as "userId",
          u.username,
          u.name,
          u.avatar_url as "avatarUrl",
          b.name as description,
          CAST(b.rarity as TEXT) as metadata,
          ub.earned_at as "createdAt",
          0 as "xpReward"
        FROM user_badges ub
        JOIN users u ON u.id = ub.user_id
        JOIN badges b ON b.id = ub.badge_id
        WHERE ub.user_id IN (${placeholders})
          AND ub.earned_at > NOW() - INTERVAL '7 days'
      )
      UNION ALL
      (
        SELECT 
          'LEVEL_UP' as type,
          rh.user_id as "userId",
          u.username,
          u.name,
          u.avatar_url as "avatarUrl",
          rh.description,
          CAST(u.level as TEXT) as metadata,
          rh.created_at as "createdAt",
          rh.amount as "xpReward"
        FROM reward_history rh
        JOIN users u ON u.id = rh.user_id
        WHERE rh.user_id IN (${placeholders})
          AND rh.type = 'XP'
          AND rh.source = 'level_up'
          AND rh.created_at > NOW() - INTERVAL '7 days'
      )
      UNION ALL
      (
        SELECT 
          'STREAK_MILESTONE' as type,
          rh.user_id as "userId",
          u.username,
          u.name,
          u.avatar_url as "avatarUrl",
          rh.description,
          CAST(u.current_streak as TEXT) as metadata,
          rh.created_at as "createdAt",
          rh.amount as "xpReward"
        FROM reward_history rh
        JOIN users u ON u.id = rh.user_id
        WHERE rh.user_id IN (${placeholders})
          AND rh.source LIKE '%streak%'
          AND rh.created_at > NOW() - INTERVAL '7 days'
      )
      ORDER BY "createdAt" DESC
      LIMIT $${friendIds.length + 1}
      OFFSET $${friendIds.length + 2}
      `,
      ...friendIds,
      limit,
      offset
    );

    console.log('[FEED SERVICE] Query executada com sucesso. Atividades:', activities.length);

    return activities.map(activity => ({
      ...activity,
      createdAt: new Date(activity.createdAt).toISOString(),
    }));
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
