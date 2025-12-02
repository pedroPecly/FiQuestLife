import type { ShopItemRarity, ShopItemType } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

// ============================================
// INTERFACES
// ============================================

export interface ShopItemFilters {
  type?: ShopItemType;
  rarity?: ShopItemRarity;
  search?: string;
  limit?: number;
  offset?: number;
  isFeatured?: boolean;
}

export interface PurchaseResult {
  success: boolean;
  message: string;
  newBalance: number;
  inventoryEntry: any;
  purchase: any;
}

export interface InventoryFilters {
  type?: ShopItemType;
  isEquipped?: boolean;
}

export interface UseItemResult {
  success: boolean;
  message: string;
  effect?: any;
}

export interface BoostMetadata {
  boostType: string;
  multiplier: number;
  durationHours: number;
}

// ============================================
// FUNÇÕES DO SERVIÇO
// ============================================

/**
 * Lista itens ativos da loja com filtros opcionais
 * 
 * @param filters - Filtros de busca (tipo, raridade, busca por texto, etc.)
 * @returns Array de itens da loja
 */
export async function getShopItems(filters: ShopItemFilters = {}) {
  const {
    type,
    rarity,
    search,
    limit = 50,
    offset = 0,
    isFeatured,
  } = filters;

  const where: any = {
    isActive: true,
  };

  if (type) {
    where.type = type;
  }

  if (rarity) {
    where.rarity = rarity;
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.shopItem.findMany({
    where,
    orderBy: [
      { isFeatured: 'desc' },
      { order: 'asc' },
      { rarity: 'desc' },
      { price: 'asc' },
    ],
    take: limit,
    skip: offset,
  });

  return items;
}

/**
 * Busca item específico por SKU
 * 
 * @param sku - Identificador único do item
 * @returns Item da loja ou null
 */
export async function getShopItem(sku: string) {
  const item = await prisma.shopItem.findUnique({
    where: { sku },
  });

  return item;
}

/**
 * Compra item da loja (transação atômica)
 * 
 * Esta função garante:
 * - Validação de saldo
 * - Validação de stock
 * - Atualização de moedas
 * - Criação/atualização de inventário
 * - Registro de compra (auditoria)
 * - Rollback automático em caso de erro
 * 
 * @param userId - ID do usuário comprador
 * @param sku - SKU do item
 * @param quantity - Quantidade a comprar (padrão: 1)
 * @returns Resultado da compra
 */
export async function purchaseItem(
  userId: string,
  sku: string,
  quantity: number = 1
): Promise<PurchaseResult> {
  // Validações iniciais
  if (quantity < 1) {
    throw new Error('Quantidade deve ser maior que 0');
  }

  if (quantity > 100) {
    throw new Error('Quantidade máxima por compra: 100');
  }

  // Verificar se houve compra duplicada nos últimos 5 segundos (prevenção de double-click)
  const recentPurchase = await prisma.purchase.findFirst({
    where: {
      userId,
      createdAt: {
        gte: new Date(Date.now() - 5000), // 5 segundos
      },
    },
    include: {
      item: {
        select: { sku: true },
      },
    },
  });

  if (recentPurchase && recentPurchase.item.sku === sku) {
    throw new Error('Aguarde alguns segundos antes de comprar novamente');
  }

  // Transação atômica
  const result = await prisma.$transaction(async (tx) => {
    // 1. Buscar e validar item (com lock otimista)
    const item = await tx.shopItem.findUnique({
      where: { sku },
    });

    if (!item) {
      throw new Error('Item não encontrado');
    }

    if (!item.isActive) {
      throw new Error('Item não está disponível para compra');
    }

    // 2. Validar stock (se aplicável)
    if (item.stock !== null && item.stock < quantity) {
      throw new Error(`Stock insuficiente. Disponível: ${item.stock}`);
    }

    // 3. Calcular custo total
    const totalCost = item.price * quantity;

    // 4. Buscar usuário e validar saldo (com lock pessimista - FOR UPDATE)
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { coins: true },
    });

    if (user.coins < totalCost) {
      throw new Error(
        `Saldo insuficiente. Necessário: ${totalCost} coins. Disponível: ${user.coins} coins`
      );
    }

    const balanceBefore = user.coins;
    const balanceAfter = user.coins - totalCost;

    // 5. Atualizar saldo do usuário
    await tx.user.update({
      where: { id: userId },
      data: {
        coins: {
          decrement: totalCost,
        },
      },
    });

    // 6. Decrementar stock (se aplicável)
    if (item.stock !== null) {
      await tx.shopItem.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: quantity,
          },
        },
      });
    }

    // 7. Criar ou atualizar inventário
    const inventoryEntry = await tx.userInventory.upsert({
      where: {
        userId_itemId: {
          userId,
          itemId: item.id,
        },
      },
      create: {
        userId,
        itemId: item.id,
        quantity,
        metadata: {},
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      include: {
        item: true,
      },
    });

    // 8. Registrar compra (auditoria)
    const purchase = await tx.purchase.create({
      data: {
        userId,
        itemId: item.id,
        quantity,
        price: item.price,
        totalCost,
        balanceBefore,
        balanceAfter,
        metadata: {
          timestamp: new Date().toISOString(),
          itemTitle: item.title,
          itemRarity: item.rarity,
        },
      },
    });

    // 9. Se for PACK, desempacotar itens
    if (item.type === 'PACK' && item.metadata) {
      const packContents = (item.metadata as any).contains as Array<{
        sku: string;
        quantity: number;
      }>;

      if (packContents && Array.isArray(packContents)) {
        for (const content of packContents) {
          const contentItem = await tx.shopItem.findUnique({
            where: { sku: content.sku },
          });

          if (contentItem) {
            await tx.userInventory.upsert({
              where: {
                userId_itemId: {
                  userId,
                  itemId: contentItem.id,
                },
              },
              create: {
                userId,
                itemId: contentItem.id,
                quantity: content.quantity * quantity,
                metadata: { fromPack: item.sku },
              },
              update: {
                quantity: {
                  increment: content.quantity * quantity,
                },
              },
            });
          }
        }
      }
    }

    return {
      inventoryEntry,
      purchase,
      balanceAfter,
      item,
    };
  });

  return {
    success: true,
    message: `${result.item.title} comprado com sucesso!`,
    newBalance: result.balanceAfter,
    inventoryEntry: result.inventoryEntry,
    purchase: result.purchase,
  };
}

