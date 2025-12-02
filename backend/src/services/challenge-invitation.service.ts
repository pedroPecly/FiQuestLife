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

  // Verifica se este desafio veio de um convite (não pode ser usado para desafiar)
  const receivedInvitation = await prisma.challengeInvitation.findFirst({
    where: {
      toUserId: fromUserId,
      userChallengeId: senderHasChallenge.id,
      status: {
        in: [ChallengeInvitationStatus.PENDING, ChallengeInvitationStatus.ACCEPTED],
      },
    },
  });

  if (receivedInvitation) {
    throw new Error('Você não pode desafiar alguém com um desafio que recebeu de outro usuário');
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
  await notifyChallengeInvite(invitation);

  // Verifica e completa desafios auto-verificáveis (ex: "Desafie um Amigo")
  handleSocialEvent(fromUserId, 'CHALLENGE_INVITE_SENT').catch((error) => {
    console.error('[CHALLENGE INVITATION] Erro ao verificar desafios automáticos:', error);
  });

  return invitation;
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
    notifyChallengeAccepted(invitation).catch((error) => {
      console.error('[CHALLENGE INVITATION] Erro ao enviar notificação:', error);
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

    return updatedInvitation;
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
 */
export const getPendingInvitations = async (userId: string) => {
  return prisma.challengeInvitation.findMany({
    where: {
      toUserId: userId,
      status: ChallengeInvitationStatus.PENDING,
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
 * Limpa convites pendentes expirados (mais de 7 dias)
 * Convites não respondidos após 7 dias podem ser deletados
 */
export const cleanupExpiredInvitations = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const deletedCount = await prisma.challengeInvitation.deleteMany({
    where: {
      status: ChallengeInvitationStatus.PENDING,
      createdAt: {
        lt: sevenDaysAgo,
      },
    },
  });

  console.log(`[CLEANUP] 🧹 Deletados ${deletedCount.count} convites pendentes expirados`);
  return deletedCount.count;
};
