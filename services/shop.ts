/**
 * ============================================
 * SHOP SERVICE - CAMADA DE SERVIÇO DA LOJA
 * ============================================
 * 
 * Cliente HTTP para interagir com a API da loja.
 * Gerencia compras, inventário e boosts.
 * 
 * @created 02 de dezembro de 2025
 */

import api from './api';

// ==========================================
// TIPOS E INTERFACES
// ==========================================

export enum ShopItemType {
  COSMETIC = 'COSMETIC',
  CONSUMABLE = 'CONSUMABLE',
  BOOST = 'BOOST',
  PACK = 'PACK',
}

export enum ShopItemRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export enum BoostType {
  XP_MULTIPLIER = 'XP_MULTIPLIER',
  COINS_MULTIPLIER = 'COINS_MULTIPLIER',
  DOUBLE_REWARDS = 'DOUBLE_REWARDS',
}

export interface ShopItemMetadata {
  boostType?: BoostType;
  multiplier?: number;
  durationHours?: number;
  slot?: string;
  visualEffect?: string;
  color?: string;
  items?: Array<{ sku: string; quantity: number }>;
}

export interface ShopItem {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  type: ShopItemType;
  category: string;
  rarity: ShopItemRarity;
  metadata: ShopItemMetadata;
  imageUrl: string | null;
  stock: number | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserInventoryItem {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  isEquipped: boolean;
  metadata: Record<string, any>;
  acquiredAt: string;
  lastUsedAt: string | null;
  item: ShopItem;
}

export interface ActiveBoost {
  id: string;
  userId: string;
  itemSku: string;
  type: BoostType;
  value: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  price: number;
  totalCost: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface PurchaseResponse {
  newBalance: number;
  inventoryEntry: UserInventoryItem;
  purchase: Purchase;
}

export interface ShopStats {
  totalPurchases: number;
  totalRevenue: number;
  topItems: Array<{
    itemId: string;
    _count: { id: number };
    _sum: { totalCost: number; quantity: number };
    item: ShopItem;
  }>;
}

// ==========================================
// FILTROS E PARÂMETROS
// ==========================================

export interface GetItemsParams {
  type?: ShopItemType;
  rarity?: ShopItemRarity;
  search?: string;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetInventoryParams {
  type?: ShopItemType;
  isEquipped?: boolean;
}

export interface PurchaseItemParams {
  sku: string;
  quantity?: number;
}

export interface UseItemParams {
  action: 'use' | 'equip' | 'unequip';
}

export interface GetStatsParams {
  startDate?: string;
  endDate?: string;
}

// ==========================================
// CONSTANTES
// ==========================================

export const RARITY_COLORS: Record<ShopItemRarity, string> = {
  [ShopItemRarity.COMMON]: '#9E9E9E',
  [ShopItemRarity.RARE]: '#2196F3',
  [ShopItemRarity.EPIC]: '#9C27B0',
  [ShopItemRarity.LEGENDARY]: '#FF9800',
};

export const RARITY_LABELS: Record<ShopItemRarity, string> = {
  [ShopItemRarity.COMMON]: 'Comum',
  [ShopItemRarity.RARE]: 'Raro',
  [ShopItemRarity.EPIC]: 'Épico',
  [ShopItemRarity.LEGENDARY]: 'Lendário',
};

export const TYPE_ICONS: Record<ShopItemType, string> = {
  [ShopItemType.COSMETIC]: '🎨',
  [ShopItemType.CONSUMABLE]: '💊',
  [ShopItemType.BOOST]: '⚡',
  [ShopItemType.PACK]: '📦',
};

export const TYPE_LABELS: Record<ShopItemType, string> = {
  [ShopItemType.COSMETIC]: 'Cosmético',
  [ShopItemType.CONSUMABLE]: 'Consumível',
  [ShopItemType.BOOST]: 'Boost',
  [ShopItemType.PACK]: 'Pacote',
};

// ==========================================
// SERVIÇO DA LOJA
// ==========================================

class ShopService {
  /**
   * Lista itens ativos da loja com filtros opcionais
   */
  async getItems(params?: GetItemsParams) {
    try {
      const response = await api.get('/shop/items', { params });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar itens da loja:', error);
      throw new Error(error.response?.data?.error || 'Erro ao carregar loja');
    }
  }

