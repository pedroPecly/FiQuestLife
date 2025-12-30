/**
 * ============================================
 * CONTEXT HELPERS
 * ============================================
 * 
 * Helpers para extrair dados do contexto Hono com tipos corretos
 */

import type { Context } from 'hono';

/**
 * Extrai o userId do contexto (setado pelo authMiddleware)
 */
export function getUserId(c: Context): string {
  const userId = c.get('userId');
  if (!userId) {
    throw new Error('userId não encontrado no contexto');
  }
  return userId as string;
}

/**
 * Extrai o user completo do contexto (setado pelo authMiddleware)
 */
export function getUser(c: Context): { userId: string; email: string } {
  const user = c.get('user');
  if (!user) {
    throw new Error('user não encontrado no contexto');
  }
  return user as { userId: string; email: string };
}
