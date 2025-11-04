/**
 * ============================================
 * FEED SERVICE - CURTIDAS E COMENTÁRIOS
 * ============================================
 * 
 * Gerencia interações sociais em atividades do feed:
 * - Curtir/descurtir atividades
 * - Comentar em atividades
 * - Listar curtidas e comentários
 * - Deletar comentários
 */

import { prisma } from '../lib/prisma.js';
import { notifyActivityComment, notifyActivityLike } from './notification.service.js';

/**
 * Curtir ou descurtir uma atividade
 * Se já curtiu, remove a curtida (toggle)
 */
export async function toggleLike(userId: string, activityId: string) {
  try {
    // Verificar se já curtiu
    const existingLike = await prisma.activityLike.findUnique({
      where: {
        userId_activityId: {
          userId,
          activityId,
        },
      },
    });

    if (existingLike) {
      // Descurtir
      await prisma.activityLike.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    } else {
      // Curtir
      const like = await prisma.activityLike.create({
        data: {
          userId,
          activityId,
        },
        include: {
          user: {
            select: {
              username: true,
              name: true,
            },
          },
        },
      });

      // Buscar informações da atividade para notificação
      const activity = await prisma.rewardHistory.findUnique({
        where: { id: activityId },
        select: {
          userId: true,
          description: true,
        },
      });

      // Notificar dono da atividade (se não for ele mesmo curtindo e atividade existir)
      if (activity && activity.userId !== userId) {
        try {
          await notifyActivityLike(
            activity.userId,
            like.user.name || like.user.username,
            activity.description || 'sua conquista'
          );
        } catch (error) {
          console.error('[FEED SERVICE] Erro ao criar notificação de curtida:', error);
          // Não falha se notificação der erro
        }
      }

      return { liked: true };
    }
  } catch (error) {
    console.error('[FEED SERVICE] Erro ao curtir/descurtir:', error);
    throw error;
  }
}

/**
 * Buscar curtidas de uma atividade
 * Retorna usuários que curtiram
 */
export async function getActivityLikes(activityId: string) {
  try {
    const likes = await prisma.activityLike.findMany({
      where: { activityId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return likes.map((like) => ({
      id: like.id,
      createdAt: like.createdAt.toISOString(),
      user: like.user,
    }));
  } catch (error) {
    console.error('[FEED SERVICE] Erro ao buscar curtidas:', error);
    throw error;
  }
}

/**
 * Adicionar comentário em uma atividade
 */
export async function addComment(userId: string, activityId: string, content: string) {
  try {
    // Validar conteúdo
    if (!content || content.trim().length === 0) {
      throw new Error('Comentário não pode estar vazio');
    }

    if (content.length > 500) {
      throw new Error('Comentário não pode ter mais de 500 caracteres');
    }

    const comment = await prisma.activityComment.create({
      data: {
        userId,
        activityId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Buscar informações da atividade para notificação
    const activity = await prisma.rewardHistory.findUnique({
      where: { id: activityId },
      select: {
        userId: true,
        description: true,
      },
    });

    // Notificar dono da atividade (se não for ele mesmo comentando e atividade existir)
    if (activity && activity.userId !== userId) {
      try {
        await notifyActivityComment(
          activity.userId,
          comment.user.name || comment.user.username,
          comment.content,
          activity.description || 'sua conquista'
        );
      } catch (error) {
        console.error('[FEED SERVICE] Erro ao criar notificação de comentário:', error);
        // Não falha se notificação der erro
      }
    }

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      user: comment.user,
    };
  } catch (error) {
    console.error('[FEED SERVICE] Erro ao adicionar comentário:', error);
    throw error;
  }
}

/**
 * Buscar comentários de uma atividade
 */
export async function getActivityComments(activityId: string, limit: number = 50) {
  try {
    const comments = await prisma.activityComment.findMany({
      where: { activityId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      user: comment.user,
    }));
  } catch (error) {
    console.error('[FEED SERVICE] Erro ao buscar comentários:', error);
    throw error;
  }
}

/**
 * Deletar comentário
 * Apenas o autor pode deletar
 */
export async function deleteComment(userId: string, commentId: string) {
  try {
    // Buscar comentário
    const comment = await prisma.activityComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Comentário não encontrado');
    }

    // Verificar se é o autor
    if (comment.userId !== userId) {
      throw new Error('Você não tem permissão para deletar este comentário');
    }

    // Deletar
    await prisma.activityComment.delete({
      where: { id: commentId },
    });

    return { success: true };
  } catch (error) {
    console.error('[FEED SERVICE] Erro ao deletar comentário:', error);
    throw error;
  }
}

/**
 * Buscar contadores de curtidas e comentários para múltiplas atividades
 * Usado para exibir no feed
 */
export async function getActivityStats(activityIds: string[], userId: string) {
  try {
    if (activityIds.length === 0) {
      return [];
    }

    // Buscar curtidas
    const likes = await prisma.activityLike.groupBy({
      by: ['activityId'],
      where: {
        activityId: { in: activityIds },
      },
      _count: true,
    });

    // Buscar comentários
    const comments = await prisma.activityComment.groupBy({
      by: ['activityId'],
      where: {
        activityId: { in: activityIds },
      },
      _count: true,
    });

    // Verificar quais atividades o usuário curtiu
    const userLikes = await prisma.activityLike.findMany({
      where: {
        userId,
        activityId: { in: activityIds },
      },
      select: { activityId: true },
    });

    const userLikedIds = new Set(userLikes.map((like) => like.activityId));

    // Montar mapa de stats
    const statsMap = activityIds.reduce((acc, activityId) => {
      const likeCount = likes.find((l) => l.activityId === activityId)?._count ?? 0;
      const commentCount = comments.find((c) => c.activityId === activityId)?._count ?? 0;
      const isLikedByUser = userLikedIds.has(activityId);

      acc[activityId] = {
        likesCount: likeCount,
        commentsCount: commentCount,
        isLikedByUser,
      };

      return acc;
    }, {} as Record<string, { likesCount: number; commentsCount: number; isLikedByUser: boolean }>);

    return statsMap;
  } catch (error) {
    console.error('[FEED SERVICE] Erro ao buscar stats de atividades:', error);
    throw error;
  }
}
