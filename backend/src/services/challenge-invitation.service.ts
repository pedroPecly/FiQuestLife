/**
 * ============================================
 * CHALLENGE INVITATION SERVICE
 * ============================================
 * 
 * Lógica de negócio para convites de desafios entre amigos:
 * - Criar convites de desafios
 * - Aceitar/rejeitar convites
 * - Listar convites recebidos/enviados
 * - Gerenciar limite de convites
 * 
 * @created 1 de dezembro de 2025
 */

import { ChallengeInvitationStatus } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { handleSocialEvent } from './auto-verify.service.js';
import { notifyChallengeAccepted, notifyChallengeInvite } from './notification.service.js';

interface CreateInvitationParams {
  fromUserId: string;
  toUserId: string;
  challengeId: string;
  message?: string;
}

/**
 * Cria um convite de desafio para um amigo
 * Verifica se são amigos e se o limite diário não foi excedido
 */
export const createChallengeInvitation = async (params: CreateInvitationParams) => {
  const { fromUserId, toUserId, challengeId, message } = params;

  // Verifica se são amigos
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: fromUserId, friendId: toUserId },
        { userId: toUserId, friendId: fromUserId },
      ],
    },
  });

  if (!friendship) {
    throw new Error('Só é possível desafiar amigos');
  }

  // Verifica se o desafio existe e está ativo
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge || !challenge.isActive) {
    throw new Error('Desafio não encontrado ou inativo');
  }

  // Verifica se o usuário remetente tem esse desafio hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const senderHasChallenge = await prisma.userChallenge.findFirst({
    where: {
      userId: fromUserId,
      challengeId,
      assignedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (!senderHasChallenge) {
    throw new Error('Você só pode desafiar amigos em desafios que você tem hoje');
  }

  // Calcula quando o convite expira:
  // - O convite expira em 24h OU quando o desafio do remetente expirar (o que ocorrer primeiro)
  // - Desafios diários expiram às 23:59:59 do dia atual
  const now = new Date();
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  // Usa o menor tempo entre 24h e o fim do dia
  const expiresAt = twentyFourHoursFromNow < endOfDay ? twentyFourHoursFromNow : endOfDay;

  // Verifica se este desafio veio de um convite HOJE (não pode ser usado para desafiar no mesmo dia)
  // Convites de dias anteriores não bloqueiam mais
  const receivedInvitation = await prisma.challengeInvitation.findFirst({
    where: {
      toUserId: fromUserId,
      challengeId, // Verifica pelo challengeId ao invés do userChallengeId
      status: {
        in: [ChallengeInvitationStatus.PENDING, ChallengeInvitationStatus.ACCEPTED],
      },
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (receivedInvitation) {
    throw new Error('Você não pode desafiar alguém com um desafio que recebeu hoje de outro usuário');
  }

  // Verifica limite: 1 convite total por amigo por dia (independente do desafio)
  const existingInvitationToday = await prisma.challengeInvitation.findFirst({
    where: {
      fromUserId,
      toUserId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (existingInvitationToday) {
    throw new Error('Você já desafiou este amigo hoje. Tente novamente amanhã!');
  }

  // Verifica se já usou este desafio específico para desafiar alguém hoje
  const challengeUsedToday = await prisma.challengeInvitation.findFirst({
    where: {
      fromUserId,
      challengeId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (challengeUsedToday) {
    throw new Error('Você já usou este desafio para desafiar alguém hoje. Escolha outro desafio!');
  }

  // Verifica se o amigo já tem este desafio hoje
  const friendChallenge = await prisma.userChallenge.findFirst({
    where: {
      userId: toUserId,
      challengeId,
      assignedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Cria o convite
  const invitation = await prisma.challengeInvitation.create({
    data: {
      fromUserId,
      toUserId,
      challengeId,
      message,
      userChallengeId: friendChallenge?.id, // Vincula se já existe
      status: ChallengeInvitationStatus.PENDING,
      expiresAt, // Define a data de expiração
    },
    include: {
      fromUser: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      toUser: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      challenge: true,
    },
  });

  // Envia notificação para o amigo
  const notification = await notifyChallengeInvite(invitation);

  // Verifica e completa desafios auto-verificáveis (ex: "Desafie um Amigo")
  handleSocialEvent(fromUserId, 'CHALLENGE_INVITE_SENT').catch((error) => {
    console.error('[CHALLENGE INVITATION] Erro ao verificar desafios automáticos:', error);
  });

  return {
    ...invitation,
    notification, // Inclui notificação na resposta
  };
};

/**
 * Aceita um convite de desafio
 * Se o usuário não tem o desafio, adiciona como extra
 */
export const acceptChallengeInvitation = async (invitationId: string, userId: string) => {
  const invitation = await prisma.challengeInvitation.findUnique({
    where: { id: invitationId },
    include: {
      challenge: true,
      fromUser: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      toUser: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!invitation) {
    throw new Error('Convite não encontrado');
  }

  if (invitation.toUserId !== userId) {
    throw new Error('Este convite não é para você');
  }

  if (invitation.status !== ChallengeInvitationStatus.PENDING) {
    throw new Error('Este convite já foi processado');
  }

  // Verifica se o convite expirou
  const now = new Date();
  if (invitation.expiresAt && now > invitation.expiresAt) {
    // Marca como expirado
    await prisma.challengeInvitation.update({
      where: { id: invitationId },
      data: { status: ChallengeInvitationStatus.EXPIRED },
    });
    throw new Error('Este convite expirou. O desafio não está mais disponível.');
  }

  try {
    // Se já tem o desafio vinculado, apenas atualiza o status
    if (invitation.userChallengeId) {
      await prisma.challengeInvitation.update({
        where: { id: invitationId },
        data: { status: ChallengeInvitationStatus.ACCEPTED },
      });
    } else {
      // Verifica se o usuário já tem este desafio hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingUserChallenge = await prisma.userChallenge.findFirst({
        where: {
          userId,
          challengeId: invitation.challengeId,
          assignedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (existingUserChallenge) {
        // Se já tem, apenas vincula ao convite
        await prisma.challengeInvitation.update({
          where: { id: invitationId },
          data: {
            status: ChallengeInvitationStatus.ACCEPTED,
            userChallengeId: existingUserChallenge.id,
          },
        });
      } else {
        // Cria um novo UserChallenge como "extra" (desafio adicional)
        const newUserChallenge = await prisma.userChallenge.create({
          data: {
            userId,
            challengeId: invitation.challengeId,
            status: 'PENDING',
          },
        });

        // Atualiza o convite com o novo UserChallenge
        await prisma.challengeInvitation.update({
          where: { id: invitationId },
          data: {
            status: ChallengeInvitationStatus.ACCEPTED,
            userChallengeId: newUserChallenge.id,
          },
        });
      }
    }

    // Notifica o remetente que o desafio foi aceito
    // Notificação não deve bloquear o fluxo principal
    const notification = await notifyChallengeAccepted(invitation).catch((error) => {
      console.error('[CHALLENGE INVITATION] Erro ao enviar notificação:', error);
      return null;
    });

    // Verifica e completa desafios auto-verificáveis (ex: "Aceite um Desafio")
    handleSocialEvent(userId, 'CHALLENGE_INVITE_ACCEPTED').catch((error) => {
      console.error('[CHALLENGE INVITATION] Erro ao verificar desafios automáticos:', error);
    });

    // Busca o convite atualizado
    const updatedInvitation = await prisma.challengeInvitation.findUnique({
      where: { id: invitationId },
      include: {
        challenge: true,
        fromUser: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        userChallenge: true,
      },
    });

    return {
      ...updatedInvitation,
      notification, // Inclui notificação na resposta
    };
  } catch (error) {
    console.error('[CHALLENGE INVITATION SERVICE] Erro ao aceitar convite:', error);
    throw error;
  }
};

/**
 * Rejeita um convite de desafio e o deleta do banco
 * Convites rejeitados não precisam ser mantidos
 */
export const rejectChallengeInvitation = async (invitationId: string, userId: string) => {
  const invitation = await prisma.challengeInvitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    throw new Error('Convite não encontrado');
  }

  if (invitation.toUserId !== userId) {
    throw new Error('Este convite não é para você');
  }

  if (invitation.status !== ChallengeInvitationStatus.PENDING) {
    throw new Error('Este convite já foi processado');
  }

  // Deleta o convite ao invés de marcar como REJECTED
  // Convites rejeitados não precisam histórico
  await prisma.challengeInvitation.delete({
    where: { id: invitationId },
  });

  return { success: true, message: 'Convite rejeitado' };
};

/**
 * Lista convites recebidos pendentes
 * Marca automaticamente convites expirados e retorna apenas os válidos
 */
export const getPendingInvitations = async (userId: string) => {
  const now = new Date();

  // Marca convites expirados automaticamente
  await prisma.challengeInvitation.updateMany({
    where: {
      toUserId: userId,
      status: ChallengeInvitationStatus.PENDING,
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: ChallengeInvitationStatus.EXPIRED,
    },
  });

  // Retorna apenas convites pendentes e não expirados
  return prisma.challengeInvitation.findMany({
    where: {
      toUserId: userId,
      status: ChallengeInvitationStatus.PENDING,
      expiresAt: {
        gte: now,
      },
    },
    include: {
      challenge: true,
      fromUser: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Lista todos os convites (recebidos e enviados) do usuário
 */
export const getUserInvitations = async (userId: string) => {
  const [received, sent] = await Promise.all([
    prisma.challengeInvitation.findMany({
      where: { toUserId: userId },
      include: {
        challenge: true,
        fromUser: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.challengeInvitation.findMany({
      where: { fromUserId: userId },
      include: {
        challenge: true,
        toUser: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  return { received, sent };
};

/**
 * Verifica se um UserChallenge tem convite associado
 */
export const getChallengeInvitationByUserChallenge = async (userChallengeId: string) => {
  return prisma.challengeInvitation.findUnique({
    where: { userChallengeId },
    include: {
      fromUser: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
};

/**
 * Limpa convites aceitos após o desafio ser completado
 * Mantém o registro apenas durante o período ativo do desafio
 * Depois de 7 dias da conclusão, o convite pode ser deletado
 */
export const cleanupCompletedInvitations = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Busca convites aceitos cujo UserChallenge foi completado há mais de 7 dias
  const completedInvitations = await prisma.challengeInvitation.findMany({
    where: {
      status: ChallengeInvitationStatus.ACCEPTED,
      userChallenge: {
        status: 'COMPLETED',
        completedAt: {
          lt: sevenDaysAgo,
        },
      },
    },
    select: { id: true },
  });

  if (completedInvitations.length > 0) {
    const deletedCount = await prisma.challengeInvitation.deleteMany({
      where: {
        id: {
          in: completedInvitations.map(inv => inv.id),
        },
      },
    });

    console.log(`[CLEANUP] 🧹 Deletados ${deletedCount.count} convites de desafios completados`);
    return deletedCount.count;
  }

  return 0;
};

/**
 * Marca convites pendentes expirados e limpa convites expirados antigos
 * Convites expirados há mais de 7 dias podem ser deletados
 */
export const cleanupExpiredInvitations = async () => {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Marca convites pendentes que expiraram como EXPIRED
  const markedCount = await prisma.challengeInvitation.updateMany({
    where: {
      status: ChallengeInvitationStatus.PENDING,
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: ChallengeInvitationStatus.EXPIRED,
    },
  });

  console.log(`[CLEANUP] ⏰ Marcados ${markedCount.count} convites como expirados`);

  // Deleta convites expirados há mais de 7 dias
  const deletedCount = await prisma.challengeInvitation.deleteMany({
    where: {
      status: ChallengeInvitationStatus.EXPIRED,
      expiresAt: {
        lt: sevenDaysAgo,
      },
    },
  });

  console.log(`[CLEANUP] 🧹 Deletados ${deletedCount.count} convites expirados antigos`);
  return { marked: markedCount.count, deleted: deletedCount.count };
};
