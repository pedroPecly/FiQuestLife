/**
 * ============================================
 * LEADERBOARD SERVICE
 * ============================================
 * 
 * Serviço para rankings e classificações
 * 
 * @created 2 de novembro de 2025
 */

import api from './api';

// ============================================
// INTERFACES
// ============================================

export type LeaderboardType = 'xp' | 'streak' | 'challenges' | 'distance';
export type LeaderboardScope = 'friends' | 'global';

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  challengesCompleted: number;
  totalDistance?: number; // em km
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  type: LeaderboardType;
  leaderboard: LeaderboardEntry[];
  currentUserRank: number | null;
  totalUsers: number;
}

// ============================================
// SERVIÇO
// ============================================

class LeaderboardService {
  /**
   * Busca ranking de amigos
   */
  async getFriendsLeaderboard(
    type: LeaderboardType = 'xp',
    limit: number = 50
  ): Promise<LeaderboardResponse> {
    const response = await api.get('/leaderboard/friends', {
      params: { type, limit },
    });
    return response.data.data;
  }

  /**
   * Busca ranking global
   */
  async getGlobalLeaderboard(
    type: LeaderboardType = 'xp',
    limit: number = 100
  ): Promise<LeaderboardResponse> {
    const response = await api.get('/leaderboard/global', {
      params: { type, limit },
    });
    return response.data.data;
  }
}

export const leaderboardService = new LeaderboardService();
