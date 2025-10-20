/**
 * ============================================
 * BADGE ROUTES - Rotas de Badges
 * ============================================
 * 
 * Rotas protegidas da API de badges
 * Requer autenticação via authMiddleware
 * 
 * @created 20 de outubro de 2025
 */

import { Hono } from 'hono';
import {
    getAllBadgesController,
    getBadgesProgressController,
    getUserBadgesController,
} from '../controllers/badge.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const badgeRoutes = new Hono();

// Todas as rotas requerem autenticação
badgeRoutes.use('*', authMiddleware);

/**
 * GET /badges/all
 * Lista todos os badges disponíveis
 */
badgeRoutes.get('/all', getAllBadgesController);

/**
 * GET /badges/user
 * Badges conquistados pelo usuário
 */
badgeRoutes.get('/user', getUserBadgesController);

/**
 * GET /badges/progress
 * Progresso de todos os badges
 */
badgeRoutes.get('/progress', getBadgesProgressController);

export default badgeRoutes;
