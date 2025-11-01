/**
 * ============================================
 * REWARD ROUTES - Rotas de Recompensas
 * ============================================
 * 
 * Rotas protegidas para histórico de recompensas
 * 
 * @created 01 de novembro de 2025
 */

import { Hono } from 'hono';
import { getHistory, getRecent, getStats } from '../controllers/reward.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const rewardRoutes = new Hono();

// Todas as rotas requerem autenticação
rewardRoutes.use('*', authMiddleware);

/**
 * GET /rewards/history
 * Histórico completo com filtros e paginação
 */
rewardRoutes.get('/history', getHistory);

/**
 * GET /rewards/stats
 * Estatísticas resumidas (total XP, coins, badges)
 */
rewardRoutes.get('/stats', getStats);

/**
 * GET /rewards/recent
 * Últimas 10 recompensas
 */
rewardRoutes.get('/recent', getRecent);

export default rewardRoutes;
