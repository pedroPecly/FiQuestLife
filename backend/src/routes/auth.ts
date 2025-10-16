/**
 * ============================================
 * ROTAS DE AUTENTICAÇÃO (JWT)
 * ============================================
 *
 * POST /register - Cadastro de usuário
 * POST /login    - Login de usuário
 */

import { Hono } from 'hono';

import { authController } from '../controllers/auth.controller.js';

const auth = new Hono();

// Validação manual para cadastro
auth.post('/register', async (c) => {
  const { email, username, password } = await c.req.json();
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

export default auth;