  /**
   * Busca item específico por SKU
   */
  async getItem(sku: string) {
    try {
      const response = await api.get(`/shop/items/${sku}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar item:', error);
      throw new Error(error.response?.data?.error || 'Item não encontrado');
    }
  }

  /**
   * Compra item da loja (transação atômica)
   */
  async purchaseItem(params: PurchaseItemParams): Promise<PurchaseResponse> {
    try {
      const response = await api.post('/shop/purchase', params);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao comprar item:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao realizar compra';
      throw new Error(errorMessage);
    }
  }

  /**
   * Lista inventário do usuário com filtros opcionais
   */
  async getInventory(params?: GetInventoryParams) {
    try {
      const response = await api.get('/shop/inventory', { params });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar inventário:', error);
      throw new Error(error.response?.data?.error || 'Erro ao carregar inventário');
    }
  }

  /**
   * Usa/equipa/desequipa item do inventário
   */
  async useItem(inventoryId: string, params: UseItemParams) {
    try {
      const response = await api.post(`/shop/inventory/${inventoryId}/use`, params);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao usar item:', error);
      throw new Error(error.response?.data?.error || 'Erro ao usar item');
    }
  }

  /**
   * Lista boosts ativos do usuário
   */
  async getActiveBoosts(): Promise<{ data: ActiveBoost[]; meta: { count: number } }> {
    try {
      const response = await api.get('/shop/boosts');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar boosts ativos:', error);
      throw new Error(error.response?.data?.error || 'Erro ao carregar boosts');
    }
  }

  /**
   * Estatísticas de vendas (admin/analytics)
   */
  async getStats(params?: GetStatsParams): Promise<{ data: ShopStats }> {
    try {
      const response = await api.get('/shop/stats', { params });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas:', error);
      throw new Error(error.response?.data?.error || 'Erro ao carregar estatísticas');
    }
  }

  // ==========================================
  // MÉTODOS AUXILIARES
  // ==========================================

  /**
   * Verifica se usuário tem saldo suficiente para compra
   */
  canAfford(userCoins: number, itemPrice: number, quantity: number = 1): boolean {
    return userCoins >= itemPrice * quantity;
  }

  /**
   * Calcula custo total de uma compra
   */
  calculateTotalCost(itemPrice: number, quantity: number = 1): number {
    return itemPrice * quantity;
  }

  /**
   * Formata tempo restante de um boost
   */
  getBoostTimeRemaining(expiresAt: string): string {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();

    if (diffMs <= 0) return 'Expirado';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 24) {
      const days = Math.floor(diffHours / 24);
      return `${days}d ${diffHours % 24}h`;
    }
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  }

  /**
   * Verifica se um boost está ativo
   */
  isBoostActive(expiresAt: string): boolean {
    return new Date(expiresAt) > new Date();
  }

  /**
   * Filtra itens por tipo
   */
  filterByType(items: ShopItem[], type: ShopItemType): ShopItem[] {
    return items.filter(item => item.type === type);
  }

  /**
   * Filtra itens por raridade
   */
  filterByRarity(items: ShopItem[], rarity: ShopItemRarity): ShopItem[] {
    return items.filter(item => item.rarity === rarity);
  }

  /**
   * Ordena itens por preço (crescente ou decrescente)
   */
  sortByPrice(items: ShopItem[], ascending: boolean = true): ShopItem[] {
    return [...items].sort((a, b) => 
      ascending ? a.price - b.price : b.price - a.price
    );
  }

  /**
   * Ordena itens por raridade (comum -> lendário)
   */
  sortByRarity(items: ShopItem[]): ShopItem[] {
    const rarityOrder = {
      [ShopItemRarity.COMMON]: 1,
      [ShopItemRarity.RARE]: 2,
      [ShopItemRarity.EPIC]: 3,
      [ShopItemRarity.LEGENDARY]: 4,
    };
    return [...items].sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
  }

  /**
   * Busca itens por título ou descrição
   */
  searchItems(items: ShopItem[], query: string): ShopItem[] {
    const lowerQuery = query.toLowerCase();
    return items.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.sku.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Obtém cor da raridade
   */
  getRarityColor(rarity: ShopItemRarity): string {
    return RARITY_COLORS[rarity];
  }

  /**
   * Obtém label da raridade
   */
  getRarityLabel(rarity: ShopItemRarity): string {
    return RARITY_LABELS[rarity];
  }

  /**
   * Obtém ícone do tipo
   */
  getTypeIcon(type: ShopItemType): string {
    return TYPE_ICONS[type];
  }

  /**
   * Obtém label do tipo
   */
  getTypeLabel(type: ShopItemType): string {
    return TYPE_LABELS[type];
  }

  /**
   * Calcula multiplicador total de boosts ativos
   */
  calculateTotalMultiplier(boosts: ActiveBoost[], type: BoostType): number {
    const relevantBoosts = boosts.filter(
      boost => boost.type === type && this.isBoostActive(boost.expiresAt)
    );
    
    if (relevantBoosts.length === 0) return 1;

    // Multiplica todos os boosts ativos
    return relevantBoosts.reduce((total, boost) => total * boost.value, 1);
  }

  /**
   * Formata valor de boost como porcentagem
   */
  formatBoostValue(value: number): string {
    const percentage = (value - 1) * 100;
    return `+${percentage.toFixed(0)}%`;
  }
}

export default new ShopService();
