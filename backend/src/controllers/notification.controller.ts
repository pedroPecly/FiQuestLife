/**
 * ============================================
 * NOTIFICATION CONTROLLER
 * ============================================
 * 
 * Endpoints para gerenciar notificações
 */

import { Context } from 'hono';
import * as notificationService from '../services/notification.service.js';

/**
 * GET /api/notifications
 * Buscar notificações do usuário
 */
export async function getNotifications(c: Context) {
  try {
    const userId = c.get('userId');
    const onlyUnread = c.req.query('onlyUnread') === 'true';
    const limit = parseInt(c.req.query('limit') || '50', 10);

    console.log('[NOTIFICATION CONTROLLER] Buscando notificações - userId:', userId, 'onlyUnread:', onlyUnread, 'limit:', limit);
    const notifications = await notificationService.getUserNotifications(userId, limit, onlyUnread);
    console.log('[NOTIFICATION CONTROLLER] Notificações encontradas:', notifications.length);

    return c.json({ notifications });
  } catch (error) {
    console.error('[NOTIFICATION CONTROLLER] Erro ao buscar notificações:', error);
    return c.json({ error: 'Erro ao buscar notificações' }, 500);
  }
}

/**
 * GET /api/notifications/unread-count
 * Contar notificações não lidas
 */
export async function getUnreadCount(c: Context) {
  try {
    const userId = c.get('userId');
    
    console.log('[NOTIFICATION CONTROLLER] Buscando count para userId:', userId);
    const count = await notificationService.getUnreadCount(userId);
    console.log('[NOTIFICATION CONTROLLER] Count encontrado:', count);

    return c.json({ count });
  } catch (error) {
    console.error('[NOTIFICATION CONTROLLER] Erro ao contar não lidas:', error);
    return c.json({ error: 'Erro ao contar notificações' }, 500);
  }
}

/**
 * PUT /api/notifications/:id/read
 * Marcar notificação como lida
 */
export async function markAsRead(c: Context) {
  try {
    const userId = c.get('userId');
    const notificationId = c.req.param('id');

    await notificationService.markAsRead(notificationId, userId);

    return c.json({ success: true });
  } catch (error) {
    console.error('[NOTIFICATION CONTROLLER] Erro ao marcar como lida:', error);
    return c.json({ error: 'Erro ao marcar como lida' }, 500);
  }
}

/**
 * PUT /api/notifications/read-all
 * Marcar todas como lidas
 */
export async function markAllAsRead(c: Context) {
  try {
    const userId = c.get('userId');

    const result = await notificationService.markAllAsRead(userId);

    return c.json({ success: true, count: result.count });
  } catch (error) {
    console.error('[NOTIFICATION CONTROLLER] Erro ao marcar todas como lidas:', error);
    return c.json({ error: 'Erro ao marcar todas como lidas' }, 500);
  }
}

/**
 * DELETE /api/notifications/:id
 * Deletar notificação
 */
export async function deleteNotification(c: Context) {
  try {
    const userId = c.get('userId');
    const notificationId = c.req.param('id');

    await notificationService.deleteNotification(notificationId, userId);

    return c.json({ success: true });
  } catch (error) {
    console.error('[NOTIFICATION CONTROLLER] Erro ao deletar notificação:', error);
    return c.json({ error: 'Erro ao deletar notificação' }, 500);
  }
}
