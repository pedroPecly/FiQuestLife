/**
 * ============================================
 * BADGE SERVICE - Serviço de Badges
 * ============================================
 * 
 * Lógica de negócio para gerenciamento de badges:
 * - Buscar todos os badges disponíveis
 * - Buscar badges do usuário (conquistados)
 * - Calcular progresso de badges não conquistados
 * 
 * @created 20 de outubro de 2025
 */

import type { ChallengeCategory } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

/**
 * Busca todos os badges disponíveis no sistema
 * Ordenados por ordem de exibição
 */
export const getAllBadges = async () => {
  const badges = await prisma.badge.findMany({
    where: { isActive: true },
    orderBy: [
      { category: 'asc' },
      { order: 'asc' },
    ],
  });

  return badges;
};

/**
 * Busca badges conquistados pelo usuário
 * Inclui informações do badge e data de conquista
 */
export const getUserBadges = async (userId: string) => {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
    orderBy: {
      earnedAt: 'desc', // Mais recentes primeiro
    },
  });

  return userBadges;
};

/**
 * Calcula progresso de todos os badges para o usuário
 * Retorna badges conquistados e não conquistados com progresso
 */
export const getBadgesProgress = async (userId: string) => {
  // Busca todos os badges
  const allBadges = await prisma.badge.findMany({
    where: { isActive: true },
    orderBy: [
      { category: 'asc' },
      { order: 'asc' },
    ],
  });

  // Busca badges já conquistados
  const earnedBadgeRecords = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true, earnedAt: true },
  });

  const earnedBadgesMap = new Map(
    earnedBadgeRecords.map((ub) => [ub.badgeId, ub.earnedAt])
  );

  // Busca dados do usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      level: true,
      currentStreak: true,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Total de desafios completados
  const totalChallengesCompleted = await prisma.userChallenge.count({
    where: { userId, status: 'COMPLETED' },
  });

  // Mapa de badges para categorias de desafios
  const categoryMap: Record<string, ChallengeCategory> = {
    'Atleta': 'PHYSICAL_ACTIVITY',
    'Nutricionista': 'NUTRITION',
    'Hidratado': 'HYDRATION',
    'Mente Sã': 'MENTAL_HEALTH',
    'Dorminhoco': 'SLEEP',
    'Social': 'SOCIAL',
    'Produtivo': 'PRODUCTIVITY',
  // 'Meditador': 'MINDFULNESS',
  };

  // Calcula progresso de cada badge
  const badgesWithProgress = await Promise.all(
    allBadges.map(async (badge) => {
      const earnedAt = earnedBadgesMap.get(badge.id);

      // Se já conquistado, retorna com flag earned
      if (earnedAt) {
        return {
          ...badge,
          earned: true,
          earnedAt: earnedAt.toISOString(),
          progress: {
            current: badge.requirementValue,
            required: badge.requirementValue,
            percentage: 100,
          },
        };
      }

      // Calcula progresso baseado no tipo de requisito
      let current = 0;

      switch (badge.requirementType) {
        case 'CHALLENGES_COMPLETED':
          current = totalChallengesCompleted;
          break;

        case 'STREAK_DAYS':
          current = user.currentStreak;
          break;

        case 'LEVEL_REACHED':
          current = user.level;
          break;

        case 'XP_EARNED':
          current = user.xp;
          break;

        case 'CATEGORY_MASTER': {
          const category = categoryMap[badge.name];
          if (category) {
            current = await prisma.userChallenge.count({
              where: {
                userId,
                status: 'COMPLETED',
                challenge: { category },
              },
            });
          }
          break;
        }

        case 'SPECIFIC_CHALLENGE':
        case 'SOCIAL_INTERACTION':
          // Para badges especiais/manuais, progresso é 0
          current = 0;
          break;
      }

      const percentage = Math.min(
        Math.round((current / badge.requirementValue) * 100),
        100
      );

      return {
        ...badge,
        earned: false,
        progress: {
          current,
          required: badge.requirementValue,
          percentage,
        },
      };
    })
  );

  return badgesWithProgress;
};
