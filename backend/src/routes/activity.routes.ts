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
import { prisma } from '../lib/prisma.js';
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
 * Sincroniza progresso de múltiplos desafios em batch
 * Usado pelo sistema de sincronização automática
 */
activity.post('/batch-sync', async (c) => {
  try {
    const userId = getUserId(c);
    const { results } = await c.req.json();

    if (!Array.isArray(results) || results.length === 0) {
      return c.json({
        success: true,
        message: 'Nenhum resultado para sincronizar',
      });
    }

    // Atualizar todos os progressos em batch usando transaction
    const updates = results.map((result: any) =>
      prisma.userChallenge.updateMany({
        where: {
          userId,
          challengeId: result.challengeId,
        },
        data: {
          progress: result.currentValue,
        },
      })
    );

    await prisma.$transaction(updates);

    return c.json({
      success: true,
      message: `${results.length} desafios sincronizados`,
    });
  } catch (error: any) {
    console.error('[ACTIVITY] Erro no batch sync:', error);
    return c.json(
      {
        success: false,
        message: 'Erro ao sincronizar desafios',
        error: error.message,
      },
      500
    );
  }
});

export default activity;
