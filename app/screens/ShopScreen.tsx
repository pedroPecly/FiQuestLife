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
import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated, Easing,
    FlatList,
    Keyboard,
    LayoutAnimation,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    UIManager,
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

  // Colapsar filtros para economizar espaço (padrão: recolhido)
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);

  // Habilitar LayoutAnimation no Android
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleFilters = (nextCollapsed: boolean) => {
    // On open we want the collapsed bar to disappear immediately to avoid overlap.
    // Use LayoutAnimation only when closing to animate layout changes smoothly.
    const openDuration = 320;
    const closeDuration = 260;
    if (!nextCollapsed) {
      // open: reveal container then animate height + rotation in parallel
      setFiltersCollapsed(false);
      Animated.parallel([
        Animated.timing(expandedAnim.current, {
          toValue: 1,
          duration: openDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim.current, {
          toValue: 1,
          duration: openDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // close: animate layout and then hide to prevent interactions with hidden content
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Animated.parallel([
        Animated.timing(expandedAnim.current, {
          toValue: 0,
          duration: closeDuration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim.current, {
          toValue: 0,
          duration: closeDuration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => setFiltersCollapsed(true));
    }
  };

  // Modal de compra
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animated height for filters content
  const expandedAnim = useRef(new Animated.Value(filtersCollapsed ? 0 : 1));
  // Separate rotation animation driven with native driver for smoothness
  const rotateAnim = useRef(new Animated.Value(filtersCollapsed ? 0 : 1));
  const [filtersContentHeight, setFiltersContentHeight] = useState(0);
  const animatedHeight = expandedAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, filtersContentHeight || 200],
  });

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
      {/* Card com saldo + Busca + Filtros */}
      <View style={styles.topCard}>
      {/* Linha de saldo + contagem de itens */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>
            {filteredItems.length} {filteredItems.length === 1 ? 'item disponível' : 'itens disponíveis'}
          </Text>
        </View>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinIcon}>🪙</Text>
          <Text style={styles.coinsValue}>{user?.coins || 0}</Text>
        </View>
      </View>

      {/* Filtros recolhíveis (busca + chips) */}
      <View style={styles.filtersCard}>
      {filtersCollapsed ? (
        <TouchableOpacity
          style={styles.collapsedFiltersBar}
          onPress={() => toggleFilters(false)}
          accessibilityRole="button"
          accessibilityLabel="Mostrar filtros"
        >
          <Text style={styles.collapsedText}>
            {hasActiveFilters ? 'Filtros (ativos) — tocar para expandir' : 'Mostrar filtros'}
          </Text>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateAnim.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            }}
          >
            <Feather name="chevron-down" size={18} color="#8E8E93" style={styles.collapseIcon} />
          </Animated.View>
        </TouchableOpacity>
      ) : (
        <>
          {/* Busca */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar itens..."
              placeholderTextColor="#999"
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
          <Animated.View style={[styles.animatedContainer, { height: animatedHeight, overflow: 'hidden' }]}> 
            <View
              style={styles.filtersContainer}
              onLayout={(e) => {
                const h = e.nativeEvent.layout.height;
                if (h && filtersContentHeight !== h) setFiltersContentHeight(h);
              }}
            >
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
          </Animated.View>

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

            <TouchableOpacity
              style={styles.collapseButton}
              onPress={() => toggleFilters(true)}
              accessibilityRole="button"
              accessibilityLabel="Recolher filtros"
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotateAnim.current.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                }}
              >
                <Feather name="chevron-down" size={14} color="#1C1C1E" style={styles.collapseButtonIcon} />
              </Animated.View>
              <Text style={styles.collapseButtonText}>Recolher</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      </View>
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
  topCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 0,    // sem margem — o pill switcher do pai já dá o espaçamento
    marginBottom: 12,
    borderRadius: 20,
    // Sombra padrão do projeto (iOS + Android + web)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666', // Padrão do projeto
    fontWeight: '500',
    marginTop: 2,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  coinIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  coinsValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B8860B', // Dourado escuro — melhor contraste que preto no fundo claro
  },
  searchContainer: {
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: '#F0F8FF', // Alice Blue — padrão do projeto
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 15,
    color: '#2F4F4F', // Padrão do projeto
  },
  filtersContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    color: '#333',
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
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 32,
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
    fontWeight: '700',
    color: '#2F4F4F', // Padrão do projeto
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666', // Padrão do projeto
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
  collapseButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F8FF', // Padrão Alice Blue do projeto
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapseButtonText: {
    fontSize: 12,
    color: '#2F4F4F', // Padrão do projeto
    fontWeight: '600',
  },
  collapseButtonIcon: {
    marginRight: 8,
  },
  collapsedFiltersBar: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animatedContainer: {
    width: '100%',
  },
  collapsedText: {
    fontSize: 14,
    color: '#666', // Padrão do projeto
  },
  collapseIcon: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 8,
  },
  filtersCard: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 0,
    backgroundColor: '#FFF',
    borderWidth: 0,
  },
});
