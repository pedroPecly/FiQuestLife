/**
 * ============================================
 * NOTIFICATION ROUTES
 * ============================================
 */

import { Hono } from 'hono';
import * as notificationController from '../controllers/notification.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const notificationRoutes = new Hono();

// Todas as rotas exigem autenticação
notificationRoutes.use('*', authMiddleware);

// GET /api/notifications - Buscar notificações
notificationRoutes.get('/', notificationController.getNotifications);

// GET /api/notifications/unread-count - Contar não lidas
notificationRoutes.get('/unread-count', notificationController.getUnreadCount);

// PUT /api/notifications/read-all - Marcar todas como lidas
notificationRoutes.put('/read-all', notificationController.markAllAsRead);

// PUT /api/notifications/:id/read - Marcar como lida
notificationRoutes.put('/:id/read', notificationController.markAsRead);

// DELETE /api/notifications/:id - Deletar
notificationRoutes.delete('/:id', notificationController.deleteNotification);
