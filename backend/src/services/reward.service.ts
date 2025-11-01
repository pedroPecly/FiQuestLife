/**
 * ============================================
 * REWARD SERVICE - Serviço de Recompensas
 * ============================================
 * 
 * Lógica de negócio para histórico de recompensas:
 * - Buscar histórico completo
 * - Filtrar por tipo (XP, COINS, BADGE, ITEM)
 * - Paginação
 * - Estatísticas resumidas
 * 
 * @created 01 de novembro de 2025
 */

import type { RewardType } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

/**
 * Interface para filtros de histórico
 */
interface RewardHistoryFilters {
  type?: RewardType;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Interface para estatísticas de recompensas
 */
interface RewardStats {
  totalXP: number;
  totalCoins: number;
  totalBadges: number;
  totalRewards: number;
}

/**
 * Busca histórico de recompensas com filtros e paginação
 */
export const getRewardHistory = async (
  userId: string,
  filters: RewardHistoryFilters = {}
) => {
  const {
    type,
    startDate,
    endDate,
    limit = 50,
    offset = 0,
  } = filters;

  // Constrói filtros dinâmicos
  const where: any = { userId };

  if (type) {
    where.type = type;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  // Busca recompensas com paginação
  const rewards = await prisma.rewardHistory.findMany({
    where,
    orderBy: {
      createdAt: 'desc', // Mais recentes primeiro
    },
    take: limit,
    skip: offset,
  });

  // Conta total para paginação
  const total = await prisma.rewardHistory.count({ where });

  return {
    rewards,
    total,
    hasMore: offset + limit < total,
  };
};

/**
 * Busca estatísticas resumidas de recompensas
 */
export const getRewardStats = async (userId: string): Promise<RewardStats> => {
  // Busca todas as recompensas do usuário
  const allRewards = await prisma.rewardHistory.findMany({
    where: { userId },
    select: {
      type: true,
      amount: true,
    },
  });

  // Calcula estatísticas
  const stats: RewardStats = {
    totalXP: 0,
    totalCoins: 0,
    totalBadges: 0,
    totalRewards: allRewards.length,
  };

  allRewards.forEach((reward) => {
    switch (reward.type) {
      case 'XP':
        stats.totalXP += reward.amount;
        break;
      case 'COINS':
        stats.totalCoins += reward.amount;
        break;
      case 'BADGE':
        stats.totalBadges += reward.amount;
        break;
    }
  });

  return stats;
};

/**
 * Busca recompensas recentes (últimas 10)
 */
export const getRecentRewards = async (userId: string) => {
  const rewards = await prisma.rewardHistory.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  return rewards;
};

/**
 * Busca recompensas por tipo específico
 */
export const getRewardsByType = async (
  userId: string,
  type: RewardType,
  limit = 50
) => {
  const rewards = await prisma.rewardHistory.findMany({
    where: {
      userId,
      type,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return rewards;
};
