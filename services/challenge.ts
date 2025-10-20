import api from './api';

// ==========================================
// INTERFACES
// ==========================================

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  xpReward: number;
  coinsReward: number;
  frequency: ChallengeFrequency;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: ChallengeStatus;
  assignedAt: string;
  completedAt: string | null;
  progress: number;
  challenge: Challenge;
}

export type ChallengeCategory =
  | 'PHYSICAL_ACTIVITY'
  | 'NUTRITION'
  | 'HYDRATION'
  | 'MENTAL_HEALTH'
  | 'SLEEP'
  | 'SOCIAL'
  | 'PRODUCTIVITY'
  | 'MINDFULNESS';

export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export type ChallengeFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type ChallengeStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface CompleteChallengeResponse {
  userChallenge: UserChallenge;
  stats: {
    xp: number;
    coins: number;
    level: number;
    currentStreak: number;
  };
  leveledUp: boolean;
  newLevel?: number;
  newBadges?: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    rarity: string;
  }>;
}

export interface ChallengeHistoryItem {
  id: string;
  status: ChallengeStatus;
  assignedAt: string;
  completedAt: string | null;
  challenge: Challenge;
}

// ==========================================
// MAPEAMENTOS DE CATEGORIAS
// ==========================================

export const CATEGORY_COLORS: Record<ChallengeCategory, string> = {
  PHYSICAL_ACTIVITY: '#3B82F6', // Azul
  NUTRITION: '#10B981', // Verde
  HYDRATION: '#06B6D4', // Ciano
  MENTAL_HEALTH: '#8B5CF6', // Roxo
  SLEEP: '#6366F1', // Índigo
  SOCIAL: '#EC4899', // Rosa
  PRODUCTIVITY: '#F59E0B', // Laranja
  MINDFULNESS: '#14B8A6', // Teal
};

export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  PHYSICAL_ACTIVITY: 'Atividade Física',
  NUTRITION: 'Nutrição',
  HYDRATION: 'Hidratação',
  MENTAL_HEALTH: 'Saúde Mental',
  SLEEP: 'Sono',
  SOCIAL: 'Social',
  PRODUCTIVITY: 'Produtividade',
  MINDFULNESS: 'Mindfulness',
};

export const CATEGORY_ICONS: Record<ChallengeCategory, string> = {
  PHYSICAL_ACTIVITY: '💪',
  NUTRITION: '🥗',
  HYDRATION: '💧',
  MENTAL_HEALTH: '🧠',
  SLEEP: '😴',
  SOCIAL: '👥',
  PRODUCTIVITY: '🎯',
  MINDFULNESS: '🧘',
};

// ==========================================
// MAPEAMENTOS DE DIFICULDADE
// ==========================================

export const DIFFICULTY_COLORS: Record<ChallengeDifficulty, string> = {
  EASY: '#10B981', // Verde
  MEDIUM: '#F59E0B', // Laranja
  HARD: '#EF4444', // Vermelho
  EXPERT: '#7C3AED', // Roxo escuro
};

export const DIFFICULTY_LABELS: Record<ChallengeDifficulty, string> = {
  EASY: 'Fácil',
  MEDIUM: 'Médio',
  HARD: 'Difícil',
  EXPERT: 'Expert',
};

// ==========================================
// SERVIÇO DE DESAFIOS
// ==========================================

class ChallengeService {
  /**
   * Busca os desafios diários do usuário
   */
  async getDailyChallenges(): Promise<UserChallenge[]> {
    try {
      const response = await api.get('/challenges/daily');
      console.log('✅ getDailyChallenges - Resposta:', response.data);
      return response.data.data; // Backend retorna { success, data, message }
    } catch (error) {
      console.error('Erro ao buscar desafios diários:', error);
      throw error;
    }
  }

  /**
   * Completa um desafio
   */
  async completeChallenge(userChallengeId: string): Promise<CompleteChallengeResponse> {
    try {
      const response = await api.post(`/challenges/${userChallengeId}/complete`);
      return response.data.data; // Backend retorna { success, data, message }
    } catch (error) {
      console.error('Erro ao completar desafio:', error);
      throw error;
    }
  }

  /**
   * Busca o histórico de desafios
   */
  async getChallengeHistory(): Promise<ChallengeHistoryItem[]> {
    try {
      const response = await api.get('/challenges/history');
      return response.data.data; // Backend retorna { success, data, message }
    } catch (error) {
      console.error('Erro ao buscar histórico de desafios:', error);
      throw error;
    }
  }

  /**
   * Busca todos os desafios disponíveis
   */
  async getAllChallenges(): Promise<Challenge[]> {
    try {
      const response = await api.get('/challenges/all');
      return response.data.data; // Backend retorna { success, data, message }
    } catch (error) {
      console.error('Erro ao buscar todos os desafios:', error);
      throw error;
    }
  }
}

export default new ChallengeService();
