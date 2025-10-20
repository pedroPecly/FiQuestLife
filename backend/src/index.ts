/**
 * ============================================
 * ARQUIVO PRINCIPAL DO SERVIDOR BACKEND
 * ============================================
 * 
 * Aqui a gente configura o servidor usando Hono (tipo Express, mas mais rápido)
 * e inicializa tudo que a API precisa pra funcionar
 */

// Importa as variáveis do arquivo .env (tipo senha do banco, porta, etc)
import 'dotenv/config';

// Importa o framework Hono e seus recursos
import { serve } from '@hono/node-server'; // Adaptador pra rodar Hono no Node.js
import { Hono } from 'hono';
import { cors } from 'hono/cors'; // Permite requisições de outros domínios (front-end)
import { logger } from 'hono/logger'; // Mostra logs no terminal de cada requisição

// Importa nossas coisas personalizadas
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.js';
import badgeRoutes from './routes/badge.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/user.js';

// Cria a aplicação (nosso servidor)
const app = new Hono();

// ============================================
// MIDDLEWARES (código que roda antes das rotas)
// ============================================

// Logger: mostra no terminal toda requisição que chega (GET, POST, etc)
app.use('*', logger());

// CORS: permite que o front-end (React Native) acesse a API
// Sem isso, o navegador bloqueia as requisições por segurança
app.use('*', cors());

// ============================================
// ROTAS (endpoints da API)
// ============================================

// Rota principal (/) - Página inicial da API
app.get('/', (c) => {
  return c.json({
    message: '🎮 Bem-vindo ao FiQuestLife API!',
    version: '1.0.0',
    endpoints: {
      health: '/health - Verifica se API está online',
      database: '/health/db - Verifica conexão com banco',
      register: '/auth/register - Cadastro de novo usuário',
      login: '/auth/login - Login com email ou username',
      profile: '/auth/me ou /user/me - Perfil completo (requer token)',
      dailyChallenges: '/challenges/daily - Desafios diários (requer token)',
      completeChallenge: '/challenges/:id/complete - Completar desafio (requer token)',
      challengeHistory: '/challenges/history - Histórico de desafios (requer token)',
      badgesAll: '/badges/all - Todos os badges disponíveis (requer token)',
      badgesUser: '/badges/user - Badges conquistados (requer token)',
      badgesProgress: '/badges/progress - Progresso de badges (requer token)',
    },
    docs: 'Veja o arquivo GUIA.js pra aprender a usar a API',
    authentication: 'Use o header: Authorization: Bearer SEU_TOKEN',
  });
});

// Registra todas as rotas de /health (tipo /health, /health/db)
// Essas rotas servem pra verificar se a API tá funcionando
app.route('/health', healthRoutes);

// Registra as rotas de autenticação (/auth/register, /auth/login)
app.route('/auth', authRoutes);

// Registra as rotas de usuário protegidas (/user/me)
app.route('/user', userRoutes);

// Registra as rotas de desafios (/challenges/daily, /challenges/:id/complete)
app.route('/challenges', challengeRoutes);

// Registra as rotas de badges (/badges/all, /badges/user, /badges/progress)
app.route('/badges', badgeRoutes);

// ============================================
// TRATAMENTO DE ERROS
// ============================================

// Se der algum erro no código, esse middleware captura e retorna uma mensagem bonitinha
app.onError(errorMiddleware);

// Se o usuário acessar uma rota que não existe, retorna 404
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

// Pega a porta do .env ou usa 3000 como padrão
const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Server running at http://localhost:${port}`);

// Inicia o servidor na porta definida
serve({
  fetch: app.fetch,  // Função que processa as requisições
  port,              // Porta onde o servidor vai rodar
});
