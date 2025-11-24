/**
 * ============================================
 * FEED INTERACTIONS SERVICE
 * ============================================
 * 
 * Gerencia curtidas e comentários em atividades do feed
 */

import { Platform } from 'react-native';
import api from './api';
import { authStorage } from './auth';
import { notifyActivityComment, notifyActivityLike } from './notifications';

export interface FeedComment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface FeedLike {
  id: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
}

export const feedInteractionsService = {
  /**
   * Curtir ou descurtir atividade
   */
  async toggleLike(activityId: string) {
    try {
      const response = await api.post(`/feed/${activityId}/like`);
      
      // Se curtida foi adicionada e há dados para notificação, enviar local no Android
      if (response.data.liked && response.data.notificationData && Platform.OS === 'android') {
        const { activityOwnerId, likerName, activityDescription } = response.data.notificationData;
        // Só notificar se não é o próprio usuário
        const user = await authStorage.getUser();
        if (user && activityOwnerId !== user.id) {
          await notifyActivityLike(activityOwnerId, activityId, likerName, activityDescription);
        }
      }
      
      return { 
        success: true, 
        data: response.data,
        liked: response.data.liked,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao curtir atividade',
      };
    }
  },

  /**
   * Buscar curtidas de uma atividade
   */
  async getLikes(activityId: string) {
    try {
      const response = await api.get(`/feed/${activityId}/likes`);
      return { 
        success: true, 
        data: response.data.likes as FeedLike[],
        total: response.data.total,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar curtidas',
      };
    }
  },

  /**
   * Adicionar comentário
   */
  async addComment(activityId: string, content: string) {
    try {
      const response = await api.post(`/feed/${activityId}/comment`, { content });
      
      // Se comentário foi adicionado e há dados para notificação, enviar local no Android
      if (response.data.notificationData && Platform.OS === 'android') {
        const { activityOwnerId, commenterName, commentContent, activityDescription } = response.data.notificationData;
        // Só notificar se não é o próprio usuário
        const user = await authStorage.getUser();
        if (user && activityOwnerId !== user.id) {
          await notifyActivityComment(activityOwnerId, activityId, commenterName, commentContent, activityDescription);
        }
      }
      
      return { 
        success: true, 
        data: response.data.comment as FeedComment,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao adicionar comentário',
      };
    }
  },

  /**
   * Buscar comentários de uma atividade
   */
  async getComments(activityId: string, limit: number = 50) {
    try {
      const response = await api.get(`/feed/${activityId}/comments`, {
        params: { limit },
      });
      return { 
        success: true, 
        data: response.data.comments as FeedComment[],
        total: response.data.total,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar comentários',
      };
    }
  },

  /**
   * Deletar comentário
   */
  async deleteComment(commentId: string) {
    try {
      const response = await api.delete(`/feed/comments/${commentId}`);
      return { 
        success: true, 
        data: response.data,
      };
    } catch (error: any) {
      return{
        success: false,
        error: error.response?.data?.error || 'Erro ao deletar comentário',
      };
    }
  },

  /**
   * Buscar stats de múltiplas atividades (likes count, comments count)
   */
  async getActivityStats(activityIds: string[]) {
    try {
      const response = await api.post('/feed/stats', { activityIds });
      return { 
        success: true, 
        data: response.data.stats as Record<string, {
          likesCount: number;
          commentsCount: number;
          isLikedByUser: boolean;
        }>,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar stats',
      };
    }
  },
};
