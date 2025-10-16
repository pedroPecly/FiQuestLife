/**
 * ============================================
 * ROTAS DE HEALTH CHECK
 * ============================================
 * 
 * Aqui a gente define quais URLs (rotas) vão fazer o quê.
 * É tipo um mapa que diz pro servidor:
 * "Quando alguém acessar /health, executa isso aqui"
 * 
 * Separar as rotas em arquivos diferentes deixa o código mais limpo!
 */

import { Hono } from 'hono';
import { healthController } from '../controllers/health.controller.js';

// Cria um grupo de rotas pra /health
const health = new Hono();

/**
 * GET /health
 * Verifica se a API tá funcionando
 * 
 * Exemplo de uso:
 * http://localhost:3000/health
 */
health.get('/', healthController.check);

/**
 * GET /health/db
 * Testa a conexão com o banco de dados
 * 
 * Exemplo de uso:
 * http://localhost:3000/health/db
 */
health.get('/db', healthController.db);

// Exporta as rotas pra usar no index.ts
export default health;
