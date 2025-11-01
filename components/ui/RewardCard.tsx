/**
 * ============================================
 * REWARD CARD - Componente de Card de Recompensa
 * ============================================
 *
 * Card individual para exibir uma recompensa do histórico.
 * Mostra ícone, tipo, quantidade, origem e data.
 *
 * @created 01 de novembro de 2025
 */

import { styles } from '@/app/styles/reward-card.styles';
import type { RewardItem, RewardType } from '@/services/reward';
import {
    formatRewardAmount,
    formatRewardDate,
    getRewardSourceLabel,
    REWARD_TYPE_COLORS,
    REWARD_TYPE_ICONS,
} from '@/services/reward';
import React from 'react';
import { Text, View } from 'react-native';

interface RewardCardProps {
  reward: RewardItem;
}

export const RewardCard: React.FC<RewardCardProps> = React.memo(({ reward }) => {
  const { type, amount, source, description, createdAt } = reward;

  const icon = REWARD_TYPE_ICONS[type as RewardType];
  const color = REWARD_TYPE_COLORS[type as RewardType];
  const formattedAmount = formatRewardAmount(type as RewardType, amount);
  const formattedDate = formatRewardDate(createdAt);
  const sourceLabel = getRewardSourceLabel(source);

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Recompensa: ${formattedAmount}, ${sourceLabel}, ${formattedDate}`}
      accessibilityRole="summary"
    >
      {/* Ícone com fundo colorido */}
      <View 
        style={[styles.iconContainer, { backgroundColor: color }]}
        accessible={false}
      >
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.amount}>{formattedAmount}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        <Text style={styles.source}>{sourceLabel}</Text>

        {description && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
});

RewardCard.displayName = 'RewardCard';

export default RewardCard;