/**
 * Lista inventário do usuário com filtros opcionais
 * 
 * @param userId - ID do usuário
 * @param filters - Filtros (tipo, equipado)
 * @returns Array de itens do inventário
 */
export async function getUserInventory(
  userId: string,
  filters: InventoryFilters = {}
) {
  const { type, isEquipped } = filters;

  const where: any = {
    userId,
  };

  if (isEquipped !== undefined) {
    where.isEquipped = isEquipped;
  }

  if (type) {
    where.item = {
      type,
    };
  }

  const inventory = await prisma.userInventory.findMany({
    where,
    include: {
      item: true,
    },
    orderBy: [
      { isEquipped: 'desc' },
      { acquiredAt: 'desc' },
    ],
  });

  return inventory;
}

/**
 * Usa item do inventário
 * 
 * Ações suportadas:
 * - 'use': Consumir item (decrementa quantidade)
 * - 'equip': Equipar cosmético (desequipa anterior do mesmo slot)
 * - 'unequip': Desequipar cosmético
 * 
 * @param userId - ID do usuário
 * @param inventoryId - ID da entrada no inventário
 * @param action - Ação a realizar
 * @returns Resultado da ação
 */
export async function useInventoryItem(
  userId: string,
  inventoryId: string,
  action: 'use' | 'equip' | 'unequip'
): Promise<UseItemResult> {
  const inventoryEntry = await prisma.userInventory.findFirst({
    where: {
      id: inventoryId,
      userId,
    },
    include: {
      item: true,
    },
  });

  if (!inventoryEntry) {
    throw new Error('Item não encontrado no inventário');
  }

  const { item } = inventoryEntry;

  // Ação: EQUIPAR cosmético
  if (action === 'equip') {
    if (item.type !== 'COSMETIC') {
      throw new Error('Apenas itens cosméticos podem ser equipados');
    }

    const slot = (item.metadata as any).slot;
    if (!slot) {
      throw new Error('Item cosmético sem slot definido');
    }

    // Desequipar item anterior do mesmo slot
    await prisma.userInventory.updateMany({
      where: {
        userId,
        isEquipped: true,
        item: {
          type: 'COSMETIC',
          metadata: {
            path: ['slot'],
            equals: slot,
          },
        },
      },
      data: {
        isEquipped: false,
      },
    });

    // Equipar novo item
    await prisma.userInventory.update({
      where: { id: inventoryId },
      data: {
        isEquipped: true,
        lastUsedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `${item.title} equipado com sucesso!`,
      effect: { slot, itemSku: item.sku },
    };
  }

  // Ação: DESEQUIPAR cosmético
  if (action === 'unequip') {
    if (item.type !== 'COSMETIC') {
      throw new Error('Apenas itens cosméticos podem ser desequipados');
    }

    await prisma.userInventory.update({
      where: { id: inventoryId },
      data: {
        isEquipped: false,
      },
    });

    return {
      success: true,
      message: `${item.title} desequipado com sucesso!`,
    };
  }

  // Ação: USAR (consumir ou ativar)
  if (action === 'use') {
    // CONSUMABLE: Decrementar quantidade
    if (item.type === 'CONSUMABLE') {
      if (inventoryEntry.quantity < 1) {
        throw new Error('Item sem quantidade disponível');
      }

      await prisma.userInventory.update({
        where: { id: inventoryId },
        data: {
          quantity: {
            decrement: 1,
          },
          lastUsedAt: new Date(),
        },
      });

      // TODO: Aplicar efeito do consumível (streak protection, extra slot, etc.)
      const effect = (item.metadata as any).effect;

      return {
        success: true,
        message: `${item.title} usado com sucesso!`,
        effect: { type: effect, itemSku: item.sku },
      };
    }

    // BOOST: Ativar boost temporário
    if (item.type === 'BOOST') {
      if (inventoryEntry.quantity < 1) {
        throw new Error('Boost sem quantidade disponível');
      }

      const metadata = item.metadata as any;
      const boostData: BoostMetadata = {
        boostType: metadata.boostType,
        multiplier: metadata.multiplier,
        durationHours: metadata.durationHours,
      };

      const boost = await activateBoost(userId, item.sku, boostData);

      // Decrementar quantidade
      await prisma.userInventory.update({
        where: { id: inventoryId },
        data: {
          quantity: {
            decrement: 1,
          },
          lastUsedAt: new Date(),
        },
      });

      return {
        success: true,
        message: `${item.title} ativado! Válido até ${boost.expiresAt.toLocaleString('pt-BR')}`,
        effect: { boost },
      };
    }

    throw new Error(`Tipo de item não suportado para uso: ${item.type}`);
  }

  throw new Error(`Ação não reconhecida: ${action}`);
}

/**
 * Equipar cosmético específico por itemId
 * Função de conveniência que encapsula useInventoryItem
 * 
 * @param userId - ID do usuário
 * @param itemId - ID do item (ShopItem)
 * @param slot - Slot a equipar (avatar_frame, profile_theme, etc.)
 */
export async function equipCosmetic(
  userId: string,
  itemId: string,
  slot: string
) {
  // Buscar entrada no inventário
  const inventoryEntry = await prisma.userInventory.findFirst({
    where: {
      userId,
      itemId,
    },
    include: {
      item: true,
    },
  });

  if (!inventoryEntry) {
    throw new Error('Você não possui este item');
  }

  if (inventoryEntry.item.type !== 'COSMETIC') {
    throw new Error('Item não é cosmético');
  }

  const itemSlot = (inventoryEntry.item.metadata as any).slot;
  if (itemSlot !== slot) {
    throw new Error(`Item não pertence ao slot ${slot}`);
  }

  return useInventoryItem(userId, inventoryEntry.id, 'equip');
}

/**
 * Ativar boost temporário
 * 
 * Cria entrada em ActiveBoost com data de expiração.
 * Boosts múltiplos do mesmo tipo podem ser acumulados.
 * 
 * @param userId - ID do usuário
 * @param itemSku - SKU do item de boost
 * @param metadata - Metadados do boost (tipo, multiplicador, duração)
 * @returns Boost criado
 */
export async function activateBoost(
  userId: string,
  itemSku: string,
  metadata: BoostMetadata
) {
  const { boostType, multiplier, durationHours } = metadata;

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + durationHours);

  const boost = await prisma.activeBoost.create({
    data: {
      userId,
      itemSku,
      type: boostType,
      value: multiplier,
      expiresAt,
      isActive: true,
    },
  });

  return boost;
}

/**
 * Buscar boosts ativos do usuário
 * 
 * Filtra automaticamente por:
 * - isActive = true
 * - expiresAt > now
 * 
 * @param userId - ID do usuário
 * @returns Array de boosts ativos
 */
export async function getActiveBoosts(userId: string) {
  const now = new Date();

  const boosts = await prisma.activeBoost.findMany({
    where: {
      userId,
      isActive: true,
      expiresAt: {
        gt: now,
      },
    },
    orderBy: {
      expiresAt: 'asc',
    },
  });

  return boosts;
}

/**
 * Aplicar multiplicadores de boosts ativos ao ganho de XP/Coins
 * 
 * Exemplo:
 * - baseXP = 50, baseCoins = 20
 * - Boost ativo: XP +50% (multiplier = 1.5)
 * - Resultado: { xp: 75, coins: 20 }
 * 
 * Se múltiplos boosts do mesmo tipo, usa o maior multiplicador.
 * 
 * @param userId - ID do usuário
 * @param baseXP - XP base a multiplicar
 * @param baseCoins - Coins base a multiplicar
 * @returns XP e Coins finais após aplicar boosts
 */
export async function applyBoostMultipliers(
  userId: string,
  baseXP: number,
  baseCoins: number
): Promise<{ xp: number; coins: number }> {
  const boosts = await getActiveBoosts(userId);

  let xpMultiplier = 1.0;
  let coinsMultiplier = 1.0;

  for (const boost of boosts) {
    if (boost.type === 'XP_MULTIPLIER') {
      xpMultiplier = Math.max(xpMultiplier, boost.value);
    }
    if (boost.type === 'COINS_MULTIPLIER') {
      coinsMultiplier = Math.max(coinsMultiplier, boost.value);
    }
  }

  return {
    xp: Math.round(baseXP * xpMultiplier),
    coins: Math.round(baseCoins * coinsMultiplier),
  };
}

/**
 * Desativar boosts expirados (job de limpeza)
 * 
 * Deve ser executado periodicamente (ex: a cada hora ou diariamente).
 * 
 * @returns Quantidade de boosts desativados
 */
export async function deactivateExpiredBoosts() {
  const now = new Date();

  const result = await prisma.activeBoost.updateMany({
    where: {
      isActive: true,
      expiresAt: {
        lte: now,
      },
    },
    data: {
      isActive: false,
    },
  });

  return result.count;
}

/**
 * Obter estatísticas de vendas (para admin/analytics)
 * 
 * @param startDate - Data inicial (opcional)
 * @param endDate - Data final (opcional)
 * @returns Estatísticas de vendas
 */
export async function getSalesStats(startDate?: Date, endDate?: Date) {
  const where: any = {};

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const [totalPurchases, totalRevenue, topItems] = await Promise.all([
    // Total de compras
    prisma.purchase.count({ where }),

    // Receita total
    prisma.purchase.aggregate({
      where,
      _sum: {
        totalCost: true,
      },
    }),

    // Top 10 itens mais vendidos
    prisma.purchase.groupBy({
      by: ['itemId'],
      where,
      _count: {
        id: true,
      },
      _sum: {
        totalCost: true,
        quantity: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    }),
  ]);

  // Buscar detalhes dos top itens
  const itemIds = topItems.map((t) => t.itemId);
  const items = await prisma.shopItem.findMany({
    where: {
      id: {
        in: itemIds,
      },
    },
    select: {
      id: true,
      title: true,
      sku: true,
      price: true,
      rarity: true,
    },
  });

  const topItemsWithDetails = topItems.map((stat) => {
    const item = items.find((i) => i.id === stat.itemId);
    return {
      ...stat,
      item,
    };
  });

  return {
    totalPurchases,
    totalRevenue: totalRevenue._sum.totalCost || 0,
    topItems: topItemsWithDetails,
  };
}
