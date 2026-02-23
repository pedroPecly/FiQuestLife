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
      {/* Pill Tab Switcher — padrão do projeto */}
      <View style={styles.tabSwitcherWrapper}>
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.pill, activeTab === 'shop' && styles.pillActive]}
            onPress={() => setActiveTab('shop')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'shop' }}
            accessibilityLabel="Loja"
          >
            <Text style={[styles.pillText, activeTab === 'shop' && styles.pillTextActive]}>
              🛒 Loja
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.pill, activeTab === 'inventory' && styles.pillActive]}
            onPress={() => setActiveTab('inventory')}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'inventory' }}
            accessibilityLabel="Mochila"
          >
            <Text style={[styles.pillText, activeTab === 'inventory' && styles.pillTextActive]}>
              🎒 Mochila
            </Text>
          </TouchableOpacity>
        </View>
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
  // ==========================================
  // PILL TAB SWITCHER — Padrão do projeto
  // ==========================================
  tabSwitcherWrapper: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 5,
    gap: 6,
    // Sombra padrão do projeto (iOS + Android + web)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#20B2AA',
    // Sombra colorida no pill ativo
    shadowColor: '#20B2AA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666', // Padrão do projeto para texto secundário
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
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
