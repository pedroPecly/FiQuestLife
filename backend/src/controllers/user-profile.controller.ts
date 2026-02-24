/**
 * ============================================
 * USER PROFILE CONTROLLER
 * ============================================
 * 
 * Gerencia perfis públicos de usuários:
 * - GET /users/:userId/profile - Perfil público com verificação de privacidade
 * - GET /users/:userId/mutual-friends - Amigos em comum
 * - GET /users/:userId/recent-activity - Atividades recentes
 * 
 * @created 2 de novembro de 2025
 */

import type { Context } from 'hono';
import { prisma } from '../lib/prisma.js';
import { isValidUUID } from '../utils/validation.js';

/**
 * GET /users/:userId/profile
 * Retorna perfil público do usuário
 * - Se profilePublic=false, verifica se é amigo
 * - Retorna stats, badges recentes, desafios recentes
 */
export const getUserProfile = async (c: Context) => {
  try {
    const targetUserId = c.req.param('userId');
    const currentUserId = c.get('userId');

    if (!targetUserId) {
      return c.json({ success: false, error: 'userId é obrigatório' }, 400);
    }

    // Valida formato do UUID antes de consultar banco
    if (!isValidUUID(targetUserId)) {
      return c.json({ success: false, error: 'Usuário não encontrado' }, 404);
    }

    // Busca usuário alvo
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        level: true,
        xp: true,
        coins: true,
        currentStreak: true,
        longestStreak: true,
        profilePublic: true,
        createdAt: true,
      },
    });

    if (!targetUser) {
      return c.json({ success: false, error: 'Usuário não encontrado' }, 404);
    }

    // Se perfil é privado, verifica amizade
    if (!targetUser.profilePublic && currentUserId !== targetUserId) {
      const areFriends = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: currentUserId, friendId: targetUserId },
            { userId: targetUserId, friendId: currentUserId },
          ],
        },
      });

      if (!areFriends) {
        return c.json({
          success: false,
          error: 'Este perfil é privado. Adicione como amigo para visualizar.',
          isPrivate: true,
        }, 403);
      }
    }

    // Busca estatísticas de desafios
    const [totalChallenges, completedChallenges] = await Promise.all([
      prisma.userChallenge.count({
        where: { userId: targetUserId },
      }),
      prisma.userChallenge.count({
        where: {
          userId: targetUserId,
          status: 'COMPLETED',
        },
      }),
    ]);

    // Busca badges conquistados (últimos 6)
    const badges = await prisma.userBadge.findMany({
      where: { userId: targetUserId },
      include: {
        badge: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            rarity: true,
            category: true,
          },
        },
      },
      orderBy: { earnedAt: 'desc' },
      take: 6,
    });

    // Busca desafios completados recentemente (últimos 5)
    const recentChallenges = await prisma.userChallenge.findMany({
      where: {
        userId: targetUserId,
        status: 'COMPLETED',
      },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            category: true,
            difficulty: true,
            xpReward: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 5,
    });

    // Conta total de amigos (cada friendship aparece 1 vez, não importa a ordem)
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: targetUserId },
          { friendId: targetUserId },
        ],
      },
      select: {
        userId: true,
        friendId: true,
      },
    });

    // Cada amizade deve ser contada apenas 1 vez
    const friendIds = new Set<string>();
    friendships.forEach(f => {
      const otherId = f.userId === targetUserId ? f.friendId : f.userId;
      friendIds.add(otherId);
    });
    const friendsCount = friendIds.size;

    // Verifica se o usuário atual é amigo do alvo
    const isFriend = currentUserId !== targetUserId ? await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: currentUserId, friendId: targetUserId },
          { userId: targetUserId, friendId: currentUserId },
        ],
      },
    }) : null;

    // Verifica se há solicitação pendente
    const pendingRequest = currentUserId !== targetUserId ? await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: targetUserId, status: 'PENDING' },
          { senderId: targetUserId, receiverId: currentUserId, status: 'PENDING' },
        ],
      },
    }) : null;

    return c.json({
      success: true,
      data: {
        user: {
          id: targetUser.id,
          username: targetUser.username,
          name: targetUser.name,
          avatarUrl: targetUser.avatarUrl,
          bio: targetUser.bio,
          level: targetUser.level,
          xp: targetUser.xp,
          coins: targetUser.coins,
          currentStreak: targetUser.currentStreak,
          longestStreak: targetUser.longestStreak,
          memberSince: targetUser.createdAt,
        },
        stats: {
          totalChallenges,
          completedChallenges,
          completionRate: totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0,
          friendsCount,
          badgesCount: badges.length,
        },
        badges: badges.map(ub => ({
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          imageUrl: ub.badge.imageUrl,
          rarity: ub.badge.rarity,
          category: ub.badge.category,
          earnedAt: ub.earnedAt,
        })),
        recentChallenges: recentChallenges
          // Desduplicar: manter apenas a conclusão mais recente de cada desafio
          // (um usuário pode completar o mesmo desafio em dias diferentes)
          .filter((uc, index, self) =>
            index === self.findIndex(u => u.challenge.id === uc.challenge.id)
          )
          .map(uc => ({
          id: uc.id,              // ID do UserChallenge — sempre único
          title: uc.challenge.title,
          category: uc.challenge.category,
          difficulty: uc.challenge.difficulty,
          xpReward: uc.challenge.xpReward,
          completedAt: uc.completedAt,
        })),
        relationship: {
          isFriend: !!isFriend,
          hasPendingRequest: !!pendingRequest,
          requestDirection: pendingRequest ? (pendingRequest.senderId === currentUserId ? 'SENT' : 'RECEIVED') : null,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return c.json({ success: false, error: 'Erro ao buscar perfil' }, 500);
  }
};

/**
 * GET /users/:userId/mutual-friends
 * Retorna amigos em comum entre usuário atual e alvo
 */
export const getMutualFriends = async (c: Context) => {
  try {
    const targetUserId = c.req.param('userId');
    const currentUserId = c.get('userId');

    if (!targetUserId) {
      return c.json({ success: false, error: 'userId é obrigatório' }, 400);
    }

    // Busca amigos do usuário atual
    const currentUserFriends = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: currentUserId },
          { friendId: currentUserId },
        ],
      },
      select: {
        userId: true,
        friendId: true,
      },
    });

    const currentFriendsIds = currentUserFriends.map(f => 
      f.userId === currentUserId ? f.friendId : f.userId
    );

    // Busca amigos do usuário alvo
    const targetUserFriends = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: targetUserId },
          { friendId: targetUserId },
        ],
      },
      select: {
        userId: true,
        friendId: true,
      },
    });

    const targetFriendsIds = targetUserFriends.map(f =>
      f.userId === targetUserId ? f.friendId : f.userId
    );

    // Encontra IDs em comum
    const mutualFriendsIds = currentFriendsIds.filter(id => targetFriendsIds.includes(id));

    // Busca dados dos amigos em comum
    const mutualFriends = await prisma.user.findMany({
      where: {
        id: {
          in: mutualFriendsIds,
        },
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        level: true,
        xp: true,
      },
    });

    return c.json({
      success: true,
      data: mutualFriends,
      count: mutualFriends.length,
    });
  } catch (error) {
    console.error('Erro ao buscar amigos em comum:', error);
    return c.json({ success: false, error: 'Erro ao buscar amigos em comum' }, 500);
  }
};

export const userProfileController = {
  getUserProfile,
  getMutualFriends,
};
