import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

/**
 * Representa uma estatística individual do usuário
 */
export interface UserStat {
  /** Nome do ícone do MaterialCommunityIcons */
  icon: string;
  /** Cor do ícone (opcional, padrão: #8E8E93) */
  iconColor?: string;
  /** Valor a ser exibido */
  value: string | number;
  /** Label opcional para versões com texto descritivo */
  label?: string;
}

export interface UserStatsRowProps {
  /** Array de estatísticas a serem exibidas */
  stats: UserStat[];
  /** Tamanho do componente */
  size?: 'small' | 'medium' | 'large';
  /** Espaçamento entre os itens (default: 12) */
  gap?: number;
  /** Estilo customizado do container */
  style?: ViewStyle;
}

/**
 * Componente para exibir uma linha horizontal de estatísticas do usuário
 * 
 * @example
 * ```tsx
 * // Versão compacta (sem labels)
 * <UserStatsRow
 *   stats={[
 *     { icon: 'trophy', iconColor: '#FF9500', value: 25 },
 *     { icon: 'star', iconColor: '#FFD60A', value: 1250 },
 *     { icon: 'fire', iconColor: '#FF3B30', value: '7 dias' },
 *   ]}
 *   size="small"
 * />
 * 
 * // Versão com labels
 * <UserStatsRow
 *   stats={[
 *     { icon: 'trophy', iconColor: '#FF9500', value: 25, label: 'Nível' },
 *     { icon: 'star', iconColor: '#FFD60A', value: 1250, label: 'XP' },
 *   ]}
 *   size="medium"
 * />
 * ```
 */
export const UserStatsRow: React.FC<UserStatsRowProps> = ({
  stats,
  size = 'small',
  gap = 12,
  style,
}) => {
  const iconSize = size === 'small' ? 14 : size === 'medium' ? 18 : 22;
  const fontSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
  const labelFontSize = size === 'small' ? 10 : size === 'medium' ? 12 : 14;

  return (
    <View style={[styles.container, { gap }, style]}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <MaterialCommunityIcons
            name={stat.icon as any}
            size={iconSize}
            color={stat.iconColor || '#8E8E93'}
          />
          <Text style={[styles.statText, { fontSize }]}>{stat.value}</Text>
          {stat.label && (
            <Text style={[styles.statLabel, { fontSize: labelFontSize }]}>{stat.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  statLabel: {
    color: '#C7C7CC',
    fontWeight: '500',
    marginLeft: 2,
  },
});
