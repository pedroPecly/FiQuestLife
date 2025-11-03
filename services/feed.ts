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
  type: FeedActivityType;
  userId: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  description: string;
  metadata?: string; // category, rarity, level, etc
  createdAt: string;
  xpReward?: number;
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
}

export const feedService = new FeedService();
