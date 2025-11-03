/**
 * ============================================
 * RATE LIMITING MIDDLEWARE
 * ============================================
 * 
 * Proteção contra spam e ataques de força bruta
 * 
 * @created 2 de novembro de 2025
 */

import type { Context, Next } from 'hono';

// Store de rate limiting (em produção, usar Redis)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Limpa entradas expiradas a cada 1 minuto
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60000);

/**
 * Cria middleware de rate limiting
 */
export function rateLimit(options: {
  windowMs: number;  // Janela de tempo em milissegundos
  max: number;       // Máximo de requisições na janela
  message?: string;  // Mensagem de erro customizada
  keyGenerator?: (c: Context) => string; // Gerador de chave customizado
}) {
  const {
    windowMs,
    max,
    message = 'Muitas requisições. Tente novamente mais tarde.',
    keyGenerator = (c) => {
      // Usa IP + userId (se autenticado)
      const ip = c.req.header('x-forwarded-for') || 
                 c.req.header('x-real-ip') || 
                 'unknown';
      const userId = c.get('userId') || 'anonymous';
      return `${ip}:${userId}`;
    },
  } = options;

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c);
    const now = Date.now();

    // Inicializa ou reseta contador
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    // Incrementa contador
    store[key].count++;

    // Verifica se excedeu limite
    if (store[key].count > max) {
      const resetIn = Math.ceil((store[key].resetTime - now) / 1000);
      return c.json({
        success: false,
        error: message,
        retryAfter: resetIn,
      }, 429);
    }

    // Adiciona headers de rate limit
    c.header('X-RateLimit-Limit', max.toString());
    c.header('X-RateLimit-Remaining', (max - store[key].count).toString());
    c.header('X-RateLimit-Reset', store[key].resetTime.toString());

    await next();
  };
}

// ============================================
// LIMITERS PRÉ-CONFIGURADOS
// ============================================

/**
 * Rate limiter geral para API
 * 100 requisições por minuto
 */
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100,
  message: 'Muitas requisições. Tente novamente em 1 minuto.',
});

/**
 * Rate limiter para solicitações de amizade
 * 20 solicitações a cada 15 minutos
 */
export const friendRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  message: 'Muitas solicitações de amizade. Tente novamente em 15 minutos.',
  keyGenerator: (c) => {
    const userId = c.get('userId') || 'anonymous';
    return `friend-request:${userId}`;
  },
});

/**
 * Rate limiter para busca de usuários
 * 30 buscas por minuto
 */
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30,
  message: 'Muitas buscas. Tente novamente em 1 minuto.',
  keyGenerator: (c) => {
    const userId = c.get('userId') || 'anonymous';
    return `search:${userId}`;
  },
});

/**
 * Rate limiter para feed
 * 60 requisições por minuto
 */
export const feedLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 60,
  message: 'Muitas requisições ao feed. Tente novamente em 1 minuto.',
  keyGenerator: (c) => {
    const userId = c.get('userId') || 'anonymous';
    return `feed:${userId}`;
  },
});

/**
 * Rate limiter para login
 * 5 tentativas a cada 15 minutos
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  keyGenerator: (c) => {
    const ip = c.req.header('x-forwarded-for') || 
               c.req.header('x-real-ip') || 
               'unknown';
    return `login:${ip}`;
  },
});
