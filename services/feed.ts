/**
 * ============================================
 * FEED SERVICE
 * ============================================
 * 
 * Serviço para feed de atividades dos amigos
 * 
 * @created 2 de novembro de 2025
 */

import api from './api';

// ============================================
// INTERFACES
// ============================================

export type FeedActivityType = 
  | 'CHALLENGE_COMPLETED'
  | 'BADGE_EARNED'
  | 'LEVEL_UP'
  | 'STREAK_MILESTONE';

export interface FeedActivity {
  id: string; // ID único da atividade
  type: FeedActivityType;
  userId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  description: string;
  metadata?: string; // category, rarity, level, etc
  photoUrl?: string | null; // URL da foto do desafio (se houver)
  caption?: string | null; // Legenda da foto (se houver)
  createdAt: string;
  xpReward?: number;
  coinsReward?: number; // Adicionar moedas
  // Contadores de interações
  likesCount?: number;
  commentsCount?: number;
  isLikedByUser?: boolean;
  // Informação de convite de desafio
  invitedBy?: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  } | null;
}

// ============================================
// SERVIÇO
// ============================================

class FeedService {
  /**
   * Busca feed de atividades dos amigos
   */
  async getFriendActivity(
    limit: number = 20,
    offset: number = 0
  ): Promise<FeedActivity[]> {
    const response = await api.get('/friends/activity', {
      params: { limit, offset },
    });
    return response.data.data;
  }

  /**
   * Busca atividades do próprio usuário
   */
  async getMyActivity(
    limit: number = 20,
    offset: number = 0
  ): Promise<FeedActivity[]> {
    const response = await api.get('/user/my-activity', {
      params: { limit, offset },
    });
    return response.data.data;
  }
}

export const feedService = new FeedService();
