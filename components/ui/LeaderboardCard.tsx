/**
 * ============================================
 * LEADERBOARD CARD - ITEM DO RANKING
 * ============================================
 * 
 * Exibe um usuário no ranking com:
 * - Posição
 * - Avatar
 * - Nome e username
 * - Stats (XP, coins ou streak)
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';

// Cores e estilos
const COLORS = {
  primary: '#20B2AA',
  warning: '#FFD700',
  error: '#FF6B6B',
  text: '#1A1A1A',
  textSecondary: '#666',
  cardBackground: '#FFF',
};

const FONTS = {
  regular: 'System',
  semiBold: 'System',
  bold: 'System',
};

const SPACING = {
  sm: 8,
  md: 16,
  borderRadius: 12,
};

interface LeaderboardCardProps {
  position: number;
  user: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string | null;
    level: number;
  };
  stat: number;
  statType: 'xp' | 'coins' | 'streak';
  isCurrentUser?: boolean;
}

export function LeaderboardCard({ position, user, stat, statType, isCurrentUser }: LeaderboardCardProps) {
  // Ícones e cores por tipo de stat
  const getStatConfig = () => {
    switch (statType) {
      case 'xp':
        return {
          icon: 'star' as const,
          color: COLORS.primary,
          label: 'XP',
        };
      case 'coins':
        return {
          icon: 'logo-bitcoin' as const,
          color: COLORS.warning,
          label: 'FiCoins',
        };
      case 'streak':
        return {
          icon: 'flame' as const,
          color: COLORS.error,
          label: 'Dias',
        };
    }
  };

  const config = getStatConfig();

  // Medalhas para top 3
  const getMedalColor = () => {
    if (position === 1) return '#FFD700'; // Ouro
    if (position === 2) return '#C0C0C0'; // Prata
    if (position === 3) return '#CD7F32'; // Bronze
    return COLORS.textSecondary;
  };

  return (
    <View style={[styles.container, isCurrentUser && styles.currentUser]}>
      {/* Posição */}
      <View style={styles.positionContainer}>
        {position <= 3 ? (
          <Ionicons name="trophy" size={24} color={getMedalColor()} />
        ) : (
          <Text style={styles.positionText}>#{position}</Text>
        )}
      </View>

      {/* Avatar e Info */}
      <View style={styles.userInfo}>
        <Avatar
          imageUrl={user.avatarUrl || undefined}
          initials={user.name.substring(0, 2)}
          size={48}
        />
        <View style={styles.userDetails}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{user.username}
          </Text>
        </View>
      </View>

      {/* Stat */}
      <View style={styles.statContainer}>
        <View style={styles.statRow}>
          <Ionicons name={config.icon} size={20} color={config.color} />
          <Text style={[styles.statValue, { color: config.color }]}>
            {stat.toLocaleString('pt-BR')}
          </Text>
        </View>
        <Text style={styles.statLabel}>{config.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  currentUser: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  positionContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  userDetails: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  name: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 2,
  },
  username: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statContainer: {
    alignItems: 'flex-end',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
