/**
 * ============================================
 * BADGE CARD - CARD DE BADGE/CONQUISTA
 * ============================================
 * 
 * Componente para exibir um badge individual:
 * - Estado conquistado (colorido, com data)
 * - Estado bloqueado (cinza, com progresso)
 * - Cores por raridade
 * - Animações e feedback visual
 * 
 * @created 27 de outubro de 2025
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BadgeWithProgress } from '../../services/badge';
import { CATEGORY_ICONS, getRarityEmoji, RARITY_COLORS, RARITY_LABELS } from '../../services/badge';

// ==========================================
// INTERFACES
// ==========================================

interface BadgeCardProps {
  badge: BadgeWithProgress;
  onPress?: () => void;
}

// ==========================================
// COMPONENTE
// ==========================================

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, onPress }) => {
  const isEarned = badge.earned;
  const rarityColor = RARITY_COLORS[badge.rarity];
  const categoryIcon = CATEGORY_ICONS[badge.category];
  const rarityEmoji = getRarityEmoji(badge.rarity);
  const rarityLabel = RARITY_LABELS[badge.rarity];

  // ==========================================
  // FORMATAÇÃO DE DATA
  // ==========================================
  const formatEarnedDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isEarned ? styles.cardEarned : styles.cardLocked,
        isEarned && { borderColor: rarityColor, borderWidth: 2 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Badge Icon/Emoji */}
      <View style={[styles.iconContainer, isEarned && { backgroundColor: rarityColor }]}>
        {isEarned ? (
          <Text style={styles.iconEmoji}>{categoryIcon}</Text>
        ) : (
          <MaterialCommunityIcons name="lock" size={32} color="#9CA3AF" />
        )}
      </View>

      {/* Badge Name */}
      <Text
        style={[styles.name, !isEarned && styles.nameLocked]}
        numberOfLines={2}
      >
        {badge.name}
      </Text>

      {/* Rarity Badge */}
      <View style={[styles.rarityBadge, { backgroundColor: isEarned ? rarityColor : '#E5E7EB' }]}>
        <Text style={[styles.rarityText, !isEarned && { color: '#9CA3AF' }]}>
          {rarityEmoji} {rarityLabel}
        </Text>
      </View>

      {/* Earned Date or Progress */}
      {isEarned && badge.earnedAt ? (
        <View style={styles.earnedContainer}>
          <MaterialCommunityIcons name="check-circle" size={14} color="#10B981" />
          <Text style={styles.earnedText}>
            {formatEarnedDate(badge.earnedAt)}
          </Text>
        </View>
      ) : (
        badge.progress && (
          <View style={styles.progressContainer}>
            {/* Progress Bar */}
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${badge.progress.percentage}%`, backgroundColor: rarityColor },
                ]}
              />
            </View>

            {/* Progress Text */}
            <Text style={styles.progressText}>
              {badge.progress.current}/{badge.progress.required}
            </Text>
          </View>
        )
      )}

    </TouchableOpacity>
  );
};

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 200,
    position: 'relative',
  },

  cardEarned: {
    opacity: 1,
  },

  cardLocked: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconEmoji: {
    fontSize: 40,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 40,
  },

  nameLocked: {
    color: '#6B7280',
  },

  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },

  rarityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  earnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },

  earnedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },

  progressContainer: {
    width: '100%',
    marginTop: 8,
  },

  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  progressText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },

  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
  },
});
