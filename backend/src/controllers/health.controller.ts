/**
 * ============================================
 * CONTROLLER DE HEALTH CHECK
 * ============================================
 * 
 * Controllers são tipo o "cérebro" das rotas.
 * Aqui a gente coloca a lógica de negócio, tipo:
 * - O que fazer quando alguém acessar /health
 * - Como verificar se o banco tá funcionando
 * 
 * Separar em controllers deixa o código mais organizado!
 */

import type { Context } from 'hono';

export const healthController = {
  /**
   * ============================================
   * CHECK - Verifica se a API tá online
   * ============================================
   * 
   * Rota: GET /health
   * 
   * Essa função é tipo um "oi, tô vivo!" da API.
   * Serve pra testar se o servidor tá rodando certinho.
   * 
   * Retorna: JSON com status OK + timestamp
   */
  async check(c: Context) {
    return c.json({
      status: 'OK',
      message: 'FiQuestLife API is running',
      timestamp: new Date().toISOString(),  // Data/hora atual no formato ISO
      version: '1.0.0',
    });
  },

  /**
   * ============================================
   * DB - Testa conexão com o banco de dados
   * ============================================
   * 
   * Rota: GET /health/db
   * 
   * Essa função tenta fazer uma query simples no banco
   * pra ver se a conexão tá funcionando.
   * 
   * Se funcionar: retorna status OK
   * Se der erro: retorna status ERROR com a mensagem do erro
   */
  async db(c: Context) {
    try {
      // Importa o Prisma (ORM que faz a comunicação com o banco)
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      // Faz uma query simples só pra testar (SELECT 1 não retorna nada, só verifica conexão)
      await prisma.$queryRaw`SELECT 1`;
      
      // Desconecta do banco pra não ficar ocupando conexão atoa
      await prisma.$disconnect();

      // Se chegou aqui, deu tudo certo!
      return c.json({
        status: 'OK',
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Se deu ruim, retorna o erro
      return c.json(
        {
          status: 'ERROR',
          message: 'Database connection failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        500  // Código HTTP 500 = Internal Server Error
      );
    }
  },
};
