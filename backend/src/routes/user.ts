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
        birthDate: true,
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

/**
 * PUT /user/profile
 * Atualiza o perfil do usuário logado
 * 
 * Precisa enviar o token no header:
 * Authorization: Bearer SEU_TOKEN_AQUI
 * 
 * Body (JSON):
 * {
 *   "name": "Nome Completo",
 *   "username": "username123",
 *   "bio": "Minha bio opcional",
 *   "birthDate": "2000-01-15T00:00:00.000Z"
 * }
 */
user.put('/profile', authMiddleware, async (c) => {
  try {
    // @ts-ignore
    const userData = c.get('user') as { userId: string; email: string };
    const body = await c.req.json();

    // Validações
    const { name, username, bio, birthDate } = body;

    // Validar campos obrigatórios
    if (!name || name.trim().length < 3) {
      return c.json({ error: 'Nome deve ter pelo menos 3 caracteres' }, 400);
    }

    if (!username || username.trim().length < 3) {
      return c.json({ error: 'Username deve ter pelo menos 3 caracteres' }, 400);
    }

    // Validar formato do username (apenas letras, números e underscore)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return c.json({ error: 'Username deve conter apenas letras, números e _' }, 400);
    }

    if (!birthDate) {
      return c.json({ error: 'Data de nascimento é obrigatória' }, 400);
    }

    // Verificar se o username já está em uso por outro usuário
    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (existingUser && existingUser.id !== userData.userId) {
      return c.json({ error: 'Username já está em uso por outro usuário' }, 409);
    }

    // Atualizar perfil
    const updatedUser = await prisma.user.update({
      where: { id: userData.userId },
      data: {
        name: name.trim(),
        username: username.trim(),
        bio: bio?.trim() || null,
        birthDate: new Date(birthDate),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        birthDate: true,
        bio: true,
        avatarUrl: true,
        xp: true,
        coins: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
        notificationsEnabled: true,
        dailyReminderTime: true,
        profilePublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({
      message: 'Perfil atualizado com sucesso!',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return c.json({ 
      error: 'Erro ao atualizar perfil. Tente novamente.' 
    }, 500);
  }
});

export default user;