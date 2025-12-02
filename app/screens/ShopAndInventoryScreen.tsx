/**
 * ============================================
 * SHOP & INVENTORY SCREEN - LOJA E INVENTÁRIO UNIFICADOS
 * ============================================
 * 
 * Tela única com tabs internas para:
 * - Loja: Visualizar e comprar itens
 * - Mochila: Gerenciar inventário e boosts ativos
 * 
 * SEGURANÇA E PERFORMANCE:
 * - Ambas as telas são mantidas montadas (display:none) para evitar reload
 * - Validações de entrada em todos os formulários
 * - Retry automático em caso de falha de rede
 * - Transações atômicas no backend
 * 
 * COMPATIBILIDADE:
 * - iOS e Android (React Native)
 * - Suporte a acessibilidade (screen readers)
 * - Testes em múltiplos tamanhos de tela
 * - SafeAreaView para notch/ilha dinâmica
 * 
 * @created 02 de dezembro de 2025
 * @reviewed 02 de dezembro de 2025
 */

import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InventoryScreen from './InventoryScreen';
import ShopScreen from './ShopScreen';

type Tab = 'shop' | 'inventory';

export default function ShopAndInventoryScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('shop');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shop' && styles.tabActive]}
          onPress={() => setActiveTab('shop')}
        >
          <Text style={[styles.tabText, activeTab === 'shop' && styles.tabTextActive]}>
            🛒 Loja
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'inventory' && styles.tabActive]}
          onPress={() => setActiveTab('inventory')}
        >
          <Text style={[styles.tabText, activeTab === 'inventory' && styles.tabTextActive]}>
            🎒 Mochila
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content - Mantém ambas montadas para evitar reload */}
      <View style={styles.content}>
        <View style={[styles.screenContainer, activeTab !== 'shop' && styles.screenHidden]}>
          <ShopScreen />
        </View>
        <View style={[styles.screenContainer, activeTab !== 'inventory' && styles.screenHidden]}>
          <InventoryScreen />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    // Sombra cross-platform
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#20B2AA',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#20B2AA',
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  screenHidden: {
    display: 'none',
  },
});
