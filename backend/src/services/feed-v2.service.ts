/**
 * ============================================
 * FEED SERVICE - VERSÃO PROFISSIONAL
 * ============================================
 * 
 * Usa reward_history como fonte única de verdade
 * Todos os eventos do feed são registrados lá
 */

import { prisma } from '../lib/prisma.js';

/**
 * Retorna atividades dos amigos (Feed Social)
 * Usa reward_history como fonte única
 */
export async function getFriendActivityV2(userId: string, limit: number = 20, offset: number = 0) {
  try {
    console.log('[FEED V2] Iniciando busca - userId:', userId);
    
    // Buscar IDs dos amigos
    const friendships = await prisma.friendship.findMany({
      where: { userId },
      select: { friendId: true },
    });

    const friendIds = friendships.map((f) => f.friendId);

    if (friendIds.length === 0) {
      return [];
    }

    // Buscar atividades do reward_history
    const activities = await prisma.rewardHistory.findMany({
      where: {
        userId: { in: friendIds },
        source: {
          in: [
            'CHALLENGE_COMPLETION',
            'BADGE_ACHIEVEMENT',
            'LEVEL_PROGRESSION',
            // Streak milestones podem ter diferentes sources
          ],
        },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            level: true,
            currentStreak: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Mapear para formato do feed
    return activities.map((activity) => {
      let type = '';
      let metadata = '';
      let xpReward = 0;

      switch (activity.source) {
        case 'CHALLENGE_COMPLETION':
          type = 'CHALLENGE_COMPLETED';
          xpReward = activity.amount;
          break;
        case 'BADGE_ACHIEVEMENT':
          type = 'BADGE_EARNED';
          break;
        case 'LEVEL_PROGRESSION':
          type = 'LEVEL_UP';
          metadata = String(activity.user.level);
          xpReward = activity.amount;
          break;
        default:
          if (activity.source.includes('streak')) {
            type = 'STREAK_MILESTONE';
            metadata = String(activity.user.currentStreak);
          }
      }

      return {
        id: activity.id,
        type,
        userId: activity.user.id,
        username: activity.user.username,
        name: activity.user.name,
        avatarUrl: activity.user.avatarUrl,
        description: activity.description,
        metadata,
        createdAt: activity.createdAt.toISOString(),
        xpReward,
      };
    });
  } catch (error) {
    console.error('[FEED V2] Erro:', error);
    throw error;
  }
}

/**
 * Retorna atividades do próprio usuário
 */
export async function getUserOwnActivityV2(userId: string, limit: number = 20, offset: number = 0) {
  try {
    const activities = await prisma.rewardHistory.findMany({
      where: {
        userId,
        source: {
          in: [
            'CHALLENGE_COMPLETION',
            'BADGE_ACHIEVEMENT',
            'LEVEL_PROGRESSION',
          ],
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            level: true,
            currentStreak: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return activities.map((activity) => {
      let type = '';
      let metadata = '';
      let xpReward = 0;

      switch (activity.source) {
        case 'CHALLENGE_COMPLETION':
          type = 'CHALLENGE_COMPLETED';
          xpReward = activity.amount;
          break;
        case 'BADGE_ACHIEVEMENT':
          type = 'BADGE_EARNED';
          break;
        case 'LEVEL_PROGRESSION':
          type = 'LEVEL_UP';
          metadata = String(activity.user.level);
          xpReward = activity.amount;
          break;
        default:
          if (activity.source.includes('streak')) {
            type = 'STREAK_MILESTONE';
            metadata = String(activity.user.currentStreak);
          }
      }

      return {
        id: activity.id,
        type,
        userId: activity.user.id,
        username: activity.user.username,
        name: activity.user.name,
        avatarUrl: activity.user.avatarUrl,
        description: activity.description,
        metadata,
        createdAt: activity.createdAt.toISOString(),
        xpReward,
      };
    });
  } catch (error) {
    console.error('[USER ACTIVITY V2] Erro:', error);
    throw error;
  }
}
