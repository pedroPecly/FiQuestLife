/**
 * ============================================
 * BADGE CONTROLLER - Controlador de Badges
 * ============================================
 * 
 * Endpoints da API de badges:
 * - GET /badges/all - Lista todos os badges disponíveis
 * - GET /badges/user - Badges conquistados pelo usuário
 * - GET /badges/progress - Progresso de todos os badges
 * 
 * @created 20 de outubro de 2025
 */

import type { Context } from 'hono';
import {
    getAllBadges,
    getBadgesProgress,
    getUserBadges,
} from '../services/badge.service.js';

/**
 * GET /badges/all
 * Lista todos os badges disponíveis no sistema
 */
export const getAllBadgesController = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    const badges = await getAllBadges();

    return c.json({
      success: true,
      data: badges,
      message: `${badges.length} badges disponíveis`,
    });
  } catch (error) {
    console.error('Error in getAllBadgesController:', error);
    return c.json(
      {
        error: 'Erro ao buscar badges',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * GET /badges/user
 * Busca badges conquistados pelo usuário
 */
export const getUserBadgesController = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    const userBadges = await getUserBadges(userId);

    return c.json({
      success: true,
      data: userBadges,
      message: `${userBadges.length} badges conquistados`,
    });
  } catch (error) {
    console.error('Error in getUserBadgesController:', error);
    return c.json(
      {
        error: 'Erro ao buscar badges do usuário',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * GET /badges/progress
 * Calcula progresso de todos os badges para o usuário
 */
export const getBadgesProgressController = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    const badgesWithProgress = await getBadgesProgress(userId);

    const earned = badgesWithProgress.filter((b) => b.earned).length;
    const total = badgesWithProgress.length;

    return c.json({
      success: true,
      data: badgesWithProgress,
      summary: {
        earned,
        total,
        percentage: Math.round((earned / total) * 100),
      },
      message: `${earned}/${total} badges conquistados`,
    });
  } catch (error) {
    console.error('Error in getBadgesProgressController:', error);

    if (error instanceof Error && error.message === 'Usuário não encontrado') {
      return c.json({ error: error.message }, 404);
    }

    return c.json(
      {
        error: 'Erro ao calcular progresso de badges',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};
