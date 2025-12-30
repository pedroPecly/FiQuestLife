/**
 * ============================================
 * ACTIVITY CONTROLLER
 * ============================================
 * 
 * Controller para endpoints de rastreamento de atividades.
 * 
 * @created 30/12/2025
 */

import type { Context } from 'hono';
import * as activityService from '../services/activity.service.js';

/**
 * POST /api/activity/track
 * Registra uma atividade física completa
 */
export const trackActivity = async (c: Context) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();

    const {
      challengeId,
      activityType,
      steps,
      distance,
      duration,
      startTime,
      endTime,
      routeData,
    } = body;

    // Validações
    if (!activityType || !duration || !startTime || !endTime) {
      return c.json(
        { 
          success: false, 
          error: 'Campos obrigatórios: activityType, duration, startTime, endTime' 
        },
        400
      );
    }

    // Registrar atividade
    const activity = await activityService.trackActivity({
      userId: user.userId,
      challengeId,
      activityType,
      steps,
      distance,
      duration,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      routeData,
    });

    // Verificar e completar desafios relacionados
    const completedChallenges = await activityService.checkAndCompleteActivityChallenges(
      user.userId,
      steps,
      distance,
      duration
    );

    return c.json({
      success: true,
      data: {
        activity,
        completedChallenges,
      },
    });
  } catch (error: any) {
    console.error('[ACTIVITY] Erro ao registrar atividade:', error);
    return c.json(
      { success: false, error: error.message || 'Erro ao registrar atividade' },
      500
    );
  }
};

/**
 * PUT /api/activity/challenges/:challengeId/progress
 * Atualiza progresso de um desafio específico
 */
export const updateChallengeProgress = async (c: Context) => {
  try {
    const { challengeId } = c.req.param();
    const body = await c.req.json();

    const { steps, distance, duration } = body;

    const result = await activityService.updateChallengeProgress(
      challengeId,
      steps,
      distance,
      duration
    );

    return c.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[ACTIVITY] Erro ao atualizar progresso:', error);
    return c.json(
      { success: false, error: error.message || 'Erro ao atualizar progresso' },
      500
    );
  }
};

/**
 * GET /api/activity/daily
 * Obtém atividades do dia do usuário
 */
export const getDailyActivity = async (c: Context) => {
  try {
    const user = c.get('user');
    const dateParam = c.req.query('date');
    
    const date = dateParam ? new Date(dateParam) : new Date();
    
    const activities = await activityService.getDailyActivity(user.userId, date);

    return c.json({
      success: true,
      data: activities,
    });
  } catch (error: any) {
    console.error('[ACTIVITY] Erro ao buscar atividades do dia:', error);
    return c.json(
      { success: false, error: error.message || 'Erro ao buscar atividades' },
      500
    );
  }
};

/**
 * GET /api/activity/stats
 * Obtém estatísticas do dia do usuário
 */
export const getDailyStats = async (c: Context) => {
  try {
    const user = c.get('user');
    const dateParam = c.req.query('date');
    
    const date = dateParam ? new Date(dateParam) : new Date();
    
    const stats = await activityService.getDailyStats(user.userId, date);

    return c.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('[ACTIVITY] Erro ao buscar estatísticas:', error);
    return c.json(
      { success: false, error: error.message || 'Erro ao buscar estatísticas' },
      500
    );
  }
};

/**
 * GET /api/activity/history
 * Obtém histórico de atividades do usuário
 */
export const getActivityHistory = async (c: Context) => {
  try {
    const user = c.get('user');
    const limit = parseInt(c.req.query('limit') || '30');
    const offset = parseInt(c.req.query('offset') || '0');

    const activities = await activityService.getActivityHistory(
      user.userId,
      limit,
      offset
    );

    return c.json({
      success: true,
      data: activities,
    });
  } catch (error: any) {
    console.error('[ACTIVITY] Erro ao buscar histórico:', error);
    return c.json(
      { success: false, error: error.message || 'Erro ao buscar histórico' },
      500
    );
  }
};
