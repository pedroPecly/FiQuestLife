/**
 * ============================================
 * LEADERBOARD CONTROLLER
 * ============================================
 * 
 * Rankings e classificações:
 * - GET /leaderboard/friends - Ranking entre amigos
 * - Filtros: xp, streak, challenges
 * - Inclui posição do usuário atual
 * 
 * @created 2 de novembro de 2025
 */

import type { Context } from 'hono';
import { prisma } from '../lib/prisma.js';

type LeaderboardType = 'xp' | 'streak' | 'challenges' | 'distance';

/**
 * GET /leaderboard/friends?type=xp
 * Retorna ranking dos amigos do usuário
 * Types: xp (total XP), streak (current streak), challenges (completed challenges), distance (km percorridos)
 */
export const getFriendsLeaderboard = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const type = (c.req.query('type') || 'xp') as LeaderboardType;
    const limit = parseInt(c.req.query('limit') || '50');

    // Busca IDs dos amigos
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: userId },
          { friendId: userId },
        ],
      },
      select: {
        userId: true,
        friendId: true,
      },
    });

    const friendIds = friendships.map(f => 
      f.userId === userId ? f.friendId : f.userId
    );

    // Inclui o próprio usuário no ranking
    const allUserIds = [...friendIds, userId];

    // Define campo de ordenação baseado no tipo
    let orderByField: any = {};
    let selectFields: any = {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
      level: true,
      xp: true,
      currentStreak: true,
      longestStreak: true,
    };

    switch (type) {
      case 'xp':
        orderByField = { xp: 'desc' };
        break;
      case 'streak':
        orderByField = { currentStreak: 'desc' };
        break;
      case 'challenges':
        // Para challenges, precisaremos de uma query mais complexa
        break;
    }

    let rankedUsers: any[] = [];

    if (type === 'challenges') {
      // ⚠️ IMPORTANTE: Conta pelo histórico de recompensas, não por userChallenges
      // Motivo: desafios completados antigos podem ser deletados do banco
      // Mas o histórico de recompensas permanece para sempre
      
      const usersWithRewards = await prisma.user.findMany({
        where: {
          id: {
            in: allUserIds,
          },
        },
        select: {
          ...selectFields,
          rewardHistory: {
            where: {
              source: 'CHALLENGE_COMPLETION'
            },
            select: {
              id: true
            }
          }
        },
      });

      console.log('[LEADERBOARD DEBUG] Usuários encontrados:', usersWithRewards.length);

      rankedUsers = usersWithRewards
        .map(user => {
          // Divide por 2 porque cada desafio gera 2 rewards (XP + COINS)
          const challengesCompleted = Math.floor(user.rewardHistory.length / 2);
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            challengesCompleted,
            totalDistance: 0,
          };
        })
        .sort((a, b) => b.challengesCompleted - a.challengesCompleted)
        .slice(0, limit);
    } else if (type === 'distance') {
      // Ranking por distância total percorrida (em km)
      const usersWithDistance = await prisma.user.findMany({
        where: {
          id: {
            in: allUserIds,
          },
        },
        select: {
          ...selectFields,
          activityTracking: {
            select: {
              distance: true,
            },
          },
        },
      });

      rankedUsers = usersWithDistance
        .map(user => {
          // Soma total de distância em km
          const totalDistance = user.activityTracking.reduce(
            (sum: number, activity: any) => sum + (activity.distance || 0),
            0
          );
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            challengesCompleted: 0, // Adiciona campo padrão
            totalDistance: Math.round(totalDistance * 100) / 100, // Arredonda para 2 casas decimais
          };
        })
        .sort((a, b) => b.totalDistance - a.totalDistance)
        .slice(0, limit);
    } else {
      // Para XP e Streak, query simples
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: allUserIds,
          },
        },
        select: selectFields,
        orderBy: orderByField,
        take: limit,
      });

      // Adiciona contagem de desafios completados para todos os tipos
      rankedUsers = await Promise.all(
        users.map(async (user) => {
          const challengesCompleted = await prisma.userChallenge.count({
            where: {
              // @ts-ignore - Prisma type inference issue, works at runtime
              userId: user.id,
              status: 'COMPLETED',
            },
          });

          return {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            challengesCompleted,
            totalDistance: 0,
          };
        })
      );
    }

    // Adiciona posição (rank) e flag isCurrentUser
    const leaderboard = rankedUsers.map((user, index) => ({
      rank: index + 1,
      ...user,
      isCurrentUser: user.id === userId,
    }));

    // Encontra posição do usuário atual
    const currentUserRank = leaderboard.find(u => u.isCurrentUser)?.rank || null;

    return c.json({
      success: true,
      data: {
        type,
        leaderboard,
        currentUserRank,
        totalUsers: leaderboard.length,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar leaderboard:', error);
    return c.json({ success: false, error: 'Erro ao buscar ranking' }, 500);
  }
};

/**
 * GET /leaderboard/global?type=xp
 * Retorna ranking global (top 100 usuários)
 */
export const getGlobalLeaderboard = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const type = (c.req.query('type') || 'xp') as LeaderboardType;
    const limit = parseInt(c.req.query('limit') || '100');

    let orderByField: any = {};
    let selectFields: any = {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
      level: true,
      xp: true,
      currentStreak: true,
      longestStreak: true,
    };

    switch (type) {
      case 'xp':
        orderByField = { xp: 'desc' };
        break;
      case 'streak':
        orderByField = { currentStreak: 'desc' };
        break;
      case 'distance':
        // Distance será calculado pela soma do ActivityTracking
        break;
    }

    let rankedUsers: any[] = [];

    if (type === 'challenges') {
      // ⚠️ IMPORTANTE: Conta pelo histórico de recompensas, não por userChallenges
      const usersWithRewards = await prisma.user.findMany({
        select: {
          ...selectFields,
          rewardHistory: {
            where: {
              source: 'CHALLENGE_COMPLETION'
            },
            select: {
              id: true
            }
          }
        },
      });

      rankedUsers = usersWithRewards
        .map(user => {
          // Divide por 2 porque cada desafio gera 2 rewards (XP + COINS)
          const challengesCompleted = Math.floor(user.rewardHistory.length / 2);
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            challengesCompleted,
            totalDistance: 0,
          };
        })
        .sort((a, b) => b.challengesCompleted - a.challengesCompleted)
        .slice(0, limit);
    } else if (type === 'distance') {
      // Ranking por distância total percorrida (em km)
      const usersWithDistance = await prisma.user.findMany({
        select: {
          ...selectFields,
          activityTracking: {
            select: {
              distance: true,
            },
          },
        },
      });

      rankedUsers = usersWithDistance
        .map(user => {
          const totalDistance = user.activityTracking.reduce(
            (sum: number, activity: any) => sum + (activity.distance || 0),
            0
          );
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            challengesCompleted: 0,
            totalDistance: Math.round(totalDistance * 100) / 100,
          };
        })
        .sort((a, b) => b.totalDistance - a.totalDistance)
        .slice(0, limit);
    } else {
      const users = await prisma.user.findMany({
        select: selectFields,
        orderBy: orderByField,
        take: limit,
      });

      rankedUsers = await Promise.all(
        users.map(async (user) => {
          const challengesCompleted = await prisma.userChallenge.count({
            where: {
              // @ts-ignore - Prisma type inference issue, works at runtime
              userId: user.id,
              status: 'COMPLETED',
            },
          });

          return {
            id: user.id,
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            level: user.level,
            xp: user.xp,
            currentStreak: user.currentStreak,
            longestStreak: user.longestStreak,
            challengesCompleted,
            totalDistance: 0,
          };
        })
      );
    }

    const leaderboard = rankedUsers.map((user, index) => ({
      rank: index + 1,
      ...user,
      isCurrentUser: user.id === userId,
    }));

    const currentUserRank = leaderboard.find(u => u.isCurrentUser)?.rank || null;

    return c.json({
      success: true,
      data: {
        type,
        leaderboard,
        currentUserRank,
        totalUsers: leaderboard.length,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar leaderboard global:', error);
    return c.json({ success: false, error: 'Erro ao buscar ranking global' }, 500);
  }
};

export const leaderboardController = {
  getFriendsLeaderboard,
  getGlobalLeaderboard,
};
