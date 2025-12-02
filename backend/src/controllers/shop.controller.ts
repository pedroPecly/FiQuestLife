/**
 * ============================================
 * SHOP CONTROLLER - Controlador da Loja
 * ============================================
 * 
 * Endpoints da API da loja:
 * - GET /shop/items - Lista itens da loja
 * - GET /shop/items/:sku - Busca item específico
 * - POST /shop/purchase - Compra item
 * - GET /shop/inventory - Inventário do usuário
 * - POST /shop/inventory/:id/use - Usa/equipa item
 * - GET /shop/boosts - Boosts ativos do usuário
 * - GET /shop/stats - Estatísticas de vendas (admin)
 * 
 * @created 02 de dezembro de 2025
 */

import type { ShopItemRarity, ShopItemType } from '@prisma/client';
import type { Context } from 'hono';
import * as shopService from '../services/shop.service.js';

/**
 * GET /shop/items
 * Lista itens ativos da loja com filtros opcionais
 * 
 * Query params:
 * - type: ShopItemType (COSMETIC, CONSUMABLE, BOOST, PACK)
 * - rarity: ShopItemRarity (COMMON, RARE, EPIC, LEGENDARY)
 * - search: string (busca em título/descrição/sku)
 * - isFeatured: boolean (apenas itens em destaque)
 * - limit: number (padrão: 50)
 * - offset: number (padrão: 0)
 */
export const getItems = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Extrair query params
    const type = c.req.query('type') as ShopItemType | undefined;
    const rarity = c.req.query('rarity') as ShopItemRarity | undefined;
    const search = c.req.query('search');
    const isFeaturedStr = c.req.query('isFeatured');
    const limitStr = c.req.query('limit');
    const offsetStr = c.req.query('offset');

    // Converter para tipos corretos
    const isFeatured = isFeaturedStr === 'true' ? true : isFeaturedStr === 'false' ? false : undefined;
    const limit = limitStr ? parseInt(limitStr, 10) : 50;
    const offset = offsetStr ? parseInt(offsetStr, 10) : 0;

    // Validações
    if (limit > 100) {
      return c.json({ error: 'Limite máximo: 100 itens por página' }, 400);
    }

    if (offset < 0 || limit < 1) {
      return c.json({ error: 'Parâmetros inválidos' }, 400);
    }

    const filters = {
      type,
      rarity,
      search,
      isFeatured,
      limit,
      offset,
    };

    const items = await shopService.getShopItems(filters);

    return c.json({
      success: true,
      data: items,
      meta: {
        count: items.length,
        limit,
        offset,
        filters: {
          type: type || null,
          rarity: rarity || null,
          search: search || null,
          isFeatured: isFeatured ?? null,
        },
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar itens da loja:', error);
    return c.json(
      {
        error: 'Erro ao buscar itens da loja',
        message: error.message,
      },
      500
    );
  }
};

/**
 * GET /shop/items/:sku
 * Busca item específico por SKU
 */
export const getItem = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sku = c.req.param('sku');

    if (!sku) {
      return c.json({ error: 'SKU não fornecido' }, 400);
    }

    const item = await shopService.getShopItem(sku);

    if (!item) {
      return c.json({ error: 'Item não encontrado' }, 404);
    }

    return c.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    console.error('Erro ao buscar item:', error);
    return c.json(
      {
        error: 'Erro ao buscar item',
        message: error.message,
      },
      500
    );
  }
};

/**
 * POST /shop/purchase
 * Compra item da loja
 * 
 * Body:
 * - sku: string (identificador do item)
 * - quantity: number (opcional, padrão: 1)
 */
export const purchase = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { sku, quantity = 1 } = body;

    // Validações
    if (!sku || typeof sku !== 'string') {
      return c.json({ error: 'SKU inválido' }, 400);
    }

    if (typeof quantity !== 'number' || quantity < 1 || quantity > 100) {
      return c.json({ error: 'Quantidade deve ser entre 1 e 100' }, 400);
    }

    // Executar compra
    const result = await shopService.purchaseItem(user.userId, sku, quantity);

    return c.json({
      success: true,
      message: result.message,
      data: {
        newBalance: result.newBalance,
        inventoryEntry: result.inventoryEntry,
        purchase: result.purchase,
      },
    });
  } catch (error: any) {
    console.error('Erro ao comprar item:', error);

    // Erros esperados (saldo insuficiente, etc.)
    if (
      error.message.includes('Saldo insuficiente') ||
      error.message.includes('Item não encontrado') ||
      error.message.includes('não está disponível') ||
      error.message.includes('Stock insuficiente') ||
      error.message.includes('Aguarde alguns segundos')
    ) {
      return c.json(
        {
          error: error.message,
        },
        400
      );
    }

    // Erro genérico
    return c.json(
      {
        error: 'Erro ao processar compra',
        message: error.message,
      },
      500
    );
  }
};

