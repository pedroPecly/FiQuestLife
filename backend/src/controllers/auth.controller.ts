/**
 * ============================================
 * CONTROLLER DE AUTENTICAÇÃO (JWT)
 * ============================================
 *
 * Lida com cadastro, login e geração de tokens JWT
 */

import type { Context } from 'hono';
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authController = {
  /**
   * Cadastro de usuário
   * POST /register
   */
  async register(c: Context) {
    // Os dados já foram validados na rota
    const { email, username, password, name, birthDate } = await c.req.json();

    // Verifica se já existe usuário com esse email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return c.json({ error: 'Email já cadastrado!' }, 409);
    }

    // Verifica se já existe usuário com esse username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return c.json({ error: 'Nome de usuário já está em uso!' }, 409);
    }

    // Importa bcrypt dinamicamente para ES Modules
    const bcrypt = (await import('bcrypt')).default;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário no banco
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,  // Agora obrigatório
        birthDate: new Date(birthDate),  // Converte string para Date
      },
    });

    // Importa jsonwebtoken dinamicamente para ES Modules
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Remove senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    return c.json({
      message: 'Usuário cadastrado com sucesso!',
      token,
      user: userWithoutPassword,
    }, 201);
  },

  /**
   * Login de usuário
   * POST /login
   * Aceita email OU username
   */
  async login(c: Context) {
    // Os dados já foram validados na rota
    const { identifier, password } = await c.req.json();

    // Busca usuário pelo email OU username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return c.json({ error: 'Email/usuário ou senha inválidos!' }, 401);
    }

    // Importa bcrypt dinamicamente para ES Modules
    const bcrypt = (await import('bcrypt')).default;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return c.json({ error: 'Email/usuário ou senha inválidos!' }, 401);
    }

    // Importa jsonwebtoken dinamicamente para ES Modules
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ userId: user.id, email: user.email, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Remove senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    return c.json({
      message: 'Login realizado com sucesso!',
      token,
      user: userWithoutPassword,
    });
  },
};