/**
 * ============================================
 * PUSH TOKEN CONTROLLER
 * ============================================
 * 
 * Gerencia tokens de push notification do Expo
 */

import { Context } from 'hono';
import { prisma } from '../lib/prisma.js';

/**
 * POST /api/push-token
 * Salva/atualiza o Expo Push Token do usuário
 */
export async function savePushToken(c: Context) {
  try {
    const userId = c.get('userId');
    const { expoPushToken } = await c.req.json();

    if (!expoPushToken) {
      return c.json({ error: 'Token não fornecido' }, 400);
    }

    // Valida formato do token Expo
    if (!expoPushToken.startsWith('ExponentPushToken[')) {
      return c.json({ error: 'Token inválido' }, 400);
    }

    console.log('[PUSH TOKEN] Salvando token para userId:', userId);

    await prisma.user.update({
      where: { id: userId },
      data: { expoPushToken },
    });

    console.log('[PUSH TOKEN] Token salvo com sucesso');
    return c.json({ success: true });
  } catch (error) {
    console.error('[PUSH TOKEN] Erro ao salvar token:', error);
    return c.json({ error: 'Erro ao salvar token' }, 500);
  }
}

/**
 * DELETE /api/push-token
 * Remove o Expo Push Token do usuário (logout)
 */
export async function removePushToken(c: Context) {
  try {
    const userId = c.get('userId');

    console.log('[PUSH TOKEN] Removendo token para userId:', userId);

    await prisma.user.update({
      where: { id: userId },
      data: { expoPushToken: null },
    });

    console.log('[PUSH TOKEN] Token removido com sucesso');
    return c.json({ success: true });
  } catch (error) {
    console.error('[PUSH TOKEN] Erro ao remover token:', error);
    return c.json({ error: 'Erro ao remover token' }, 500);
  }
}
