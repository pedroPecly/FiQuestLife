/**
 * ============================================
 * CONTROLLER DE AMIGOS
 * ============================================
 *
 * Gerencia solicitações de amizade, lista de amigos,
 * busca de usuários e atividades dos amigos
 */

import type { Context } from 'hono';
import * as friendService from '../services/friend.service';

export const friendController = {
  /**
   * Envia solicitação de amizade
   * POST /friends/request
   */
  async sendRequest(c: Context) {
    try {
      const userId = c.get('userId');
      const { targetUserId } = await c.req.json();

      if (!targetUserId) {
        return c.json({ success: false, message: 'targetUserId é obrigatório' }, 400);
      }

      const request = await friendService.sendFriendRequest(userId, targetUserId);

      return c.json({
        success: true,
        message: 'Solicitação de amizade enviada com sucesso',
        data: request,
      });
    } catch (error: any) {
      console.error('Erro ao enviar solicitação de amizade:', error);
      return c.json({ success: false, message: error.message || 'Erro ao enviar solicitação' }, 400);
    }
  },

  /**
   * Aceita solicitação de amizade
   * POST /friends/accept/:id
   */
  async acceptRequest(c: Context) {
    try {
      const userId = c.get('userId');
      const requestId = c.req.param('id');

      const result = await friendService.acceptFriendRequest(userId, requestId);

      return c.json({
        success: true,
        message: 'Solicitação aceita com sucesso',
        data: result,
      });
    } catch (error: any) {
      console.error('Erro ao aceitar solicitação:', error);
      return c.json({ success: false, message: error.message || 'Erro ao aceitar solicitação' }, 400);
    }
  },

  /**
   * Rejeita solicitação de amizade
   * POST /friends/reject/:id
   */
  async rejectRequest(c: Context) {
    try {
      const userId = c.get('userId');
      const requestId = c.req.param('id');

      const result = await friendService.rejectFriendRequest(userId, requestId);

      return c.json({
        success: true,
        message: 'Solicitação rejeitada com sucesso',
        data: result,
      });
    } catch (error: any) {
      console.error('Erro ao rejeitar solicitação:', error);
      return c.json({ success: false, message: error.message || 'Erro ao rejeitar solicitação' }, 400);
    }
  },

  /**
   * Cancela solicitação de amizade enviada
   * POST /friends/cancel/:id
   */
  async cancelRequest(c: Context) {
    try {
      const userId = c.get('userId');
      const requestId = c.req.param('id');

      const result = await friendService.cancelFriendRequest(userId, requestId);

      return c.json({
        success: true,
        message: 'Solicitação cancelada com sucesso',
        data: result,
      });
    } catch (error: any) {
      console.error('Erro ao cancelar solicitação:', error);
      return c.json({ success: false, message: error.message || 'Erro ao cancelar solicitação' }, 400);
    }
  },

  /**
   * Remove um amigo
   * DELETE /friends/:id
   */
  async removeFriend(c: Context) {
    try {
      const userId = c.get('userId');
      const friendId = c.req.param('id');

      const result = await friendService.removeFriend(userId, friendId);

      return c.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('Erro ao remover amigo:', error);
      return c.json({ success: false, message: error.message || 'Erro ao remover amigo' }, 400);
    }
  },

  /**
   * Bloqueia um usuário
   * POST /friends/block/:id
   */
  async blockUser(c: Context) {
    try {
      const userId = c.get('userId');
      const targetUserId = c.req.param('id');

      const result = await friendService.blockUser(userId, targetUserId);

      return c.json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error('Erro ao bloquear usuário:', error);
      return c.json({ success: false, message: error.message || 'Erro ao bloquear usuário' }, 400);
    }
  },

  /**
   * Lista todos os amigos
   * GET /friends
   */
  async getFriends(c: Context) {
    try {
      const userId = c.get('userId');

      const friends = await friendService.getFriendsList(userId);

      return c.json({
        success: true,
        data: friends,
      });
    } catch (error: any) {
      console.error('Erro ao buscar lista de amigos:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar amigos' }, 500);
    }
  },

  /**
   * Lista solicitações pendentes recebidas
   * GET /friends/requests
   */
  async getPendingRequests(c: Context) {
    try {
      const userId = c.get('userId');

      const requests = await friendService.getPendingRequests(userId);

      return c.json({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      console.error('Erro ao buscar solicitações pendentes:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar solicitações' }, 500);
    }
  },

  /**
   * Lista solicitações enviadas
   * GET /friends/sent
   */
  async getSentRequests(c: Context) {
    try {
      const userId = c.get('userId');

      const requests = await friendService.getSentRequests(userId);

      return c.json({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      console.error('Erro ao buscar solicitações enviadas:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar solicitações' }, 500);
    }
  },

  /**
   * Busca usuários por username/nome
   * GET /friends/search?q=query
   */
  async searchUsers(c: Context) {
    try {
      const userId = c.get('userId');
      const query = c.req.query('q') || '';

      const users = await friendService.searchUsers(userId, query);

      return c.json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar usuários' }, 500);
    }
  },

  /**
   * Retorna estatísticas de amigos
   * GET /friends/stats
   */
  async getStats(c: Context) {
    try {
      const userId = c.get('userId');

      const stats = await friendService.getFriendStats(userId);

      return c.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar estatísticas' }, 500);
    }
  },

  /**
   * Retorna atividades dos amigos
   * GET /friends/activity?limit=20&offset=0
   */
  async getActivity(c: Context) {
    try {
      const userId = c.get('userId');
      const limit = parseInt(c.req.query('limit') || '20', 10);
      const offset = parseInt(c.req.query('offset') || '0', 10);

      console.log('[FEED] Buscando atividades - userId:', userId, 'limit:', limit, 'offset:', offset);

      const activities = await friendService.getFriendActivity(userId, limit, offset);

      console.log('[FEED] Atividades encontradas:', activities.length);

      return c.json({
        success: true,
        data: activities,
      });
    } catch (error: any) {
      console.error('[FEED] Erro ao buscar atividades:', error);
      console.error('[FEED] Stack:', error.stack);
      return c.json({ 
        success: false, 
        message: error.message || 'Erro ao buscar atividades',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 500);
    }
  },

  /**
   * Retorna amigos em comum
   * GET /friends/mutual/:id
   */
  async getMutualFriends(c: Context) {
    try {
      const userId = c.get('userId');
      const friendId = c.req.param('id');

      const mutualFriends = await friendService.getMutualFriends(userId, friendId);

      return c.json({
        success: true,
        data: mutualFriends,
      });
    } catch (error: any) {
      console.error('Erro ao buscar amigos em comum:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar amigos em comum' }, 500);
    }
  },

  /**
   * Limpa solicitações antigas/duplicadas (DEBUG)
   * DELETE /friends/cleanup
   */
  async cleanup(c: Context) {
    try {
      const userId = c.get('userId');
      
      // Limpa solicitações antigas que não são PENDING
      const { prisma } = await import('../lib/prisma.js');
      const result = await prisma.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
          status: { not: 'PENDING' },
        },
      });

      return c.json({
        success: true,
        message: `${result.count} solicitações antigas removidas`,
      });
    } catch (error: any) {
      console.error('Erro ao limpar solicitações:', error);
      return c.json({ success: false, message: error.message || 'Erro ao limpar' }, 400);
    }
  },
};
