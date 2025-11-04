/**
 * ============================================
 * NOTIFICATION API SERVICE (Frontend)
 * ============================================
 * 
 * Serviço para gerenciar notificações do backend
 */

import api from './api';

export interface BackendNotification {
  id: string;
  userId: string;
  type: 'FRIEND_REQUEST' | 'FRIEND_ACCEPTED' | 'ACTIVITY_LIKE' | 'ACTIVITY_COMMENT' | 'BADGE_EARNED' | 'LEVEL_UP' | 'CHALLENGE_COMPLETED' | 'STREAK_MILESTONE';
  title: string;
  message: string;
  data: any;
  read: boolean;
  createdAt: string;
}

/**
 * Buscar notificações do usuário
 */
export const getNotifications = async (onlyUnread = false, limit = 50): Promise<BackendNotification[]> => {
  try {
    const response = await api.get('/notifications', {
      params: { onlyUnread: onlyUnread.toString(), limit: limit.toString() },
    });
    return response.data.notifications;
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    throw error;
  }
};

/**
 * Buscar contagem de não lidas
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  } catch (error) {
    console.error('Erro ao buscar contagem:', error);
    throw error;
  }
};

/**
 * Marcar como lida
 */
export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    await api.put(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Erro ao marcar como lida:', error);
    throw error;
  }
};

/**
 * Marcar todas como lidas
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    await api.put('/notifications/read-all');
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error);
    throw error;
  }
};

/**
 * Deletar notificação
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await api.delete(`/notifications/${notificationId}`);
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    throw error;
  }
};
