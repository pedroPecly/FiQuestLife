/**
 * ============================================
 * FEED ROUTES - CURTIDAS E COMENTÁRIOS
 * ============================================
 */

import { Hono } from 'hono';
import * as feedController from '../controllers/feed.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const feedRoutes = new Hono();

// Todas as rotas protegidas
feedRoutes.use('/*', authMiddleware);

// Stats
feedRoutes.post('/stats', feedController.getActivityStats);

// Curtidas
feedRoutes.post('/:activityId/like', feedController.toggleLike);
feedRoutes.get('/:activityId/likes', feedController.getActivityLikes);

// Comentários
feedRoutes.post('/:activityId/comment', feedController.addComment);
feedRoutes.get('/:activityId/comments', feedController.getActivityComments);
feedRoutes.delete('/comments/:commentId', feedController.deleteComment);

export default feedRoutes;