/**
 * GET /shop/inventory
 * Lista inventário do usuário
 * 
 * Query params:
 * - type: ShopItemType (filtro por tipo)
 * - isEquipped: boolean (apenas equipados ou não equipados)
 */
export const getInventory = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const type = c.req.query('type') as ShopItemType | undefined;
    const isEquippedStr = c.req.query('isEquipped');

    const isEquipped = isEquippedStr === 'true' ? true : isEquippedStr === 'false' ? false : undefined;

    const filters = {
      type,
      isEquipped,
    };

    const inventory = await shopService.getUserInventory(user.userId, filters);

    return c.json({
      success: true,
      data: inventory,
      meta: {
        count: inventory.length,
        filters: {
          type: type || null,
          isEquipped: isEquipped ?? null,
        },
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar inventário:', error);
    return c.json(
      {
        error: 'Erro ao buscar inventário',
        message: error.message,
      },
      500
    );
  }
};

/**
 * POST /shop/inventory/:id/use
 * Usa/equipa/desequipa item do inventário
 * 
 * Body:
 * - action: 'use' | 'equip' | 'unequip'
 */
export const useItem = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const inventoryId = c.req.param('id');
    const body = await c.req.json();
    const { action } = body;

    // Validações
    if (!inventoryId) {
      return c.json({ error: 'ID do inventário não fornecido' }, 400);
    }

    if (!action || !['use', 'equip', 'unequip'].includes(action)) {
      return c.json({ error: 'Ação inválida. Use: use, equip ou unequip' }, 400);
    }

    const result = await shopService.useInventoryItem(user.userId, inventoryId, action);

    return c.json({
      success: true,
      message: result.message,
      data: result.effect || null,
    });
  } catch (error: any) {
    console.error('Erro ao usar item:', error);

    // Erros esperados
    if (
      error.message.includes('não encontrado') ||
      error.message.includes('não podem ser') ||
      error.message.includes('sem quantidade') ||
      error.message.includes('sem slot')
    ) {
      return c.json(
        {
          error: error.message,
        },
        400
      );
    }

    return c.json(
      {
        error: 'Erro ao usar item',
        message: error.message,
      },
      500
    );
  }
};

/**
 * GET /shop/boosts
 * Lista boosts ativos do usuário
 */
export const getActiveBoosts = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const boosts = await shopService.getActiveBoosts(user.userId);

    return c.json({
      success: true,
      data: boosts,
      meta: {
        count: boosts.length,
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar boosts ativos:', error);
    return c.json(
      {
        error: 'Erro ao buscar boosts ativos',
        message: error.message,
      },
      500
    );
  }
};

/**
 * GET /shop/stats
 * Estatísticas de vendas (somente admin)
 * 
 * Query params:
 * - startDate: ISO date string
 * - endDate: ISO date string
 */
export const getSalesStats = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Verificar se usuário é admin
    // Por enquanto, permitir para todos (remover em produção)

    const startDateStr = c.req.query('startDate');
    const endDateStr = c.req.query('endDate');

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startDateStr) {
      startDate = new Date(startDateStr);
      if (isNaN(startDate.getTime())) {
        return c.json({ error: 'Data inicial inválida' }, 400);
      }
    }

    if (endDateStr) {
      endDate = new Date(endDateStr);
      if (isNaN(endDate.getTime())) {
        return c.json({ error: 'Data final inválida' }, 400);
      }
    }

    const stats = await shopService.getSalesStats(startDate, endDate);

    return c.json({
      success: true,
      data: stats,
      meta: {
        period: {
          startDate: startDateStr || null,
          endDate: endDateStr || null,
        },
      },
    });
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    return c.json(
      {
        error: 'Erro ao buscar estatísticas',
        message: error.message,
      },
      500
    );
  }
};
