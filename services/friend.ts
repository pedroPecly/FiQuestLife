/**
 * ============================================
 * FRIEND SERVICE - SERVIÇO DE AMIGOS
 * ============================================
 * 
 * Gerencia todas as operações relacionadas a amigos:
 * - Enviar/aceitar/rejeitar solicitações
 * - Lista de amigos
 * - Busca de usuários
 * - Atividades dos amigos
 */

import api from './api';

// ============================================
// INTERFACES
// ============================================

export interface Friend {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  currentStreak: number;
  coins: number;
  friendshipDate: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
  sender?: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
    level: number;
    xp: number;
  };
  receiver?: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
    level: number;
    xp: number;
  };
}

export interface UserSearchResult {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  status: 'NONE' | 'FRIENDS' | 'SENT' | 'RECEIVED' | 'BLOCKED';
}

export interface FriendStats {
  friendsCount: number;
  pendingRequestsCount: number;
  sentRequestsCount: number;
  maxFriends: number;
}

export interface FriendActivity {
  type: 'CHALLENGE_COMPLETED' | 'BADGE_EARNED' | 'REWARD';
  userId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  description: string;
  createdAt: string;
  xpReward?: number;
}

// ============================================
// SERVIÇO
// ============================================

class FriendService {
  /**
   * Envia uma solicitação de amizade
   */
  async sendFriendRequest(targetUserId: string): Promise<FriendRequest> {
    const response = await api.post('/friends/request', { targetUserId });
    
    // Processar notificação se vier na resposta
    if (response.data.notification) {
      const { processNotificationFromResponse } = await import('./notifications');
      await processNotificationFromResponse(response.data.notification);
    }
    
    return response.data.data;
  }

  /**
   * Aceita uma solicitação de amizade
   */
  async acceptFriendRequest(requestId: string): Promise<FriendRequest> {
    const response = await api.post(`/friends/accept/${requestId}`);
    
    // Processar notificação se vier na resposta
    if (response.data.notification) {
      const { processNotificationFromResponse } = await import('./notifications');
      await processNotificationFromResponse(response.data.notification);
    }
    
    return response.data.data;
  }

  /**
   * Rejeita uma solicitação de amizade
   */
  async rejectFriendRequest(requestId: string): Promise<FriendRequest> {
    const response = await api.post(`/friends/reject/${requestId}`);
    return response.data.data;
  }

  /**
   * Cancela uma solicitação de amizade enviada
   */
  async cancelFriendRequest(requestId: string): Promise<void> {
    await api.post(`/friends/cancel/${requestId}`);
  }

  /**
   * Remove um amigo
   */
  async removeFriend(friendId: string): Promise<void> {
    await api.delete(`/friends/${friendId}`);
  }

  /**
   * Bloqueia um usuário
   */
  async blockUser(userId: string): Promise<void> {
    await api.post(`/friends/block/${userId}`);
  }

  /**
   * Retorna lista de amigos
   */
  async getFriendsList(): Promise<Friend[]> {
    const response = await api.get('/friends');
    return response.data.data;
  }

  /**
   * Retorna solicitações pendentes recebidas
   */
  async getPendingRequests(): Promise<FriendRequest[]> {
    const response = await api.get('/friends/requests');
    return response.data.data;
  }

  /**
   * Retorna solicitações enviadas
   */
  async getSentRequests(): Promise<FriendRequest[]> {
    const response = await api.get('/friends/sent');
    return response.data.data;
  }

  /**
   * Busca usuários por username/nome
   */
  async searchUsers(query: string): Promise<UserSearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const response = await api.get('/friends/search', {
      params: { q: query },
    });
    return response.data.data;
  }

  /**
   * Retorna estatísticas de amigos
   */
  async getFriendStats(): Promise<FriendStats> {
    const response = await api.get('/friends/stats');
    return response.data.data;
  }

  /**
   * Retorna atividades dos amigos
   */
  async getFriendActivity(limit: number = 20, offset: number = 0): Promise<FriendActivity[]> {
    const response = await api.get('/friends/activity', {
      params: { limit, offset },
    });
    return response.data.data;
  }

  /**
   * Retorna amigos em comum
   */
  async getMutualFriends(friendId: string): Promise<Friend[]> {
    const response = await api.get(`/friends/mutual/${friendId}`);
    return response.data.data;
  }
}

export const friendService = new FriendService();
