/**
 * ============================================
 * CHALLENGE INVITATION CONTROLLER
 * ============================================
 *
 * Gerencia convites de desafios entre amigos
 */

import type { Context } from 'hono';
import * as challengeInvitationService from '../services/challenge-invitation.service.js';

export const challengeInvitationController = {
  /**
   * Cria convite de desafio para um amigo
   * POST /challenges/:id/invite
   */
  async createInvite(c: Context) {
    try {
      const userId = c.get('userId');
      const challengeId = c.req.param('id');
      const { toUserId, message } = await c.req.json();

      if (!toUserId) {
        return c.json({ success: false, message: 'toUserId é obrigatório' }, 400);
      }

      const invitation = await challengeInvitationService.createChallengeInvitation({
        fromUserId: userId,
        toUserId,
        challengeId,
        message,
      });

      return c.json({
        success: true,
        message: 'Convite enviado com sucesso',
        data: invitation,
      });
    } catch (error: any) {
      console.error('Erro ao criar convite de desafio:', error);
      return c.json({ success: false, message: error.message || 'Erro ao criar convite' }, 400);
    }
  },

  /**
   * Aceita convite de desafio
   * PATCH /challenge-invitations/:id/accept
   */
  async acceptInvite(c: Context) {
    try {
      const userId = c.get('userId');
      const invitationId = c.req.param('id');

      console.log('[CHALLENGE INVITATION] Aceitando convite:', { invitationId, userId });

      const invitation = await challengeInvitationService.acceptChallengeInvitation(
        invitationId,
        userId
      );

      console.log('[CHALLENGE INVITATION] Convite aceito com sucesso');

      return c.json({
        success: true,
        message: 'Convite aceito com sucesso',
        data: invitation,
      });
    } catch (error: any) {
      console.error('[CHALLENGE INVITATION] Erro ao aceitar convite:', error);
      console.error('[CHALLENGE INVITATION] Detalhes do erro:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      return c.json({ success: false, message: error.message || 'Erro ao aceitar convite' }, 400);
    }
  },

  /**
   * Rejeita convite de desafio
   * PATCH /challenge-invitations/:id/reject
   */
  async rejectInvite(c: Context) {
    try {
      const userId = c.get('userId');
      const invitationId = c.req.param('id');

      const invitation = await challengeInvitationService.rejectChallengeInvitation(
        invitationId,
        userId
      );

      return c.json({
        success: true,
        message: 'Convite rejeitado',
        data: invitation,
      });
    } catch (error: any) {
      console.error('Erro ao rejeitar convite:', error);
      return c.json({ success: false, message: error.message || 'Erro ao rejeitar convite' }, 400);
    }
  },

  /**
   * Lista convites pendentes do usuário
   * GET /challenge-invitations/pending
   */
  async getPendingInvites(c: Context) {
    try {
      const userId = c.get('userId');

      const invitations = await challengeInvitationService.getPendingInvitations(userId);

      return c.json({
        success: true,
        data: invitations,
      });
    } catch (error: any) {
      console.error('Erro ao buscar convites pendentes:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar convites' }, 500);
    }
  },

  /**
   * Lista todos os convites do usuário (recebidos e enviados)
   * GET /challenge-invitations
   */
  async getUserInvites(c: Context) {
    try {
      const userId = c.get('userId');

      const invitations = await challengeInvitationService.getUserInvitations(userId);

      return c.json({
        success: true,
        data: invitations,
      });
    } catch (error: any) {
      console.error('Erro ao buscar convites:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar convites' }, 500);
    }
  },

  /**
   * Verifica se um UserChallenge tem convite associado
   * GET /user-challenges/:id/invitation
   */
  async getInvitationByUserChallenge(c: Context) {
    try {
      const userChallengeId = c.req.param('id');

      const invitation = await challengeInvitationService.getChallengeInvitationByUserChallenge(
        userChallengeId
      );

      if (!invitation) {
        return c.json({
          success: true,
          data: null,
        });
      }

      return c.json({
        success: true,
        data: invitation,
      });
    } catch (error: any) {
      console.error('Erro ao buscar convite:', error);
      return c.json({ success: false, message: error.message || 'Erro ao buscar convite' }, 500);
    }
  },
};
