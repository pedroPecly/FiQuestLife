import { Hono } from 'hono';
import { challengeInvitationController } from '../controllers/challenge-invitation.controller.js';
import {
    completeChallengeById,
    getAllChallengesController,
    getDailyChallenges,
    getHistory,
} from '../controllers/challenge.controller.js';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { updateChallengeProgress } from '../services/challenge.service.js';
import { getUserId } from '../utils/context.helpers.js';

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
 * Busca desafios ativos e pendentes que possuem tracking automático
 * (STEPS / DISTANCE / DURATION). Retorna o UserChallenge ID para
 * que o cliente use diretamente nos endpoints de progress/complete.
 */
challengeRoutes.get('/active-with-tracking', async (c) => {
  try {
    const userId = getUserId(c);

    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        userId,
        // Inclui IN_PROGRESS (já iniciado) e PENDING (auto-tracking: iniciará ao primeiro sync)
        status: { in: ['IN_PROGRESS', 'PENDING'] },
        challenge: {
          trackingType: {
            in: ['STEPS', 'DISTANCE', 'DURATION'],
          },
        },
        // Só desafios atribuídos hoje
        assignedAt: {
          gte: (() => {
            const t = new Date();
            t.setHours(0, 0, 0, 0);
            return t;
          })(),
        },
      },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            trackingType: true,
            targetValue: true,
            targetUnit: true,
          },
        },
      },
    });

    const formattedChallenges = userChallenges.map((uc) => ({
      // ⚠️ id = UserChallenge.id (usado nos endpoints de progress/complete)
      id: uc.id,
      challengeId: uc.challenge.id,
      title: uc.challenge.title,
      trackingType: uc.challenge.trackingType,
      targetValue: uc.challenge.targetValue,
      targetUnit: uc.challenge.targetUnit,
      currentProgress: uc.progress ?? 0,
      // valores brutos já salvos
      steps: uc.steps ?? 0,
      distance: uc.distance ?? 0,
      duration: uc.duration ?? 0,
      status: uc.status,
    }));

    return c.json({ success: true, data: formattedChallenges });
  } catch (error: any) {
    console.error('[CHALLENGES] Erro ao buscar desafios com tracking:', error);
    return c.json(
      { success: false, message: 'Erro ao buscar desafios com tracking', error: error.message },
      500
    );
  }
});

/**
 * PUT /challenges/:id/progress
 * Atualiza progresso de um desafio de atividade física sem completá-lo.
 * :id = UserChallenge ID
 *
 * Body: { currentValue: number, trackingData?: { steps?, distance?, timestamp? } }
 */
challengeRoutes.put('/:id/progress', async (c) => {
  try {
    const userId = getUserId(c);
    const userChallengeId = c.req.param('id');

    const body = await c.req.json();
    const { currentValue, trackingData } = body as {
      currentValue: number;
      trackingData?: { steps?: number; distance?: number; timestamp?: number };
    };

    if (typeof currentValue !== 'number') {
      return c.json({ success: false, message: 'currentValue é obrigatório e deve ser número' }, 400);
    }

    const result = await updateChallengeProgress(userId, userChallengeId, currentValue, trackingData);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    if (error.message === 'Desafio não encontrado') return c.json({ success: false, message: error.message }, 404);
    if (error.message === 'Este desafio não pertence a você') return c.json({ success: false, message: error.message }, 403);
    console.error('[CHALLENGES] Erro ao atualizar progresso:', error);
    return c.json({ success: false, message: 'Erro ao atualizar progresso', error: error.message }, 500);
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
