import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BackendNotification } from '../../services/notificationApi';

const theme = {
  colors: {
    background: '#FFFFFF',
    text: {
      primary: '#1C1C1E',
      secondary: '#8E8E93',
      tertiary: '#C7C7CC',
    },
    primary: '#007AFF',
    border: '#E5E5EA',
    accent: {
      red: '#FF3B30',
    },
  },
};

interface NotificationItemProps {
  notification: BackendNotification;
  onPress: () => void;
  onDelete: () => void;
}

const getNotificationIcon = (type: BackendNotification['type']): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'ACTIVITY_LIKE':
      return 'heart';
    case 'ACTIVITY_COMMENT':
      return 'chatbubble';
    case 'FRIEND_REQUEST':
      return 'person-add';
    case 'FRIEND_ACCEPTED':
      return 'people';
    case 'BADGE_EARNED':
      return 'medal';
    case 'LEVEL_UP':
      return 'arrow-up-circle';
    case 'CHALLENGE_COMPLETED':
      return 'checkmark-circle';
    case 'STREAK_MILESTONE':
      return 'flame';
    default:
      return 'notifications';
  }
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes}m atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

export function NotificationItem({ notification, onPress, onDelete }: NotificationItemProps) {
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <TouchableOpacity
      style={[styles.notificationItem, !notification.read && styles.unread]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getNotificationIcon(notification.type)} size={24} color={theme.colors.primary} />
        {!notification.read && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="close" size={20} color={theme.colors.text.secondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  unread: {
    backgroundColor: theme.colors.primary + '05',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent.red,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  message: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
    marginTop: 4,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});
