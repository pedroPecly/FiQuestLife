/**
 * ============================================
 * ROTAS DE USUÁRIO (PROTEGIDAS)
 * ============================================
 *
 * Rotas que exigem autenticação JWT
 * Todas as rotas aqui precisam de token válido
 */

import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const user = new Hono();

/**
 * GET /user/me
 * Retorna o perfil COMPLETO do usuário logado
 * 
 * Precisa enviar o token no header:
 * Authorization: Bearer SEU_TOKEN_AQUI
 * 
 * Retorna todos os dados do perfil (exceto senha):
 * - Dados básicos (email, username, name, bio)
 * - Dados de gamificação (xp, coins, level, streaks)
 * - Configurações (notificações, privacidade)
 */
user.get('/me', authMiddleware, async (c) => {
  try {
    // O middleware já validou o token e colocou os dados em c.get('user')
    // @ts-ignore - TypeScript não reconhece variáveis customizadas no contexto
    const userData = c.get('user') as { userId: string; email: string };
    
    // Busca o perfil completo do usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: {
        // ===== DADOS BÁSICOS =====
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        avatarUrl: true,
        
        // ===== GAMIFICAÇÃO =====
        xp: true,
        coins: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
        
        // ===== CONFIGURAÇÕES =====
        notificationsEnabled: true,
        dailyReminderTime: true,
        profilePublic: true,
        
        // ===== METADADOS =====
        createdAt: true,
        updatedAt: true,
        
        // ===== SEGURANÇA =====
        password: false, // NUNCA retorna a senha!
      },
    });
    
    // Se o usuário não existir no banco (improvável, mas possível)
    if (!user) {
      return c.json({ 
        error: 'Usuário não encontrado. O token pode estar corrompido.' 
      }, 404);
    }
    
    // Retorna o perfil completo
    return c.json({
      message: 'Perfil carregado com sucesso!',
      user,
    });
    
  } catch (error) {
    // Se der erro ao buscar no banco
    console.error('Erro ao buscar perfil:', error);
    return c.json({ 
      error: 'Erro ao carregar perfil. Tente novamente.' 
    }, 500);
  }
});

export default user;
