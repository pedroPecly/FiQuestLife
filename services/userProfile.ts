/**
 * ============================================
 * USER PROFILE SERVICE
 * ============================================
 * 
 * Serviço para gerenciar perfis públicos de usuários
 * 
 * @created 2 de novembro de 2025
 */

import api from './api';

// ============================================
// INTERFACES
// ============================================

export interface UserProfile {
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    level: number;
    xp: number;
    coins: number;
    currentStreak: number;
    longestStreak: number;
    memberSince: string;
  };
  stats: {
    totalChallenges: number;
    completedChallenges: number;
    completionRate: number;
    friendsCount: number;
    badgesCount: number;
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    rarity: string;
    category: string;
    earnedAt: string;
  }>;
  recentChallenges: Array<{
    id: string;
    title: string;
    category: string;
    difficulty: string;
    xpReward: number;
    completedAt: string;
  }>;
  relationship: {
    isFriend: boolean;
    hasPendingRequest: boolean;
    requestDirection: 'SENT' | 'RECEIVED' | null;
  };
}

export interface MutualFriend {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
}

// ============================================
// SERVIÇO
// ============================================

class UserProfileService {
  /**
   * Busca perfil público de um usuário
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data.data;
  }

  /**
   * Busca amigos em comum com um usuário
   */
  async getMutualFriends(userId: string): Promise<MutualFriend[]> {
    const response = await api.get(`/users/${userId}/mutual-friends`);
    return response.data.data;
  }
}

export const userProfileService = new UserProfileService();
