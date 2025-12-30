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

export default activity;
