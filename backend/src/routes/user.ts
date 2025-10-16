/**
 * ============================================
 * ROTAS DE USUÁRIO (PROTEGIDAS)
 * ============================================
 *
 * Rotas que exigem autenticação JWT
 * Exemplo de como proteger rotas
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const user = new Hono();

/**
 * GET /user/me
 * Retorna os dados do usuário logado
 * 
 * Precisa enviar o token no header:
 * Authorization: Bearer SEU_TOKEN_AQUI
 */
user.get('/me', authMiddleware, async (c) => {
  // O middleware já validou o token e colocou os dados em c.get('user')
  // @ts-ignore - TypeScript não reconhece variáveis customizadas no contexto
  const userData = c.get('user') as { userId: string; email: string };
  
  return c.json({
    message: 'Usuário autenticado!',
    user: userData,
  });
});

export default user;
