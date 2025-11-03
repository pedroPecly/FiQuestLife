/**
 * FilterBar Component
 * 
 * Barra de filtros horizontal com scroll automático
 * 
 * Características:
 * - Scroll horizontal suave
 * - Ícones do MaterialCommunityIcons
 * - Badges de contagem opcionais
 * - 2 variantes visuais (pills arredondadas ou tabs retangulares)
 * - Estados ativo/inativo com cores distintas
 * 
 * @example
 * ```tsx
 * const filters = [
 *   { id: 'all', label: 'Todos', icon: 'view-dashboard' },
 *   { id: 'challenges', label: 'Desafios', icon: 'trophy', count: 5 },
 *   { id: 'badges', label: 'Badges', icon: 'medal', count: 12 },
 * ];
 * 
 * <FilterBar 
 *   filters={filters}
 *   activeFilter={activeFilter}
 *   onFilterChange={setActiveFilter}
 *   variant="pills"
 *   showCount
 * />
 * ```
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// ============================================
// TYPES
// ============================================

export interface Filter {
  /** ID único do filtro */
  id: string;
  /** Label exibido */
  label: string;
  /** Ícone do MaterialCommunityIcons */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Contagem opcional (exibida como badge se showCount=true) */
  count?: number;
}

export interface FilterBarProps {
  /** Lista de filtros */
  filters: Filter[];
  /** ID do filtro ativo */
  activeFilter: string;
  /** Callback ao trocar de filtro */
  onFilterChange: (filterId: string) => void;
  /** Se true, mostra count como badge ao lado do label */
  showCount?: boolean;
  /** Variante visual (pills = arredondado, tabs = retangular) */
  variant?: 'pills' | 'tabs';
}

// ============================================
// COMPONENT
// ============================================

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilter,
  onFilterChange,
  showCount = false,
  variant = 'pills'
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {filters.map(filter => {
          const isActive = activeFilter === filter.id;
          const hasCount = showCount && filter.count !== undefined;

          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                variant === 'tabs' && styles.filterButtonTabs,
                isActive && styles.filterButtonActive
              ]}
              onPress={() => onFilterChange(filter.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filtro: ${filter.label}${hasCount ? `, ${filter.count} itens` : ''}`}
            >
              <MaterialCommunityIcons
                name={filter.icon}
                size={18}
                color={isActive ? '#FFFFFF' : '#8E8E93'}
              />
              <Text style={[
                styles.filterText,
                isActive && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
              {hasCount && (
                <View style={[
                  styles.countBadge,
                  isActive && styles.countBadgeActive
                ]}>
                  <Text style={[
                    styles.countText,
                    isActive && styles.countTextActive
                  ]}>
                    {filter.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Wrapper
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },

  // ScrollView
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    flexDirection: 'row',
  },

  // Filter Button
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  filterButtonTabs: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },

  // Filter Text
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  // Count Badge
  countBadge: {
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
});
