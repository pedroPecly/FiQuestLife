/**
 * ============================================
 * ACTIVITY ROUTES
 * ============================================
 * 
 * Rotas para rastreamento de atividades físicas.
 * 
 * @created 30/12/2025
 */

import { Hono } from 'hono';
import * as activityController from '../controllers/activity.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { completeChallenge, updateChallengeProgress } from '../services/challenge.service.js';
import { getUserId } from '../utils/context.helpers.js';

const activity = new Hono();

// Todas as rotas requerem autenticação
activity.use('/*', authMiddleware);

/**
 * POST /api/activity/track
 * Registra uma atividade física completa
 */
activity.post('/track', activityController.trackActivity);

/**
 * PUT /api/activity/challenges/:challengeId/progress
 * Atualiza progresso de um desafio específico
 */
activity.put('/challenges/:challengeId/progress', activityController.updateChallengeProgress);

/**
 * GET /api/activity/daily
 * Obtém atividades do dia do usuário
 * Query params: date (opcional, formato ISO)
 */
activity.get('/daily', activityController.getDailyActivity);

/**
 * GET /api/activity/stats
 * Obtém estatísticas do dia do usuário
 * Query params: date (opcional, formato ISO)
 */
activity.get('/stats', activityController.getDailyStats);

/**
 * GET /api/activity/history
 * Obtém histórico de atividades do usuário
 * Query params: limit, offset
 */
activity.get('/history', activityController.getActivityHistory);

/**
 * POST /api/activity/batch-sync
 * Sincroniza progresso de múltiplos desafios de atividade em batch.
 * Recebe: { results: [{ userChallengeId, currentValue, completed }] }
 *
 * Para cada item:
 *  - completed=true  → completa o desafio (recompensas/badges/etc)
 *  - completed=false → apenas atualiza o progresso (percentual + campos brutos)
 */
activity.post('/batch-sync', async (c) => {
  try {
    const userId = getUserId(c);
    const body = await c.req.json();
    const results: Array<{
      userChallengeId: string;
      currentValue: number;
      completed: boolean;
    }> = body.results ?? [];

    if (results.length === 0) {
      return c.json({ success: true, message: 'Nenhum resultado para sincronizar' });
    }

    const outcomes = await Promise.allSettled(
      results.map(async ({ userChallengeId, currentValue, completed }) => {
        if (completed) {
          return completeChallenge(userId, userChallengeId);
        }
        return updateChallengeProgress(userId, userChallengeId, currentValue);
      })
    );

    const processed = outcomes.filter((o) => o.status === 'fulfilled').length;
    const failed = outcomes
      .filter((o) => o.status === 'rejected')
      .map((o) => (o as PromiseRejectedResult).reason?.message ?? 'unknown');

    if (failed.length > 0) {
      console.warn('[ACTIVITY] batch-sync parcialmente falhou:', failed);
    }

    return c.json({
      success: true,
      message: `${processed} desafios sincronizados${failed.length ? `, ${failed.length} ignorados` : ''}`,
      data: { processed, failed: failed.length },
    });
  } catch (error: any) {
    console.error('[ACTIVITY] Erro no batch sync:', error);
    return c.json(
      { success: false, message: 'Erro ao sincronizar desafios', error: error.message },
      500
    );
  }
});

export default activity;
