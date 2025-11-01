/**
 * ============================================
 * REWARD CONTROLLER - Controlador de Recompensas
 * ============================================
 * 
 * Endpoints da API de histórico de recompensas:
 * - GET /rewards/history - Histórico completo com filtros
 * - GET /rewards/stats - Estatísticas resumidas
 * - GET /rewards/recent - Últimas 10 recompensas
 * 
 * @created 01 de novembro de 2025
 */

import type { RewardType } from '@prisma/client';
import type { Context } from 'hono';
import {
    getRecentRewards,
    getRewardHistory,
    getRewardStats,
} from '../services/reward.service.js';

/**
 * GET /rewards/history
 * Busca histórico de recompensas com filtros opcionais
 * 
 * Query params:
 * - type: "XP" | "COINS" | "BADGE" | "ITEM" (opcional)
 * - limit: number (padrão: 50)
 * - offset: number (padrão: 0)
 * - startDate: ISO date string (opcional)
 * - endDate: ISO date string (opcional)
 */
export const getHistory = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.userId;

    // Extrai query params
    const type = c.req.query('type') as RewardType | undefined;
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);
    const startDateStr = c.req.query('startDate');
    const endDateStr = c.req.query('endDate');

    // Valida tipo se fornecido
    if (type && !['XP', 'COINS', 'BADGE', 'ITEM'].includes(type)) {
      return c.json({ error: 'Tipo inválido. Use: XP, COINS, BADGE ou ITEM' }, 400);
    }

    // Constrói filtros
    const filters: any = { limit, offset };
    if (type) filters.type = type;
    if (startDateStr) filters.startDate = new Date(startDateStr);
    if (endDateStr) filters.endDate = new Date(endDateStr);

    // Busca histórico
    const result = await getRewardHistory(userId, filters);

    return c.json({
      success: true,
      data: result.rewards,
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error('Error in getHistory:', error);
    return c.json(
      {
        error: 'Erro ao buscar histórico',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * GET /rewards/stats
 * Busca estatísticas resumidas de recompensas
 */
export const getStats = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.userId;

    const stats = await getRewardStats(userId);

    return c.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    return c.json(
      {
        error: 'Erro ao buscar estatísticas',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * GET /rewards/recent
 * Busca últimas 10 recompensas
 */
export const getRecent = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.userId;

    const rewards = await getRecentRewards(userId);

    return c.json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    console.error('Error in getRecent:', error);
    return c.json(
      {
        error: 'Erro ao buscar recompensas recentes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};