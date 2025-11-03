/**
 * ============================================
 * FRIEND ROUTES - Rotas de Amigos
 * ============================================
 * 
 * Rotas protegidas da API de amigos
 * Gerencia solicitações de amizade, lista de amigos,
 * busca de usuários e atividades dos amigos
 * 
 * Requer autenticação via authMiddleware
 */

import { Hono } from 'hono';
import { friendController } from '../controllers/friend.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { feedLimiter, friendRequestLimiter, searchLimiter } from '../middlewares/rate-limit.middleware.js';

const friendRoutes = new Hono();

// Todas as rotas requerem autenticação
friendRoutes.use('*', authMiddleware);

/**
 * GET /friends
 * Lista todos os amigos do usuário
 */
friendRoutes.get('/', friendController.getFriends);

/**
 * POST /friends/request
 * Envia solicitação de amizade
 * Rate limit: 20 req / 15 min
 */
friendRoutes.post('/request', friendRequestLimiter, friendController.sendRequest);

/**
 * GET /friends/requests
 * Lista solicitações pendentes recebidas
 */
friendRoutes.get('/requests', friendController.getPendingRequests);

/**
 * GET /friends/sent
 * Lista solicitações enviadas
 */
friendRoutes.get('/sent', friendController.getSentRequests);

/**
 * POST /friends/accept/:id
 * Aceita uma solicitação de amizade
 */
friendRoutes.post('/accept/:id', friendController.acceptRequest);

/**
 * POST /friends/reject/:id
 * Rejeita uma solicitação de amizade
 */
friendRoutes.post('/reject/:id', friendController.rejectRequest);

/**
 * POST /friends/cancel/:id
 * Cancela uma solicitação de amizade enviada
 */
friendRoutes.post('/cancel/:id', friendController.cancelRequest);

/**
 * DELETE /friends/:id
 * Remove um amigo
 */
friendRoutes.delete('/:id', friendController.removeFriend);

/**
 * POST /friends/block/:id
 * Bloqueia um usuário
 */
friendRoutes.post('/block/:id', friendController.blockUser);

/**
 * GET /friends/search?q=query
 * Busca usuários por username/nome
 * Rate limit: 30 req / 1 min
 */
friendRoutes.get('/search', searchLimiter, friendController.searchUsers);

/**
 * GET /friends/stats
 * Retorna estatísticas de amigos
 */
friendRoutes.get('/stats', friendController.getStats);

/**
 * DELETE /friends/cleanup
 * Limpa solicitações antigas (DEBUG)
 */
friendRoutes.delete('/cleanup', friendController.cleanup);

/**
 * GET /friends/activity?limit=20&offset=0
 * Retorna atividades dos amigos
 * Rate limit: 60 req / 1 min
 */
friendRoutes.get('/activity', feedLimiter, friendController.getActivity);

/**
 * GET /friends/mutual/:id
 * Retorna amigos em comum com outro usuário
 */
friendRoutes.get('/mutual/:id', friendController.getMutualFriends);

export default friendRoutes;
