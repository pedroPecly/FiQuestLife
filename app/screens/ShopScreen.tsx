/**
 * ============================================
 * SHOP SCREEN - TELA DA LOJA
 * ============================================
 * 
 * Tela principal da loja com:
 * - Lista de itens disponíveis
 * - Filtros por tipo e raridade
 * - Busca por nome
 * - Exibição de saldo do usuário
 * - Modal de compra
 * - Refresh para recarregar
 * 
 * @created 02 de dezembro de 2025
 */

import ShopItemCard from '@/components/ui/ShopItemCard';
import ShopPurchaseModal from '@/components/ui/ShopPurchaseModal';
import { authService } from '@/services/api';
import shopService, { ShopItem, ShopItemRarity, ShopItemType } from '@/services/shop';
import type { User } from '@/types/user';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Keyboard,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

// Arrays explícitos para garantir que os filtros funcionem
const SHOP_TYPES = [
  { value: ShopItemType.COSMETIC, icon: '🎨', label: 'Cosmético' },
  { value: ShopItemType.CONSUMABLE, icon: '💊', label: 'Consumível' },
  { value: ShopItemType.BOOST, icon: '⚡', label: 'Boost' },
  { value: ShopItemType.PACK, icon: '📦', label: 'Pacote' },
];

const SHOP_RARITIES = [
  { value: ShopItemRarity.COMMON, label: 'Comum', color: '#9E9E9E' },
  { value: ShopItemRarity.RARE, label: 'Raro', color: '#2196F3' },
  { value: ShopItemRarity.EPIC, label: 'Épico', color: '#9C27B0' },
  { value: ShopItemRarity.LEGENDARY, label: 'Lendário', color: '#FF9800' },
];

