import type { Friend } from '@/services/friend';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from './Avatar';
import { UserStatsRow } from './UserStatsRow';

const theme = {
  colors: {
    surface: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    warning: '#FF9500',
    accent: '#FFD60A',
    error: '#FF3B30',
    surfaceVariant: '#F2F2F7',
  },
};

interface FriendCardProps {
  friend: Friend;
  onPress?: () => void;
  onRemove?: () => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({ friend, onPress, onRemove }) => {
  // Gera iniciais do nome
  const initials = friend.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        {/* Avatar */}
        <Avatar initials={initials} imageUrl={friend.avatarUrl} size={60} />

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {friend.name}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{friend.username}
          </Text>

          <UserStatsRow
            stats={[
              { icon: 'trophy', iconColor: theme.colors.warning, value: `Lvl ${friend.level}` },
              { icon: 'star', iconColor: theme.colors.accent, value: `${friend.xp} XP` },
              { icon: 'fire', iconColor: theme.colors.error, value: `${friend.currentStreak} dias` },
            ]}
            size="small"
            gap={12}
          />
        </View>

        {/* Remove Button */}
        {onRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="close" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
