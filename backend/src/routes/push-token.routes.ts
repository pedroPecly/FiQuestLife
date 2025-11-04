/**
 * ============================================
 * PUSH TOKEN ROUTES
 * ============================================
 */

import { Hono } from 'hono';
import * as pushTokenController from '../controllers/push-token.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const pushTokenRouter = new Hono();

// Todas as rotas requerem autenticação
pushTokenRouter.use('*', authMiddleware);

// POST /api/push-token - Salvar token
pushTokenRouter.post('/', pushTokenController.savePushToken);

// DELETE /api/push-token - Remover token
pushTokenRouter.delete('/', pushTokenController.removePushToken);

export default pushTokenRouter;
