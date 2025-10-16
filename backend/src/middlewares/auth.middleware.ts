/**
 * ============================================
 * MIDDLEWARE DE AUTENTICAÇÃO JWT
 * ============================================
 *
 * Verifica se o usuário enviou um token JWT válido
 * Usado para proteger rotas que precisam de autenticação
 *
 * Exemplo de uso:
 * app.get('/perfil', authMiddleware, (c) => { ... })
 */

import type { Context, Next } from 'hono';

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Middleware que verifica se o token JWT é válido
 * 
 * O token deve vir no header Authorization: Bearer TOKEN_AQUI
 */
export const authMiddleware = async (c: Context, next: Next): Promise<Response | void> => {
  try {
    // Pega o header Authorization
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    // O formato deve ser: "Bearer TOKEN"
    // Separa e pega só o token
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return c.json({ error: 'Formato de token inválido. Use: Bearer TOKEN' }, 401);
    }

    const token = parts[1];

    // Importa jsonwebtoken dinamicamente para ES Modules
    const jwt = (await import('jsonwebtoken')).default;
    
    // Verifica se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // Guarda os dados do usuário no contexto pra usar nas rotas
    c.set('user', decoded);
    
    // Continua pro próximo middleware/rota
    await next();
  } catch (error) {
    return c.json({ error: 'Token inválido ou expirado' }, 401);
  }
};