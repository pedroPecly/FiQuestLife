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

type LeaderboardType = 'xp' | 'streak' | 'challenges';

/**
 * GET /leaderboard/friends?type=xp
 * Retorna ranking dos amigos do usuário
 * Types: xp (total XP), streak (current streak), challenges (completed challenges)
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
      // Busca usuários com contagem de desafios completados
      const usersWithChallenges = await prisma.user.findMany({
        where: {
          id: {
            in: allUserIds,
          },
        },
        select: {
          ...selectFields,
          userChallenges: {
            where: {
              status: 'COMPLETED',
            },
            select: {
              id: true,
            },
          },
        },
      });

      rankedUsers = usersWithChallenges
        .map(user => ({
          id: user.id,
          username: user.username,
          name: user.name,
          avatarUrl: user.avatarUrl,
          level: user.level,
          xp: user.xp,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          challengesCompleted: user.userChallenges.length,
        }))
        .sort((a, b) => b.challengesCompleted - a.challengesCompleted)
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
    }

    let rankedUsers: any[] = [];

    if (type === 'challenges') {
      const usersWithChallenges = await prisma.user.findMany({
        select: {
          ...selectFields,
          userChallenges: {
            where: {
              status: 'COMPLETED',
            },
            select: {
              id: true,
            },
          },
        },
      });

      rankedUsers = usersWithChallenges
        .map(user => ({
          id: user.id,
          username: user.username,
          name: user.name,
          avatarUrl: user.avatarUrl,
          level: user.level,
          xp: user.xp,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          challengesCompleted: user.userChallenges.length,
        }))
        .sort((a, b) => b.challengesCompleted - a.challengesCompleted)
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
