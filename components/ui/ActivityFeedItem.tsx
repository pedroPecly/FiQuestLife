import type { FriendActivity } from '@/services/friend';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';

const theme = {
  colors: {
    surface: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    primary: '#007AFF',
    warning: '#FF9500',
    success: '#34C759',
    accent: '#FFD60A',
  },
};

// Função helper para formatar tempo relativo
function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'agora';
  if (diffInMinutes < 60) return `há ${diffInMinutes}m`;
  if (diffInHours < 24) return `há ${diffInHours}h`;
  if (diffInDays < 7) return `há ${diffInDays}d`;
  return `há ${Math.floor(diffInDays / 7)} semanas`;
}

interface ActivityFeedItemProps {
  activity: FriendActivity;
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ activity }) => {
  // Gera iniciais do nome
  const initials = activity.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Configura ícone e cor baseado no tipo de atividade
  const getActivityConfig = () => {
    switch (activity.type) {
      case 'CHALLENGE_COMPLETED':
        return {
          icon: 'trophy' as const,
          color: theme.colors.warning,
          prefix: 'completou o desafio',
        };
      case 'BADGE_EARNED':
        return {
          icon: 'medal' as const,
          color: theme.colors.accent,
          prefix: 'conquistou o badge',
        };
      case 'REWARD':
        return {
          icon: 'gift' as const,
          color: theme.colors.success,
          prefix: 'recebeu',
        };
      default:
        return {
          icon: 'information' as const,
          color: theme.colors.primary,
          prefix: '',
        };
    }
  };

  const config = getActivityConfig();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
        <MaterialCommunityIcons name={config.icon} size={24} color={config.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Avatar initials={initials} imageUrl={activity.avatarUrl} size={36} />

          <View style={styles.info}>
            <Text style={styles.text}>
              <Text style={styles.username}>@{activity.username}</Text>
              <Text style={styles.action}> {config.prefix} </Text>
              <Text style={styles.description}>{activity.description}</Text>
            </Text>

            <Text style={styles.time}>{formatDistanceToNow(new Date(activity.createdAt))}</Text>
          </View>
        </View>

        {activity.xpReward && activity.xpReward > 0 && (
          <View style={styles.reward}>
            <MaterialCommunityIcons name="star" size={16} color={theme.colors.accent} />
            <Text style={styles.rewardText}>+{activity.xpReward} XP</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
  },
  username: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  action: {
    color: theme.colors.textSecondary,
  },
  description: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.accent,
  },
});
