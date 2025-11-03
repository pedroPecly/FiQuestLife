/**
 * ============================================
 * USER PROFILE ROUTES
 * ============================================
 * 
 * Rotas para perfis públicos de usuários
 * 
 * @created 2 de novembro de 2025
 */

import { Hono } from 'hono';
import { userProfileController } from '../controllers/user-profile.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const userProfileRoutes = new Hono();

// Todas as rotas requerem autenticação
userProfileRoutes.use('*', authMiddleware);

/**
 * GET /users/:userId/profile
 * Retorna perfil público do usuário
 */
userProfileRoutes.get('/:userId/profile', userProfileController.getUserProfile);

/**
 * GET /users/:userId/mutual-friends
 * Retorna amigos em comum
 */
userProfileRoutes.get('/:userId/mutual-friends', userProfileController.getMutualFriends);

export default userProfileRoutes;
