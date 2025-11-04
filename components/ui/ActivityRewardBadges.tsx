/**
 * ============================================
 * ACTIVITY REWARD BADGES COMPONENT
 * ============================================
 * 
 * Componente reutilizável para exibir badges de recompensa (XP e Coins)
 * com ícones e cores consistentes
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ActivityRewardBadgesProps {
  xp?: number;
  coins?: number;
  size?: 'small' | 'medium' | 'large';
}

export const ActivityRewardBadges: React.FC<ActivityRewardBadgesProps> = ({
  xp,
  coins,
  size = 'medium',
}) => {
  if (!xp && !coins) return null;

  const iconSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
  const fontSize = size === 'small' ? 11 : size === 'medium' ? 12 : 14;
  const padding = size === 'small' ? 4 : size === 'medium' ? 6 : 8;

  return (
    <View style={styles.container}>
      {xp !== undefined && xp > 0 && (
        <View style={[styles.badge, styles.xpBadge, { paddingHorizontal: padding, paddingVertical: padding / 2 }]}>
          <Ionicons name="star" size={iconSize} color="#5856D6" />
          <Text style={[styles.badgeText, styles.xpText, { fontSize }]}>
            +{xp} XP
          </Text>
        </View>
      )}
      
      {coins !== undefined && coins > 0 && (
        <View style={[styles.badge, styles.coinsBadge, { paddingHorizontal: padding, paddingVertical: padding / 2 }]}>
          <MaterialCommunityIcons name="cash" size={iconSize} color="#B8860B" />
          <Text style={[styles.badgeText, styles.coinsText, { fontSize }]}>
            +{coins}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
  },
  xpBadge: {
    backgroundColor: '#5856D6' + '15',
  },
  coinsBadge: {
    backgroundColor: '#FFD700' + '20',
  },
  badgeText: {
    fontWeight: '600',
  },
  xpText: {
    color: '#5856D6',
  },
  coinsText: {
    color: '#B8860B',
  },
});
