/**
 * ============================================
 * CHALLENGE INVITATION ROUTES
 * ============================================
 *
 * Rotas para gerenciar convites de desafios entre amigos
 */

import { Hono } from 'hono';
import { challengeInvitationController } from '../controllers/challenge-invitation.controller.js';
import { runInvitationsCleanup } from '../jobs/cleanup-invitations.job.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const app = new Hono();

// Todas as rotas requerem autenticação
app.use('*', authMiddleware);

// POST /challenges/:id/invite - Criar convite de desafio
app.post('/:id/invite', challengeInvitationController.createInvite);

// GET /challenge-invitations - Listar todos os convites
app.get('/', challengeInvitationController.getUserInvites);

// GET /challenge-invitations/pending - Listar convites pendentes
app.get('/pending', challengeInvitationController.getPendingInvites);

// PATCH /challenge-invitations/:id/accept - Aceitar convite
app.patch('/:id/accept', challengeInvitationController.acceptInvite);

// PATCH /challenge-invitations/:id/reject - Rejeitar convite
app.patch('/:id/reject', challengeInvitationController.rejectInvite);

// GET /user-challenges/:id/invitation - Verificar se UserChallenge tem convite
app.get('/user-challenge/:id', challengeInvitationController.getInvitationByUserChallenge);

// POST /challenge-invitations/cleanup - Executar limpeza de convites antigos (admin/dev)
app.post('/cleanup', async (c) => {
  try {
    const result = await runInvitationsCleanup();
    return c.json({ 
      ...result,
      success: true, 
      message: 'Limpeza executada com sucesso'
    });
  } catch (error: any) {
    console.error('[CLEANUP ROUTE] Erro:', error);
    return c.json({ 
      success: false, 
      error: error.message || 'Erro ao executar limpeza' 
    }, 500);
  }
});

export default app;
