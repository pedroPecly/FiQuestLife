/**
 * ============================================
 * SERVIÇO DE BADGES - COMUNICAÇÃO COM API
 * ============================================
 * 
 * Gerencia todas as operações relacionadas a badges/conquistas:
 * - Buscar todos os badges disponíveis
 * - Buscar badges conquistados pelo usuário
 * - Buscar progresso de todos os badges
 * 
 * @created 27 de outubro de 2025
 */

import api from './api';

// ==========================================
// INTERFACES E TYPES
// ==========================================

/**
 * Tipos de requisitos para desbloquear badges
 */
export type BadgeRequirementType =
  | 'CHALLENGES_COMPLETED'  // Total de desafios completados
  | 'STREAK_DAYS'          // Dias consecutivos de streak
  | 'LEVEL_REACHED'        // Nível alcançado
  | 'XP_EARNED'            // XP total acumulado
  | 'CATEGORY_MASTER';     // Mestre em categoria específica

/**
 * Raridades dos badges
 */
export type BadgeRarity =
  | 'COMMON'     // Comum (cinza)
  | 'RARE'       // Raro (azul)
  | 'EPIC'       // Épico (roxo)
  | 'LEGENDARY'; // Lendário (dourado)

/**
 * Categorias dos badges
 */
export type BadgeCategory =
  | 'ACHIEVEMENT'   // Conquistas gerais
  | 'CONSISTENCY'   // Consistência/streak
  | 'MASTERY'       // Maestria em categorias
  | 'SPECIAL';      // Especiais/eventos

/**
 * Interface do Badge
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  category: BadgeCategory;
  rarity: BadgeRarity;
  requirementType: BadgeRequirementType;
  requirementValue: number;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Badge conquistado pelo usuário
 */
export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  badge: Badge;
}

/**
 * Progresso de um badge
 */
export interface BadgeProgress {
  current: number;
  required: number;
  percentage: number;
}

/**
 * Badge com informações de progresso
 */
export interface BadgeWithProgress extends Badge {
  earned: boolean;
  earnedAt?: string;
  progress?: BadgeProgress;
}

/**
 * Resposta da API de progresso de badges
 */
export interface BadgesProgressResponse {
  badges: BadgeWithProgress[];
  earned: number;
  locked: number;
  total: number;
}

// ==========================================
// MAPEAMENTOS DE CORES E LABELS
// ==========================================

/**
 * Cores por raridade dos badges
 */
export const RARITY_COLORS: Record<BadgeRarity, string> = {
  COMMON: '#9CA3AF',     // Cinza
  RARE: '#3B82F6',       // Azul
  EPIC: '#8B5CF6',       // Roxo
  LEGENDARY: '#F59E0B',  // Dourado
};

/**
 * Labels em português por raridade
 */
export const RARITY_LABELS: Record<BadgeRarity, string> = {
  COMMON: 'Comum',
  RARE: 'Raro',
  EPIC: 'Épico',
  LEGENDARY: 'Lendário',
};

/**
 * Emojis por categoria de badge
 */
export const CATEGORY_ICONS: Record<BadgeCategory, string> = {
  ACHIEVEMENT: '🏆',
  CONSISTENCY: '🔥',
  MASTERY: '⭐',
  SPECIAL: '💎',
};

/**
 * Labels em português por categoria
 */
export const CATEGORY_LABELS: Record<BadgeCategory, string> = {
  ACHIEVEMENT: 'Conquista',
  CONSISTENCY: 'Consistência',
  MASTERY: 'Maestria',
  SPECIAL: 'Especial',
};

/**
 * Labels em português por tipo de requisito
 */
export const REQUIREMENT_TYPE_LABELS: Record<BadgeRequirementType, string> = {
  CHALLENGES_COMPLETED: 'Desafios Completados',
  STREAK_DAYS: 'Dias de Streak',
  LEVEL_REACHED: 'Nível Alcançado',
  XP_EARNED: 'XP Acumulado',
  CATEGORY_MASTER: 'Mestre em Categoria',
};

// ==========================================
// FUNÇÕES DE API
// ==========================================

/**
 * Busca todos os badges disponíveis no sistema
 * @returns Promise com array de badges
 */
export const getAllBadges = async (): Promise<Badge[]> => {
  try {
    const response = await api.get('/badges/all');
    return response.data.badges || [];
  } catch (error: any) {
    console.error('❌ Erro ao buscar todos os badges:', error);
    throw new Error(error.response?.data?.error || 'Erro ao buscar badges');
  }
};

/**
 * Busca badges conquistados pelo usuário atual
 * @returns Promise com array de badges conquistados
 */
export const getUserBadges = async (): Promise<UserBadge[]> => {
  try {
    const response = await api.get('/badges/user');
    return response.data.badges || [];
  } catch (error: any) {
    console.error('❌ Erro ao buscar badges do usuário:', error);
    throw new Error(error.response?.data?.error || 'Erro ao buscar seus badges');
  }
};

/**
 * Busca progresso de todos os badges (conquistados e bloqueados)
 * @returns Promise com badges e progresso
 */
export const getBadgesProgress = async (): Promise<BadgesProgressResponse> => {
  try {
    const response = await api.get('/badges/progress');
    return {
      badges: response.data.badges || [],
      earned: response.data.earned || 0,
      locked: response.data.locked || 0,
      total: response.data.total || 0,
    };
  } catch (error: any) {
    console.error('❌ Erro ao buscar progresso de badges:', error);
    throw new Error(error.response?.data?.error || 'Erro ao buscar progresso');
  }
};

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Formata o progresso de um badge para exibição
 * @param badge Badge com progresso
 * @returns String formatada "current/required (percentage%)"
 */
export const formatBadgeProgress = (badge: BadgeWithProgress): string => {
  if (!badge.progress) return '';
  const { current, required, percentage } = badge.progress;
  return `${current}/${required} (${percentage}%)`;
};

/**
 * Verifica se um badge está próximo de ser conquistado (>= 80%)
 * @param badge Badge com progresso
 * @returns true se >= 80%
 */
export const isBadgeAlmostEarned = (badge: BadgeWithProgress): boolean => {
  if (badge.earned || !badge.progress) return false;
  return badge.progress.percentage >= 80;
};

/**
 * Retorna emoji baseado na raridade do badge
 * @param rarity Raridade do badge
 * @returns Emoji representativo
 */
export const getRarityEmoji = (rarity: BadgeRarity): string => {
  const emojiMap: Record<BadgeRarity, string> = {
    COMMON: '🥉',
    RARE: '🥈',
    EPIC: '🥇',
    LEGENDARY: '👑',
  };
  return emojiMap[rarity] || '🏅';
};
