/**
 * ============================================
 * CHALLENGE INVITATION SERVICE - Frontend
 * ============================================
 * 
 * Serviço para gerenciar convites de desafios entre amigos
 */

import api from './api';

export interface ChallengeInvitation {
  id: string;
  fromUserId: string;
  toUserId: string;
  challengeId: string;
  userChallengeId: string | null;
  date: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  message?: string;
  createdAt: string;
  updatedAt: string;
  fromUser?: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
  toUser?: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
  challenge: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    xpReward: number;
    coinsReward: number;
  };
  userChallenge?: {
    id: string;
    status: string;
    progress: number;
    completedAt: string | null;
  };
}

interface CreateInviteParams {
  challengeId: string;
  toUserId: string;
  message?: string;
}

/**
 * Cria um convite de desafio para um amigo
 */
export const createChallengeInvite = async (params: CreateInviteParams) => {
  try {
    const response = await api.post(`/challenges/${params.challengeId}/invite`, {
      toUserId: params.toUserId,
      message: params.message,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao criar convite');
    }

    return response.data.data as ChallengeInvitation;
  } catch (error: any) {
    console.error('[CHALLENGE INVITATION] Erro ao criar convite:', error);
    throw new Error(error.response?.data?.message || 'Erro ao criar convite');
  }
};

/**
 * Aceita um convite de desafio
 */
export const acceptChallengeInvite = async (invitationId: string) => {
  try {
    const response = await api.patch(`/challenge-invitations/${invitationId}/accept`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao aceitar convite');
    }

    return response.data.data as ChallengeInvitation;
  } catch (error: any) {
    console.error('[CHALLENGE INVITATION] Erro ao aceitar convite:', error);
    throw new Error(error.response?.data?.message || 'Erro ao aceitar convite');
  }
};

/**
 * Rejeita um convite de desafio
 */
export const rejectChallengeInvite = async (invitationId: string) => {
  try {
    const response = await api.patch(`/challenge-invitations/${invitationId}/reject`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao rejeitar convite');
    }

    return response.data.data as ChallengeInvitation;
  } catch (error: any) {
    console.error('[CHALLENGE INVITATION] Erro ao rejeitar convite:', error);
    throw new Error(error.response?.data?.message || 'Erro ao rejeitar convite');
  }
};

/**
 * Lista convites pendentes do usuário
 */
export const getPendingInvites = async () => {
  try {
    const response = await api.get('/challenge-invitations/pending');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao buscar convites');
    }

    return response.data.data as ChallengeInvitation[];
  } catch (error: any) {
    console.error('[CHALLENGE INVITATION] Erro ao buscar convites pendentes:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar convites');
  }
};

/**
 * Lista todos os convites do usuário (recebidos e enviados)
 */
export const getUserInvites = async () => {
  try {
    const response = await api.get('/challenge-invitations');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao buscar convites');
    }

    return response.data.data as {
      received: ChallengeInvitation[];
      sent: ChallengeInvitation[];
    };
  } catch (error: any) {
    console.error('[CHALLENGE INVITATION] Erro ao buscar convites:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar convites');
  }
};

/**
 * Verifica se um UserChallenge tem convite associado
 */
export const getInvitationByUserChallenge = async (userChallengeId: string) => {
  try {
    const response = await api.get(`/challenge-invitations/user-challenge/${userChallengeId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao buscar convite');
    }

    return response.data.data as ChallengeInvitation | null;
  } catch (error: any) {
    console.error('[CHALLENGE INVITATION] Erro ao buscar convite:', error);
    return null;
  }
};

/**
 * Verifica quais amigos já foram desafiados hoje
 */
export const getFriendsAlreadyChallengedToday = async () => {
  try {
    const invites = await getUserInvites();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filtra convites enviados hoje
    const todayInvites = invites.sent.filter((invite) => {
      const inviteDate = new Date(invite.createdAt);
      inviteDate.setHours(0, 0, 0, 0);
      return inviteDate.getTime() === today.getTime();
    });

    // Retorna array de IDs dos amigos já desafiados
    return todayInvites.map((invite) => invite.toUserId);
  } catch (error: any) {
    console.error('[CHALLENGE INVITATION] Erro ao verificar amigos desafiados:', error);
    return [];
  }
};

/**
 * Verifica quais desafios já foram usados para desafiar alguém hoje
 * OU foram recebidos de outros usuários (não podem ser usados para desafiar)
 */
export const getChallengesAlreadyUsedToday = async () => {
  try {
    const invites = await getUserInvites();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filtra convites enviados hoje
    const todayInvites = invites.sent.filter((invite) => {
      const inviteDate = new Date(invite.createdAt);
      inviteDate.setHours(0, 0, 0, 0);
      return inviteDate.getTime() === today.getTime();
    });

    // Pega IDs dos desafios já enviados
    const sentChallengeIds = todayInvites.map((invite) => invite.challengeId);

    // Pega IDs dos desafios recebidos (aceitos ou pendentes)
    // Estes também não podem ser usados para desafiar
    const receivedChallengeIds = invites.received
      .filter((invite) => 
        invite.status === 'PENDING' || invite.status === 'ACCEPTED'
      )
      .map((invite) => invite.challengeId);

    // Retorna array único com todos os IDs
    return [...new Set([...sentChallengeIds, ...receivedChallengeIds])];
  } catch (error: any) {
    console.error('[CHALLENGE INVITATION] Erro ao verificar desafios usados:', error);
    return [];
  }
};
