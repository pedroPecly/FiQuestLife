/**
 * ============================================
 * ACTIVITY API SERVICE
 * ============================================
 * 
 * Serviço para comunicação com API de atividades físicas.
 * 
 * @created 30/12/2025
 */

import api from './api';

export interface ActivityData {
  challengeId?: string;
  activityType: string;
  steps?: number;
  distance?: number;
  duration: number;
  startTime: Date | string;
  endTime: Date | string;
  routeData?: any;
}

export interface ActivityTracking {
  id: string;
  userId: string;
  challengeId?: string;
  activityType: string;
  steps?: number;
  distance?: number;
  duration: number;
  startTime: string;
  endTime: string;
  routeData?: any;
  createdAt: string;
}

export interface DailyStats {
  totalSteps: number;
  totalDistance: number;
  totalDuration: number;
  activitiesCount: number;
}

/**
 * Registra uma atividade física completa
 */
export const trackActivity = async (data: ActivityData) => {
  try {
    const response = await api.post('/activity/track', data);
    return response.data;
  } catch (error: any) {
    console.error('[ACTIVITY API] Erro ao registrar atividade:', error);
    throw error;
  }
};

/**
 * Atualiza progresso de um desafio específico
 */
export const updateChallengeProgress = async (
  challengeId: string,
  data: {
    steps?: number;
    distance?: number;
    duration?: number;
  }
) => {
  try {
    const response = await api.put(`/activity/challenges/${challengeId}/progress`, data);
    return response.data;
  } catch (error: any) {
    console.error('[ACTIVITY API] Erro ao atualizar progresso:', error);
    throw error;
  }
};

/**
 * Obtém atividades do dia
 */
export const getDailyActivity = async (date?: Date): Promise<ActivityTracking[]> => {
  try {
    const params = date ? { date: date.toISOString() } : {};
    const response = await api.get('/activity/daily', { params });
    return response.data.data;
  } catch (error: any) {
    console.error('[ACTIVITY API] Erro ao buscar atividades do dia:', error);
    throw error;
  }
};

/**
 * Obtém estatísticas do dia
 */
export const getDailyStats = async (date?: Date): Promise<DailyStats> => {
  try {
    const params = date ? { date: date.toISOString() } : {};
    const response = await api.get('/activity/stats', { params });
    return response.data.data;
  } catch (error: any) {
    console.error('[ACTIVITY API] Erro ao buscar estatísticas:', error);
    throw error;
  }
};

/**
 * Obtém histórico de atividades
 */
export const getActivityHistory = async (
  limit: number = 30,
  offset: number = 0
): Promise<ActivityTracking[]> => {
  try {
    const response = await api.get('/activity/history', {
      params: { limit, offset },
    });
    return response.data.data;
  } catch (error: any) {
    console.error('[ACTIVITY API] Erro ao buscar histórico:', error);
    throw error;
  }
};

export default {
  trackActivity,
  updateChallengeProgress,
  getDailyActivity,
  getDailyStats,
  getActivityHistory,
};
