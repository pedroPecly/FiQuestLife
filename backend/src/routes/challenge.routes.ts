/**
 * ============================================
 * CHALLENGE ROUTES - Rotas de Desafios
 * ============================================
 * 
 * Rotas protegidas da API de desafios
 * Requer autenticação via authMiddleware
 * 
 * @created 20 de outubro de 2025
 */

import { Hono } from 'hono';
import {
    completeChallengeById,
    getAllChallengesController,
    getDailyChallenges,
    getHistory,
} from '../controllers/challenge.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const challengeRoutes = new Hono();

// Todas as rotas requerem autenticação
challengeRoutes.use('*', authMiddleware);

/**
 * GET /challenges/daily
 * Busca ou atribui desafios diários
 */
challengeRoutes.get('/daily', getDailyChallenges);

/**
 * POST /challenges/:id/complete
 * Completa um desafio específico
 */
challengeRoutes.post('/:id/complete', completeChallengeById);

/**
 * GET /challenges/history
 * Histórico de desafios completados
 */
challengeRoutes.get('/history', getHistory);

/**
 * GET /challenges/all
 * Todos os desafios disponíveis (admin/debug)
 */
challengeRoutes.get('/all', getAllChallengesController);

export default challengeRoutes;