export default function ShopScreen() {
  const [user, setUser] = useState<User | null>(null);

  const [items, setItems] = useState<ShopItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtros
  const [selectedType, setSelectedType] = useState<ShopItemType | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<ShopItemRarity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sanitizar entrada de busca
  const sanitizeSearch = (text: string): string => {
    return text.trim().slice(0, 100); // Limite de 100 caracteres
  };

  // Modal de compra
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  // Carregar itens da loja
  const loadItems = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      const response = await shopService.getItems();
      
      // Validação da resposta
      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error('Resposta inválida do servidor');
      }

      // Ordenar por preço (mais barato primeiro)
      const sortedItems = response.data.sort((a: ShopItem, b: ShopItem) => a.price - b.price);
      setItems(sortedItems);
      applyFilters(sortedItems);
    } catch (error: any) {
      console.error('Erro ao carregar itens da loja:', error);
      
      // Retry automático em caso de erro de rede (max 2 tentativas)
      if (retryCount < 2 && error.message?.includes('Network')) {
        setTimeout(() => loadItems(retryCount + 1), 2000);
        return;
      }
      
      Alert.alert(
        'Erro ao carregar loja',
        error.message || 'Não foi possível carregar os itens. Tente novamente.',
        [{ text: 'Tentar novamente', onPress: () => loadItems(0) }, { text: 'Cancelar' }]
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    loadItems();
  }, []); // Removido refreshUser e loadItems das dependências

  // Aplicar filtros
  const applyFilters = useCallback(
    (itemsList: ShopItem[]) => {
      let filtered = [...itemsList];

      // Filtro por tipo
      if (selectedType) {
        filtered = shopService.filterByType(filtered, selectedType);
      }

      // Filtro por raridade
      if (selectedRarity) {
        filtered = shopService.filterByRarity(filtered, selectedRarity);
      }

      // Busca por texto
      if (searchQuery.trim()) {
        filtered = shopService.searchItems(filtered, searchQuery);
      }

      setFilteredItems(filtered);
    },
    [selectedType, selectedRarity, searchQuery]
  );

  useEffect(() => {
    applyFilters(items);
  }, [items, selectedType, selectedRarity, searchQuery, applyFilters]);

  // Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadItems(), refreshUser()]);
    setRefreshing(false);
  };

  // Abrir modal de compra
  const handleItemPress = (item: ShopItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Confirmar compra
  const handlePurchase = async (sku: string, quantity: number) => {
    // Validações de segurança
    if (!sku || typeof sku !== 'string' || sku.length > 50) {
      Alert.alert('Erro', 'SKU inválido');
      return;
    }

    if (!quantity || quantity < 1 || quantity > 99) {
      Alert.alert('Erro', 'Quantidade inválida (1-99)');
      return;
    }

    if (!selectedItem || !user) {
      Alert.alert('Erro', 'Dados inválidos');
      return;
    }

    const totalCost = selectedItem.price * quantity;
    if (user.coins < totalCost) {
      Alert.alert('Saldo insuficiente', `Você precisa de ${totalCost} moedas`);
      return;
    }

    try {
      await shopService.purchaseItem({ sku, quantity });
      // Atualizar dados sem alert
      await Promise.all([refreshUser(), loadItems()]);
      setModalVisible(false);
    } catch (error: any) {
      throw error; // Modal irá tratar
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setSelectedType(null);
    setSelectedRarity(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedType || selectedRarity || searchQuery.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
      {/* Header com saldo */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Loja</Text>
          <Text style={styles.headerSubtitle}>
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'} disponíveis
          </Text>
        </View>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinsValue}>{user?.coins || 0}</Text>
        </View>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar itens..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(sanitizeSearch(text))}
          maxLength={100}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessible={true}
          accessibilityLabel="Campo de busca de itens"
          accessibilityHint="Digite para buscar itens na loja"
        />
      </View>

      {/* Filtros de tipo */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterChip, !selectedType && styles.filterChipActive]}
          onPress={() => setSelectedType(null)}
        >
          <Text style={[styles.filterChipText, !selectedType && styles.filterChipTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedType === ShopItemType.COSMETIC && styles.filterChipActive,
          ]}
          onPress={() => setSelectedType(selectedType === ShopItemType.COSMETIC ? null : ShopItemType.COSMETIC)}
          accessible={true}
          accessibilityLabel="Filtrar itens cosméticos"
          accessibilityRole="button"
          accessibilityState={{ selected: selectedType === ShopItemType.COSMETIC }}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedType === ShopItemType.COSMETIC && styles.filterChipTextActive,
            ]}
          >
            🎨 Cosmético
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedType === ShopItemType.CONSUMABLE && styles.filterChipActive,
          ]}
          onPress={() => setSelectedType(selectedType === ShopItemType.CONSUMABLE ? null : ShopItemType.CONSUMABLE)}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedType === ShopItemType.CONSUMABLE && styles.filterChipTextActive,
            ]}
          >
            💊 Consumível
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedType === ShopItemType.BOOST && styles.filterChipActive,
          ]}
          onPress={() => setSelectedType(selectedType === ShopItemType.BOOST ? null : ShopItemType.BOOST)}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedType === ShopItemType.BOOST && styles.filterChipTextActive,
            ]}
          >
            ⚡ Boost
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedType === ShopItemType.PACK && styles.filterChipActive,
          ]}
          onPress={() => setSelectedType(selectedType === ShopItemType.PACK ? null : ShopItemType.PACK)}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedType === ShopItemType.PACK && styles.filterChipTextActive,
            ]}
          >
            📦 Pacote
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filtros por raridade */}
      <View style={styles.filtersContainer}>
        {SHOP_RARITIES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.filterChip,
              selectedRarity === item.value && styles.filterChipActive,
              { borderColor: item.color },
            ]}
            onPress={() => setSelectedRarity(selectedRarity === item.value ? null : item.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedRarity === item.value && styles.filterChipTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>✕ Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de itens */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShopItemCard item={item} onPress={handleItemPress} userCoins={user?.coins || 0} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Nenhum item encontrado</Text>
            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? 'Tente ajustar os filtros ou a busca'
                : 'A loja está vazia no momento'}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity style={styles.emptyButton} onPress={clearFilters}>
                <Text style={styles.emptyButtonText}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Modal de compra */}
      <ShopPurchaseModal
        visible={modalVisible}
        item={selectedItem}
        userCoins={user?.coins || 0}
        onClose={() => setModalVisible(false)}
        onConfirm={handlePurchase}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  searchInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
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
