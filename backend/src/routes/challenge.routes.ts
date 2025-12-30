/**
 * ============================================
 * CHALLENGE ROUTES - Rotas de Desafios
 * ============================================
 * 
 * Rotas protegidas da API de desafios
 * Requer autenticação via authMiddleware
 * 
 * @created 20 de outubro de 2025
 */

import { Hono } from 'hono';
import { challengeInvitationController } from '../controllers/challenge-invitation.controller.js';
import {
    completeChallengeById,
    getAllChallengesController,
    getDailyChallenges,
    getHistory,
} from '../controllers/challenge.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const challengeRoutes = new Hono();

// Todas as rotas requerem autenticação
challengeRoutes.use('*', authMiddleware);

/**
 * GET /challenges/daily
 * Busca ou atribui desafios diários
 */
challengeRoutes.get('/daily', getDailyChallenges);

/**
 * GET /challenges/active-with-tracking
 * Busca desafios ativos do usuário que possuem tracking automático
 * Usado pelo sistema de sincronização automática
 */
challengeRoutes.get('/active-with-tracking', async (c) => {
  try {
    const userId = c.get('userId');
    const { prisma } = c.get('services');

    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        userId,
        status: 'IN_PROGRESS',
        challenge: {
          trackingType: {
            in: ['STEPS', 'DISTANCE', 'DURATION'],
          },
        },
      },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            trackingType: true,
            targetValue: true,
          },
        },
      },
    });

    const formattedChallenges = userChallenges.map((uc) => ({
      id: uc.challenge.id,
      title: uc.challenge.title,
      trackingType: uc.challenge.trackingType,
      targetValue: uc.challenge.targetValue,
      currentProgress: uc.progress || 0,
      status: uc.status,
    }));

    return c.json({
      success: true,
      data: formattedChallenges,
    });
  } catch (error: any) {
    console.error('[CHALLENGES] Erro ao buscar desafios com tracking:', error);
    return c.json(
      {
        success: false,
        message: 'Erro ao buscar desafios com tracking',
        error: error.message,
      },
      500
    );
  }
});

/**
 * POST /challenges/:id/invite
 * Convida um amigo para um desafio
 */
challengeRoutes.post('/:id/invite', challengeInvitationController.createInvite);

/**
 * POST /challenges/:id/complete
 * Completa um desafio específico
 */
challengeRoutes.post('/:id/complete', completeChallengeById);

/**
 * GET /challenges/history
 * Histórico de desafios completados
 */
challengeRoutes.get('/history', getHistory);

/**
 * GET /challenges/all
 * Todos os desafios disponíveis (admin/debug)
 */
challengeRoutes.get('/all', getAllChallengesController);

export default challengeRoutes;
