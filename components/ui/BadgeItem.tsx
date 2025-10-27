// components/ui/BadgeItem.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BadgeRarity } from '../../services/badge';
import { getRarityEmoji, RARITY_COLORS } from '../../services/badge';

// ==========================================
// INTERFACES
// ==========================================

export interface BadgeItemProps {
  /**
   * Ícone emoji do badge
   */
  icon?: string;
  
  /**
   * Nome do badge
   */
  name: string;
  
  /**
   * Data de conquista (formato: string ISO ou Date)
   */
  earnedAt?: string | Date;
  
  /**
   * Raridade do badge
   */
  rarity: BadgeRarity;
  
  /**
   * Variante de exibição
   * - 'full': Item completo com todos os detalhes (padrão)
   * - 'mini': Card compacto para scroll horizontal
   */
  variant?: 'full' | 'mini';
  
  /**
   * Callback ao tocar no badge
   */
  onPress?: () => void;
  
  /**
   * Se o badge está bloqueado (não conquistado)
   */
  locked?: boolean;
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Formata a data de conquista do badge
 */
const formatBadgeDate = (dateString?: string | Date): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  } catch {
    return '';
  }
};

// ==========================================
// COMPONENTE
// ==========================================

export const BadgeItem: React.FC<BadgeItemProps> = ({
  icon,
  name,
  earnedAt,
  rarity,
  variant = 'full',
  onPress,
  locked = false,
}) => {
  const rarityColor = RARITY_COLORS[rarity];
  const rarityEmoji = getRarityEmoji(rarity);

  // Renderiza versão MINI (card horizontal compacto)
  if (variant === 'mini') {
    return (
      <TouchableOpacity
        style={[styles.miniCard, { borderColor: rarityColor }]}
        onPress={onPress}
        disabled={!onPress}
      >
        <Text style={styles.miniIcon}>{rarityEmoji}</Text>
        <Text style={styles.miniName} numberOfLines={1}>
          {name}
        </Text>
        {earnedAt && (
          <Text style={styles.miniDate}>{formatBadgeDate(earnedAt)}</Text>
        )}
      </TouchableOpacity>
    );
  }

  // Renderiza versão FULL (item de lista completo)
  return (
    <TouchableOpacity
      style={styles.fullContainer}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Ícone do badge */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${rarityColor}26` }, // 15% opacity
        ]}
      >
        {locked ? (
          <MaterialCommunityIcons name="lock" size={24} color="#999" />
        ) : (
          <Text style={styles.icon}>{icon || rarityEmoji}</Text>
        )}
      </View>

      {/* Informações do badge */}
      <View style={styles.info}>
        <Text style={[styles.name, locked && styles.lockedText]}>
          {name}
        </Text>
        {earnedAt && !locked && (
          <Text style={styles.date}>
            Conquistado em {formatBadgeDate(earnedAt)}
          </Text>
        )}
        {locked && <Text style={styles.lockedSubtext}>Ainda não conquistado</Text>}
      </View>

      {/* Badge de raridade */}
      <View
        style={[
          styles.rarityBadge,
          { backgroundColor: `${rarityColor}26` },
        ]}
      >
        <Text style={styles.rarityEmoji}>{rarityEmoji}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  // === VARIANTE FULL ===
  fullContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
  lockedText: {
    color: '#999',
  },
  lockedSubtext: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rarityEmoji: {
    fontSize: 16,
  },

  // === VARIANTE MINI ===
  miniCard: {
    width: 120,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  miniIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  miniName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  miniDate: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
