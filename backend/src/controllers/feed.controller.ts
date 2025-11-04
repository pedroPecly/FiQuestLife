/**
 * ============================================
 * FEED CONTROLLER - CURTIDAS E COMENTÁRIOS
 * ============================================
 */

import { Context } from 'hono';
import * as feedService from '../services/feed.service.js';

/**
 * POST /feed/:activityId/like
 * Curtir ou descurtir atividade
 */
export async function toggleLike(c: Context) {
  try {
    const userId = c.get('userId');
    const { activityId } = c.req.param();

    if (!activityId) {
      return c.json({ error: 'ID da atividade é obrigatório' }, 400);
    }

    const result = await feedService.toggleLike(userId, activityId);

    return c.json({
      message: result.liked ? 'Atividade curtida!' : 'Curtida removida',
      liked: result.liked,
    });
  } catch (error: any) {
    console.error('[FEED CONTROLLER] Erro ao curtir/descurtir:', error);
    return c.json({ error: error.message || 'Erro ao processar curtida' }, 500);
  }
}

/**
 * GET /feed/:activityId/likes
 * Buscar curtidas de uma atividade
 */
export async function getActivityLikes(c: Context) {
  try {
    const { activityId } = c.req.param();

    if (!activityId) {
      return c.json({ error: 'ID da atividade é obrigatório' }, 400);
    }

    const likes = await feedService.getActivityLikes(activityId);

    return c.json({
      likes,
      total: likes.length,
    });
  } catch (error: any) {
    console.error('[FEED CONTROLLER] Erro ao buscar curtidas:', error);
    return c.json({ error: error.message || 'Erro ao buscar curtidas' }, 500);
  }
}

/**
 * POST /feed/:activityId/comment
 * Adicionar comentário em atividade
 */
export async function addComment(c: Context) {
  try {
    const userId = c.get('userId');
    const { activityId } = c.req.param();
    const { content } = await c.req.json();

    if (!activityId) {
      return c.json({ error: 'ID da atividade é obrigatório' }, 400);
    }

    if (!content) {
      return c.json({ error: 'Conteúdo do comentário é obrigatório' }, 400);
    }

    const comment = await feedService.addComment(userId, activityId, content);

    return c.json({
      message: 'Comentário adicionado com sucesso!',
      comment,
    });
  } catch (error: any) {
    console.error('[FEED CONTROLLER] Erro ao adicionar comentário:', error);
    return c.json({ error: error.message || 'Erro ao adicionar comentário' }, 500);
  }
}

/**
 * GET /feed/:activityId/comments
 * Buscar comentários de uma atividade
 */
export async function getActivityComments(c: Context) {
  try {
    const { activityId } = c.req.param();
    const limit = parseInt(c.req.query('limit') || '50');

    if (!activityId) {
      return c.json({ error: 'ID da atividade é obrigatório' }, 400);
    }

    const comments = await feedService.getActivityComments(activityId, limit);

    return c.json({
      comments,
      total: comments.length,
    });
  } catch (error: any) {
    console.error('[FEED CONTROLLER] Erro ao buscar comentários:', error);
    return c.json({ error: error.message || 'Erro ao buscar comentários' }, 500);
  }
}

/**
 * DELETE /feed/comments/:commentId
 * Deletar comentário
 */
export async function deleteComment(c: Context) {
  try {
    const userId = c.get('userId');
    const { commentId } = c.req.param();

    if (!commentId) {
      return c.json({ error: 'ID do comentário é obrigatório' }, 400);
    }

    await feedService.deleteComment(userId, commentId);

    return c.json({
      message: 'Comentário deletado com sucesso!',
    });
  } catch (error: any) {
    console.error('[FEED CONTROLLER] Erro ao deletar comentário:', error);
    
    if (error.message.includes('não encontrado')) {
      return c.json({ error: error.message }, 404);
    }
    
    if (error.message.includes('permissão')) {
      return c.json({ error: error.message }, 403);
    }
    
    return c.json({ error: error.message || 'Erro ao deletar comentário' }, 500);
  }
}

/**
 * POST /feed/stats
 * Buscar stats (likes, comments) de múltiplas atividades
 */
export async function getActivityStats(c: Context) {
  try {
    const userId = c.get('userId');
    const { activityIds } = await c.req.json();

    if (!Array.isArray(activityIds)) {
      return c.json({ error: 'activityIds deve ser um array' }, 400);
    }

    const stats = await feedService.getActivityStats(activityIds, userId);

    return c.json({ stats });
  } catch (error: any) {
    console.error('[FEED CONTROLLER] Erro ao buscar stats:', error);
    return c.json({ error: error.message || 'Erro ao buscar stats' }, 500);
  }
}

