/**
 * ============================================
 * CHALLENGE CONTROLLER - Controlador de Desafios
 * ============================================
 * 
 * Endpoints da API de desafios:
 * - GET /challenges/daily - Busca desafios diários
 * - POST /challenges/:id/complete - Completa um desafio
 * - GET /challenges/history - Histórico de desafios
 * - GET /challenges/all - Todos os desafios (admin)
 * 
 * @created 20 de outubro de 2025
 */

import type { Context } from 'hono';
import {
    assignDailyChallenges,
    completeChallenge,
    getAllChallenges,
    getChallengeHistory,
    getUserDailyChallenges,
} from '../services/challenge.service.js';

/**
 * GET /challenges/daily
 * Busca ou atribui desafios diários do usuário
 */
export const getDailyChallenges = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    // Tenta buscar desafios existentes
    let challenges = await getUserDailyChallenges(userId);

    // Se não existem, atribui novos
    if (challenges.length === 0) {
      challenges = await assignDailyChallenges(userId);
    }

    return c.json({
      success: true,
      data: challenges,
      message: `${challenges.length} desafios diários`,
    });
  } catch (error) {
    console.error('Error in getDailyChallenges:', error);
    return c.json(
      {
        error: 'Erro ao buscar desafios',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * POST /challenges/:id/complete
 * Completa um desafio e dá recompensas
 */
export const completeChallengeById = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };
    const userChallengeId = c.req.param('id');

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    if (!userChallengeId) {
      return c.json({ error: 'ID do desafio não fornecido' }, 400);
    }

    const result = await completeChallenge(userId, userChallengeId);

    return c.json({
      success: true,
      data: result,
      message: 'Desafio completado com sucesso!',
    });
  } catch (error) {
    console.error('Error in completeChallengeById:', error);

    if (error instanceof Error) {
      if (error.message === 'Desafio não encontrado') {
        return c.json({ error: error.message }, 404);
      }
      if (
        error.message === 'Este desafio não pertence a você' ||
        error.message === 'Desafio já completado'
      ) {
        return c.json({ error: error.message }, 403);
      }
    }

    return c.json(
      {
        error: 'Erro ao completar desafio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * GET /challenges/history
 * Busca histórico de desafios completados
 */
export const getHistory = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    // Query param para limit (padrão: 50)
    const limitParam = c.req.query('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const history = await getChallengeHistory(userId, limit);

    return c.json({
      success: true,
      data: history,
      message: `${history.length} desafios completados`,
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
 * GET /challenges/all
 * Busca todos os desafios disponíveis (admin/debug)
 */
export const getAllChallengesController = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    const challenges = await getAllChallenges();

    return c.json({
      success: true,
      data: challenges,
      message: `${challenges.length} desafios disponíveis`,
    });
  } catch (error) {
    console.error('Error in getAllChallengesController:', error);
    return c.json(
      {
        error: 'Erro ao buscar desafios',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};
