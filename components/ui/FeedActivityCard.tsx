import { FeedActivity, FeedActivityType } from '@/services/feed';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const theme = {
  colors: {
    surface: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    primary: '#007AFF',
    warning: '#FF9500',
    success: '#34C759',
    error: '#FF3B30',
    info: '#5856D6',
  },
};

interface FeedActivityCardProps {
  activity: FeedActivity;
}

const getActivityIcon = (type: FeedActivityType) => {
  switch (type) {
    case 'CHALLENGE_COMPLETED':
      return <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />;
    case 'BADGE_EARNED':
      return <MaterialCommunityIcons name="medal" size={24} color={theme.colors.warning} />;
    case 'LEVEL_UP':
      return <MaterialCommunityIcons name="arrow-up-bold" size={24} color={theme.colors.info} />;
    case 'STREAK_MILESTONE':
      return <MaterialIcons name="local-fire-department" size={24} color={theme.colors.error} />;
  }
};

const getActivityColor = (type: FeedActivityType) => {
  switch (type) {
    case 'CHALLENGE_COMPLETED':
      return theme.colors.success + '15';
    case 'BADGE_EARNED':
      return theme.colors.warning + '15';
    case 'LEVEL_UP':
      return theme.colors.info + '15';
    case 'STREAK_MILESTONE':
      return theme.colors.error + '15';
  }
};

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'agora mesmo';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm atrás';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h atrás';
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd atrás';
  return Math.floor(seconds / 604800) + 'sem atrás';
};

const getCategoryEmoji = (category: string): string => {
  const map: Record<string, string> = {
    PHYSICAL_ACTIVITY: '💪', NUTRITION: '🥗', HYDRATION: '💧', SLEEP: '😴',
    MENTAL_HEALTH: '🧠', SOCIAL: '🤝', PRODUCTIVITY: '📚', MINDFULNESS: '🧘',
  };
  return map[category] || '✨';
};

const getRarityColor = (rarity: string): string => {
  const map: Record<string, string> = {
    COMMON: theme.colors.textSecondary, RARE: theme.colors.info,
    EPIC: '#9333EA', LEGENDARY: theme.colors.warning,
  };
  return map[rarity] || theme.colors.textSecondary;
};

export const FeedActivityCard: React.FC<FeedActivityCardProps> = ({ activity }) => {
  const metaText = (() => {
    if (!activity.metadata) return '';
    const m = String(activity.metadata);
    if (activity.type === 'CHALLENGE_COMPLETED') {
      return getCategoryEmoji(m) + ' ' + m.replace(/_/g, ' ');
    }
    if (activity.type === 'BADGE_EARNED') {
      return '⭐ ' + m;
    }
    if (activity.type === 'LEVEL_UP') {
      return '🎯 Nível ' + m;
    }
    if (activity.type === 'STREAK_MILESTONE') {
      return '🔥 ' + m + ' dias';
    }
    return '';
  })();
  
  const metaColor = activity.type === 'BADGE_EARNED' && activity.metadata 
    ? getRarityColor(String(activity.metadata)) 
    : theme.colors.textSecondary;
    
  const xp = activity.xpReward || 0;
  const bgColor = getActivityColor(activity.type);

  return (
    <View style={styles.container}>
      <View style={[styles.colorStrip, { backgroundColor: bgColor }]} />
      <View style={styles.iconBadge}>{getActivityIcon(activity.type)}</View>
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={() => router.push(`/user-profile?userId=${activity.userId}` as any)} 
          style={styles.userRow}
          activeOpacity={0.7}
        >
          {activity.avatarUrl ? (
            <Image source={{ uri: activity.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={20} color={theme.colors.textSecondary} />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{String(activity.name)}</Text>
            <Text style={styles.timeAgo}>{getTimeAgo(activity.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.description}>{String(activity.description)}</Text>
        {metaText.length > 0 && (
          <Text style={[styles.metadata, { color: metaColor }]}>{metaText}</Text>
        )}
        {xp > 0 && (
          <View style={styles.xpBadge}>
            <MaterialCommunityIcons name="star" size={16} color={theme.colors.warning} />
            <Text style={styles.xpText}>{'+' + xp + ' XP'}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  colorStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  metadata: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.warning + '40',
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.warning,
    marginLeft: 4,
  },
});
