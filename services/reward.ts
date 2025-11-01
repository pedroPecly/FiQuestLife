/**
 * ============================================
 * SERVIÇO DE RECOMPENSAS - COMUNICAÇÃO COM API
 * ============================================
 * 
 * Gerencia todas as operações relacionadas a histórico de recompensas:
 * - Buscar histórico completo
 * - Buscar estatísticas resumidas
 * - Buscar recompensas recentes
 * - Formatar datas e valores
 * 
 * @created 01 de novembro de 2025
 */

import api from './api';

// ==========================================
// INTERFACES E TYPES
// ==========================================

/**
 * Tipos de recompensas disponíveis
 */
export type RewardType = 'XP' | 'COINS' | 'BADGE' | 'ITEM';

/**
 * Interface de uma recompensa individual
 */
export interface RewardItem {
  id: string;
  userId: string;
  type: RewardType;
  amount: number;
  source: string;
  sourceId: string | null;
  description: string | null;
  createdAt: string;
}

/**
 * Interface para filtros de histórico
 */
export interface RewardHistoryFilters {
  type?: RewardType;
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Interface de resposta do histórico
 */
export interface RewardHistoryResponse {
  success: boolean;
  data: RewardItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Interface de estatísticas
 */
export interface RewardStats {
  totalXP: number;
  totalCoins: number;
  totalBadges: number;
  totalRewards: number;
}

// ==========================================
// CONSTANTES
// ==========================================

/**
 * Ícones por tipo de recompensa
 */
export const REWARD_TYPE_ICONS: Record<RewardType, string> = {
  XP: '⭐',
  COINS: '💰',
  BADGE: '🏆',
  ITEM: '🎁',
};

/**
 * Labels por tipo de recompensa
 */
export const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  XP: 'Experiência',
  COINS: 'Moedas',
  BADGE: 'Conquista',
  ITEM: 'Item',
};

/**
 * Cores por tipo de recompensa
 */
export const REWARD_TYPE_COLORS: Record<RewardType, string> = {
  XP: '#20B2AA',      // Verde azulado (experiência)
  COINS: '#FFD700',   // Dourado (moedas)
  BADGE: '#FF6B6B',   // Vermelho (conquistas)
  ITEM: '#9B59B6',    // Roxo (itens)
};

// ==========================================
// FUNÇÕES DE API
// ==========================================

/**
 * Busca histórico de recompensas com filtros opcionais
 */
export const getRewardHistory = async (
  filters: RewardHistoryFilters = {}
): Promise<RewardHistoryResponse> => {
  const params = new URLSearchParams();
  
  if (filters.type) params.append('type', filters.type);
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.offset) params.append('offset', filters.offset.toString());
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);

  const queryString = params.toString();
  const url = `/rewards/history${queryString ? `?${queryString}` : ''}`;

  const response = await api.get(url);
  return response.data;
};

/**
 * Busca estatísticas resumidas de recompensas
 */
export const getRewardStats = async (): Promise<RewardStats> => {
  const response = await api.get('/rewards/stats');
  return response.data.data;
};

/**
 * Busca recompensas recentes (últimas 10)
 */
export const getRecentRewards = async (): Promise<RewardItem[]> => {
  const response = await api.get('/rewards/recent');
  return response.data.data;
};

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Formata data de recompensa
 */
export const formatRewardDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Menos de 1 hora: "há X minutos"
  if (diffMins < 60) {
    return diffMins === 0 ? 'agora mesmo' : `há ${diffMins}min`;
  }

  // Menos de 24 horas: "há X horas"
  if (diffHours < 24) {
    return `há ${diffHours}h`;
  }

  // Menos de 7 dias: "há X dias"
  if (diffDays < 7) {
    return `há ${diffDays}d`;
  }

  // Mais de 7 dias: data formatada
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Formata quantidade de recompensa com sinal +
 */
export const formatRewardAmount = (type: RewardType, amount: number): string => {
  switch (type) {
    case 'XP':
      return `+${amount} XP`;
    case 'COINS':
      return `+${amount} ${amount === 1 ? 'moeda' : 'moedas'}`;
    case 'BADGE':
      return 'Nova conquista!';
    case 'ITEM':
      return `+${amount} ${amount === 1 ? 'item' : 'itens'}`;
    default:
      return `+${amount}`;
  }
};

/**
 * Obtém descrição amigável da origem da recompensa
 */
export const getRewardSourceLabel = (source: string): string => {
  const sourceMap: Record<string, string> = {
    // Desafios
    CHALLENGE_COMPLETED: 'Desafio completado',
    CHALLENGE_COMPLETION: 'Desafio completado',
    CHALLENGE_REWARD: 'Recompensa de desafio',
    
    // Níveis e progresso
    LEVEL_UP: 'Subiu de nível',
    LEVEL_MILESTONE: 'Marco de nível',
    
    // Streaks e consistência
    STREAK_MILESTONE: 'Marco de sequência',
    DAILY_STREAK: 'Sequência diária',
    
    // Conquistas
    BADGE_ACHIEVEMENT: 'Conquista desbloqueada',
    ACHIEVEMENT_UNLOCKED: 'Conquista desbloqueada',
    
    // Bônus
    DAILY_BONUS: 'Bônus diário',
    WEEKLY_BONUS: 'Bônus semanal',
    LOGIN_BONUS: 'Bônus de login',
    
    // Outros
    MANUAL_REWARD: 'Recompensa manual',
    SYSTEM_REWARD: 'Recompensa do sistema',
  };

  return sourceMap[source] || source.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};