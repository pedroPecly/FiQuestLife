/**
 * ============================================
 * SHOP ROUTES - Rotas da Loja
 * ============================================
 * 
 * Rotas protegidas da API da loja
 * Requer autenticação via authMiddleware
 * Rate limiting aplicado para proteção
 * 
 * @created 02 de dezembro de 2025
 */

import { Hono } from 'hono';
import * as shopController from '../controllers/shop.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { rateLimit } from '../middlewares/rate-limit.middleware.js';

const shopRoutes = new Hono();

// Todas as rotas requerem autenticação
shopRoutes.use('*', authMiddleware);

// ============================================
// RATE LIMITERS ESPECÍFICOS
// ============================================

/**
 * Rate limiter para visualização de itens
 * Mais permissivo: 50 requests a cada 10 segundos
 */
const shopViewLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 segundos
  max: 50, // 50 requests
  message: 'Muitas requisições. Aguarde alguns segundos.',
  keyGenerator: (c) => {
    const userId = c.get('user')?.userId || 'anonymous';
    return `shop-view:${userId}`;
  },
});

/**
 * Rate limiter para compras
 * Mais restritivo: 10 compras por minuto
 */
const shopPurchaseLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 compras
  message: 'Limite de compras excedido. Aguarde 1 minuto.',
  keyGenerator: (c) => {
    const userId = c.get('user')?.userId || 'anonymous';
    return `shop-purchase:${userId}`;
  },
});

/**
 * Rate limiter para uso de itens
 * Moderado: 30 usos por minuto
 */
const shopUseLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 usos
  message: 'Limite de ações excedido. Aguarde 1 minuto.',
  keyGenerator: (c) => {
    const userId = c.get('user')?.userId || 'anonymous';
    return `shop-use:${userId}`;
  },
});

// ============================================
// ROTAS - VISUALIZAÇÃO (rate limit permissivo)
// ============================================

/**
 * GET /shop/items
 * Lista itens da loja com filtros
 * Query: type, rarity, search, isFeatured, limit, offset
 */
shopRoutes.get('/items', shopViewLimiter, shopController.getItems);

/**
 * GET /shop/items/:sku
 * Busca item específico por SKU
 */
shopRoutes.get('/items/:sku', shopViewLimiter, shopController.getItem);

// ============================================
// ROTAS - COMPRAS (rate limit restritivo)
// ============================================

/**
 * POST /shop/purchase
 * Compra item da loja
 * Body: { sku: string, quantity?: number }
 */
shopRoutes.post('/purchase', shopPurchaseLimiter, shopController.purchase);

// ============================================
// ROTAS - INVENTÁRIO (rate limit moderado)
// ============================================

/**
 * GET /shop/inventory
 * Lista inventário do usuário
 * Query: type, isEquipped
 */
shopRoutes.get('/inventory', shopController.getInventory);

/**
 * POST /shop/inventory/:id/use
 * Usa/equipa/desequipa item
 * Body: { action: 'use' | 'equip' | 'unequip' }
 */
shopRoutes.post('/inventory/:id/use', shopUseLimiter, shopController.useItem);

// ============================================
// ROTAS - BOOSTS
// ============================================

/**
 * GET /shop/boosts
 * Lista boosts ativos do usuário
 */
shopRoutes.get('/boosts', shopController.getActiveBoosts);

// ============================================
// ROTAS - ADMIN/ANALYTICS
// ============================================

/**
 * GET /shop/stats
 * Estatísticas de vendas (admin)
 * Query: startDate, endDate (ISO strings)
 */
shopRoutes.get('/stats', shopController.getSalesStats);

export default shopRoutes;
