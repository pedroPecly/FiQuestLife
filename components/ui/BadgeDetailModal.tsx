import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from '../../app/styles/BadgeDetailModal.styles';
import type { BadgeWithProgress } from '../../services/badge';
import {
    CATEGORY_ICONS,
    CATEGORY_LABELS,
    formatBadgeProgress,
    getRarityEmoji,
    RARITY_COLORS,
    RARITY_LABELS,
} from '../../services/badge';

// ==========================================
// INTERFACES
// ==========================================

interface BadgeDetailModalProps {
  /** Badge a ser exibido */
  badge: BadgeWithProgress | null;
  /** Se o modal está visível */
  visible: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
}

// ==========================================
// COMPONENTE
// ==========================================

const { width } = Dimensions.get('window');

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

const formatRequirement = (type: string, value: number): string => {
  const requirementMap: Record<string, string> = {
    CHALLENGES_COMPLETED: `Completar ${value} desafios`,
    STREAK_DAYS: `Manter ${value} dias de sequência`,
    LEVEL_REACHED: `Alcançar nível ${value}`,
    XP_EARNED: `Ganhar ${value} XP`,
    CATEGORY_MASTER: `Dominar categoria (${value} vezes)`,
  };
  return requirementMap[type] || `${value} completados`;
};

const getCategoryIcon = (category: string): string => {
  return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || '🏅';
};

const getCategoryLabel = (category: string): string => {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || 'Geral';
};

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  badge,
  visible,
  onClose,
}) => {
  if (!badge) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Acabei de conquistar o troféu "${badge.name}" no FiQuestLife! 🏆\n\n${badge.description}`,
      });
    } catch {}
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.modalContent}
          activeOpacity={1} 
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Badge Icon */}
            <View
              style={[
                styles.modalIcon,
                badge.earned && {
                  backgroundColor: RARITY_COLORS[badge.rarity],
                },
              ]}
            >
              {badge.earned ? (
                <Text style={styles.modalIconEmoji}>
                  {getCategoryIcon(badge.category)}
                </Text>
              ) : (
                <MaterialCommunityIcons name="lock" size={Math.min(width * 0.15, 70)} color="#9CA3AF" />
              )}
            </View>

            {/* Badge Name */}
            <Text style={styles.modalTitle}>{badge.name}</Text>

            {/* Rarity Badge */}
            <View
              style={[
                styles.modalRarityBadge,
                {
                  backgroundColor: badge.earned
                    ? RARITY_COLORS[badge.rarity]
                    : '#E5E7EB',
                },
              ]}
            >
              <Text
                style={[
                  styles.modalRarityText,
                  !badge.earned && { color: '#6B7280' },
                ]}
              >
                {getRarityEmoji(badge.rarity)} {RARITY_LABELS[badge.rarity]}
              </Text>
            </View>

            {/* Description */}
            <Text style={styles.modalDescription}>{badge.description}</Text>

            {/* Info Section */}
            <View style={styles.modalInfoSection}>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>📂 Categoria</Text>
                <Text style={styles.modalInfoValue}>
                  {getCategoryIcon(badge.category)} {getCategoryLabel(badge.category)}
                </Text>
              </View>

              <View style={[styles.modalInfoRow, styles.modalInfoRowLast]}>
                <Text style={styles.modalInfoLabel}>🎯 Requisito</Text>
                <Text style={styles.modalInfoValue}>
                  {formatRequirement(badge.requirementType, badge.requirementValue)}
                </Text>
              </View>
            </View>

            {/* Earned Status or Progress */}
            {badge.earned ? (
              <View style={styles.modalEarnedContainer}>
                <MaterialCommunityIcons name="trophy" size={20} color="#059669" />
                <Text style={styles.modalEarnedText}>
                  Conquistado em {formatDate(badge.earnedAt!)}
                </Text>
              </View>
            ) : (
              badge.progress && (
                <View style={styles.modalProgressSection}>
                  <Text style={styles.modalProgressTitle}>Progresso</Text>
                  <Text style={styles.modalProgressText}>
                    {formatBadgeProgress(badge)}
                  </Text>

                  {/* Progress Bar */}
                  <View style={styles.modalProgressBarBackground}>
                    <View
                      style={[
                        styles.modalProgressBarFill,
                        {
                          width: `${badge.progress.percentage}%`,
                          backgroundColor: RARITY_COLORS[badge.rarity],
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.modalProgressHint}>
                    Continue assim! Você está quase lá! 🚀
                  </Text>
                </View>
              )
            )}

            {/* Compartilhar conquista */}
            {badge.earned && (
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="share-variant" size={18} color="#8B5CF6" />
                <Text style={styles.shareButtonText}>Compartilhar conquista</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

