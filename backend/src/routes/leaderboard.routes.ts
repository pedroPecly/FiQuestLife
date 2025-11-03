/**
 * ============================================
 * LEADERBOARD ROUTES
 * ============================================
 * 
 * Rotas de rankings e classificações
 * 
 * @created 2 de novembro de 2025
 */

import { Hono } from 'hono';
import { leaderboardController } from '../controllers/leaderboard.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const leaderboardRoutes = new Hono();

// Todas as rotas requerem autenticação
leaderboardRoutes.use('*', authMiddleware);

/**
 * GET /leaderboard/friends?type=xp&limit=50
 * Ranking entre amigos do usuário
 */
leaderboardRoutes.get('/friends', leaderboardController.getFriendsLeaderboard);

/**
 * GET /leaderboard/global?type=xp&limit=100
 * Ranking global (top usuários)
 */
leaderboardRoutes.get('/global', leaderboardController.getGlobalLeaderboard);

export default leaderboardRoutes;
