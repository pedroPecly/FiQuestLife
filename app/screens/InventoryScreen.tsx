/**
 * ============================================
 * INVENTORY SCREEN - TELA DO INVENTÁRIO
 * ============================================
 * 
 * Tela do inventário do usuário com:
 * - Lista de itens possuídos
 * - Filtros por tipo
 * - Separação entre equipados/não equipados
 * - Boosts ativos em destaque
 * - Ações de usar/equipar itens
 * 
 * @created 02 de dezembro de 2025
 */

import InventoryItemCard from '@/components/ui/InventoryItemCard';
import { authService } from '@/services/api';
import shopService, {
    ActiveBoost,
    ShopItemType,
    UserInventoryItem,
} from '@/services/shop';
import type { User } from '@/types/user';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Keyboard,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

// Arrays explícitos para garantir que os filtros funcionem
const INVENTORY_TYPES = [
  { value: ShopItemType.COSMETIC, icon: '🎨', label: 'Cosmético' },
  { value: ShopItemType.CONSUMABLE, icon: '💊', label: 'Consumível' },
  { value: ShopItemType.BOOST, icon: '⚡', label: 'Boost' },
  { value: ShopItemType.PACK, icon: '📦', label: 'Pacote' },
];

export default function InventoryScreen() {
  const [user, setUser] = useState<User | null>(null);

  const [inventory, setInventory] = useState<UserInventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<UserInventoryItem[]>([]);
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtros
  const [selectedType, setSelectedType] = useState<ShopItemType | null>(null);
  const [showOnlyEquipped, setShowOnlyEquipped] = useState(false);

  // Carregar dados do usuário
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getMe();
      if (userData.success && userData.data) {
        setUser(userData.data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  }, []);

  // Carregar inventário e boosts
  const loadData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      const [inventoryResponse, boostsResponse] = await Promise.all([
        shopService.getInventory(),
        shopService.getActiveBoosts(),
      ]);

      // Validações de resposta
      if (!inventoryResponse?.data || !Array.isArray(inventoryResponse.data)) {
        throw new Error('Resposta inválida do servidor');
      }
      if (!boostsResponse?.data || !Array.isArray(boostsResponse.data)) {
        throw new Error('Dados de boosts inválidos');
      }

      setInventory(inventoryResponse.data);
      setActiveBoosts(boostsResponse.data);
      applyFilters(inventoryResponse.data);
    } catch (error: any) {
      console.error('Erro ao carregar inventário:', error);
      
      // Retry automático em caso de erro de rede (max 2 tentativas)
      if (retryCount < 2 && error.message?.includes('Network')) {
        setTimeout(() => loadData(retryCount + 1), 2000);
        return;
      }
      
      Alert.alert(
        'Erro ao carregar inventário',
        error.message || 'Não foi possível carregar seus itens. Tente novamente.',
        [{ text: 'Tentar novamente', onPress: () => loadData(0) }, { text: 'Cancelar' }]
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    loadData();
  }, []); // Removido refreshUser e loadData das dependências

  // Aplicar filtros
  const applyFilters = useCallback(
    (inventoryList: UserInventoryItem[]) => {
      let filtered = [...inventoryList];

      // Filtro por tipo
      if (selectedType) {
        filtered = filtered.filter((inv) => inv.item.type === selectedType);
      }

      // Filtro por equipados
      if (showOnlyEquipped) {
        filtered = filtered.filter((inv) => inv.isEquipped);
      }

      setFilteredInventory(filtered);
    },
    [selectedType, showOnlyEquipped]
  );

  useEffect(() => {
    applyFilters(inventory);
  }, [inventory, selectedType, showOnlyEquipped, applyFilters]);

  // Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), refreshUser()]);
    setRefreshing(false);
  };

  // Usar/equipar item
  const handleUseItem = async (inventoryId: string, action: 'use' | 'equip' | 'unequip') => {
    // Validações de segurança
    if (!inventoryId || typeof inventoryId !== 'string') {
      Alert.alert('Erro', 'ID de item inválido');
      return;
    }

    const validActions = ['use', 'equip', 'unequip'];
    if (!validActions.includes(action)) {
      Alert.alert('Erro', 'Ação inválida');
      return;
    }

    try {
      await shopService.useItem(inventoryId, { action });
      // Atualizar dados sem alert
      await loadData();
    } catch (error: any) {
      throw error; // Card irá tratar
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setSelectedType(null);
    setShowOnlyEquipped(false);
  };

  const hasActiveFilters = selectedType || showOnlyEquipped;

  // Calcular multiplicadores totais
  const xpMultiplier = shopService.calculateTotalMultiplier(activeBoosts, 'XP_MULTIPLIER' as any);
  const coinsMultiplier = shopService.calculateTotalMultiplier(activeBoosts, 'COINS_MULTIPLIER' as any);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventário</Text>
          <Text style={styles.headerSubtitle}>
            {filteredInventory.length} {filteredInventory.length === 1 ? 'item' : 'itens'}
          </Text>
        </View>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinsValue}>{user?.coins || 0}</Text>
        </View>
      </View>

      {/* Boosts ativos */}
      {activeBoosts.length > 0 && (
        <View style={styles.boostsContainer}>
          <Text style={styles.boostsTitle}>⚡ Boosts Ativos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.boostsList}
          >
            {activeBoosts.map((boost) => (
              <View key={boost.id} style={styles.boostCard}>
                <Text style={styles.boostValue}>
                  {shopService.formatBoostValue(boost.value)}
                </Text>
                <Text style={styles.boostType}>
                  {boost.type === 'XP_MULTIPLIER' ? 'XP' : 'Coins'}
                </Text>
                <Text style={styles.boostTime}>
                  {shopService.getBoostTimeRemaining(boost.expiresAt)}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Resumo de multiplicadores */}
          {(xpMultiplier > 1 || coinsMultiplier > 1) && (
            <View style={styles.multipliersSummary}>
              {xpMultiplier > 1 && (
                <Text style={styles.multiplierText}>
                  📈 XP: {shopService.formatBoostValue(xpMultiplier)}
                </Text>
              )}
              {coinsMultiplier > 1 && (
                <Text style={styles.multiplierText}>
                  💰 Coins: {shopService.formatBoostValue(coinsMultiplier)}
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Filtros por tipo */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterChip, !selectedType && styles.filterChipActive]}
          onPress={() => setSelectedType(null)}
        >
          <Text style={[styles.filterChipText, !selectedType && styles.filterChipTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        {INVENTORY_TYPES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.filterChip, selectedType === item.value && styles.filterChipActive]}
            onPress={() => setSelectedType(selectedType === item.value ? null : item.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedType === item.value && styles.filterChipTextActive,
              ]}
            >
              {item.icon} {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.filterChip, showOnlyEquipped && styles.filterChipActive]}
          onPress={() => setShowOnlyEquipped(!showOnlyEquipped)}
        >
          <Text
            style={[styles.filterChipText, showOnlyEquipped && styles.filterChipTextActive]}
          >
            ✓ Equipados
          </Text>
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>✕ Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de itens */}
      <FlatList
        data={filteredInventory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InventoryItemCard
            inventoryItem={item}
            activeBoosts={activeBoosts}
            onUse={handleUseItem}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Inventário vazio</Text>
            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? 'Nenhum item encontrado com os filtros aplicados'
                : 'Visite a loja para adquirir itens!'}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
                <Text style={styles.emptyButtonText}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  coinsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  boostsContainer: {
    backgroundColor: '#FFF',
    padding: 16,
  },
  boostsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  boostsList: {
    gap: 12,
  },
  boostCard: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  boostValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  boostType: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 4,
  },
  boostTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  multipliersSummary: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  multiplierText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    minWidth: 60,
    minHeight: 36,
    flexShrink: 0,
    marginRight: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#20B2AA',
    borderColor: '#20B2AA',
  },
  filterChipText: {
    fontSize: 14,
    color: '#1C1C1E',
    fontWeight: '600',
    textAlign: 'center',
    includeFontPadding: false,
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  clearFiltersButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FF5252',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyButton: {
    backgroundColor: '#20B2AA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
