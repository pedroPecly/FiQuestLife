/**
 * ============================================
 * ROTAS DE AUTENTICAÇÃO (JWT)
 * ============================================
 *
 * POST /register - Cadastro de usuário
 * POST /login    - Login de usuário
 * GET  /me       - Perfil do usuário (protegida)
 */

import { Hono } from 'hono';

import { authController } from '../controllers/auth.controller.js';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const auth = new Hono();

// Validação manual para cadastro
auth.post('/register', async (c) => {
  const { email, username, password, name, birthDate } = await c.req.json();
  const errors = [];
  
  // Valida email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push({ field: 'email', message: 'Email inválido' });
  }
  
  // Valida username
  if (!username || typeof username !== 'string' || username.length < 3) {
    errors.push({ field: 'username', message: 'Nome de usuário deve ter pelo menos 3 caracteres' });
  }
  
  // Valida se username tem apenas letras, números e underscores
  if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push({ field: 'username', message: 'Nome de usuário pode conter apenas letras, números e _' });
  }
  
  // Valida senha
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'Senha deve ter pelo menos 6 caracteres' });
  }
  
  // Valida name (obrigatório)
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Nome completo é obrigatório' });
  }
  
  // Valida birthDate (obrigatório)
  if (!birthDate) {
    errors.push({ field: 'birthDate', message: 'Data de nascimento é obrigatória' });
  } else {
    // Verifica se é uma data válida
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'birthDate', message: 'Data de nascimento inválida' });
    } else {
      // Verifica se não é uma data futura
      const today = new Date();
      if (date > today) {
        errors.push({ field: 'birthDate', message: 'Data de nascimento não pode ser no futuro' });
      }
      // Verifica se não é muito antiga (mínimo 1900)
      const minDate = new Date(1900, 0, 1);
      if (date < minDate) {
        errors.push({ field: 'birthDate', message: 'Data de nascimento deve ser após 1900' });
      }
    }
  }
  
  if (errors.length > 0) {
    return c.json({ errors }, 400);
  }
  // Chama o controller
  return await authController.register(c);
});

// Validação manual para login
auth.post('/login', async (c) => {
  const { identifier, password } = await c.req.json();
  const errors = [];
  
  // identifier pode ser email OU username
  if (!identifier || typeof identifier !== 'string' || identifier.length === 0) {
    errors.push({ field: 'identifier', message: 'Email ou nome de usuário obrigatório' });
  }
  
  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', message: 'Senha obrigatória' });
  }
  
  if (errors.length > 0) {
    return c.json({ errors }, 400);
  }
  // Chama o controller
  return await authController.login(c);
});

/**
 * GET /auth/me
 * Alias para /user/me - Retorna perfil completo do usuário
 * 
 * Rota protegida que retorna todos os dados do usuário logado.
 * Esta é uma rota alternativa seguindo o padrão do prompt.
 * A rota principal continua sendo /user/me
 */
auth.get('/me', authMiddleware, async (c) => {
  try {
    // O middleware já validou o token
    // @ts-ignore
    const userData = c.get('user') as { userId: string };
    
    // Busca perfil completo no banco
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
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
        password: false, // NUNCA retorna senha
      },
    });
    
    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }
    
    return c.json({ user });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return c.json({ error: 'Erro ao carregar perfil' }, 500);
  }
});

export default auth;
