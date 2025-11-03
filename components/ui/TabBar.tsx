/**
 * TabBar Component
 * 
 * Sistema de abas horizontal reutilizável com suporte a:
 * - Ícones opcionais (MaterialCommunityIcons)
 * - Badges numéricos (azul padrão ou vermelho para alertas)
 * - 2 variantes visuais (primary = fundo branco, secondary = pills)
 * - Estilos consistentes com o design system
 * 
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'search', label: 'Buscar', icon: 'account-search' },
 *   { 
 *     id: 'requests', 
 *     label: 'Solicitações', 
 *     icon: 'account-clock',
 *     badge: 5,
 *     badgeColor: 'alert'
 *   },
 *   { id: 'friends', label: 'Amigos', icon: 'account-group', badge: 12 }
 * ];
 * 
 * <TabBar 
 *   tabs={tabs} 
 *   activeTab={activeTab} 
 *   onTabChange={setActiveTab}
 *   variant="primary"
 * />
 * ```
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ============================================
// TYPES
// ============================================

export interface Tab {
  /** ID único da tab */
  id: string;
  /** Label exibido */
  label: string;
  /** Ícone opcional do MaterialCommunityIcons */
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Badge numérico opcional */
  badge?: number;
  /** Cor do badge (default = azul #007AFF, alert = vermelho #FF3B30) */
  badgeColor?: 'default' | 'alert';
}

export interface TabBarProps {
  /** Lista de tabs */
  tabs: Tab[];
  /** ID da tab ativa */
  activeTab: string;
  /** Callback ao trocar de tab */
  onTabChange: (tabId: string) => void;
  /** Variante visual (primary = fundo branco com borda, secondary = pills sem borda) */
  variant?: 'primary' | 'secondary';
}

// ============================================
// COMPONENT
// ============================================

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'primary'
}) => {
  return (
    <View style={[
      styles.container,
      variant === 'secondary' && styles.containerSecondary
    ]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const showBadge = tab.badge !== undefined && tab.badge > 0;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              variant === 'secondary' && styles.tabSecondary,
              isActive && styles.tabActive,
              isActive && variant === 'secondary' && styles.tabSecondaryActive
            ]}
            onPress={() => onTabChange(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label}${showBadge ? `, ${tab.badge} itens` : ''}`}
          >
            {tab.icon && (
              <MaterialCommunityIcons
                name={tab.icon}
                size={20}
                color={isActive ? '#007AFF' : '#8E8E93'}
              />
            )}
            <Text style={[
              styles.tabText,
              isActive && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
            {showBadge && (
              <View style={[
                styles.badge,
                tab.badgeColor === 'alert' && styles.badgeAlert
              ]}>
                <Text style={styles.badgeText}>{tab.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Container
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  containerSecondary: {
    backgroundColor: '#F2F2F7',
    borderBottomWidth: 0,
    paddingVertical: 12,
  },

  // Tab
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabSecondary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: '#E3F2FF',
  },
  tabSecondaryActive: {
    backgroundColor: '#007AFF',
  },

  // Tab Text
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#007AFF',
  },

  // Badge
  badge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeAlert: {
    backgroundColor: '#FF3B30',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
