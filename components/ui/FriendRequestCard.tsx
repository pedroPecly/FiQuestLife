import type { FriendRequest } from '@/services/friend';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { UserStatsRow } from './UserStatsRow';

const theme = {
  colors: {
    surface: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    warning: '#FF9500',
    accent: '#FFD60A',
    error: '#FF3B30',
  },
};

interface FriendRequestCardProps {
  request: FriendRequest;
  type: 'received' | 'sent';
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
  loading = false,
}) => {
  const user = type === 'received' ? request.sender : request.receiver;

  if (!user) return null;

  // Gera iniciais do nome
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Avatar */}
        <Avatar initials={initials} imageUrl={user.avatarUrl} size={60} />

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {user.name}
          </Text>
          <Text style={styles.username} numberOfLines={1}>
            @{user.username}
          </Text>

          <UserStatsRow
            stats={[
              { icon: 'trophy', iconColor: theme.colors.warning, value: `Lvl ${user.level}` },
              { icon: 'star', iconColor: theme.colors.accent, value: `${user.xp} XP` },
            ]}
            size="small"
            gap={12}
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.actions}>
        {type === 'received' ? (
          <>
            <Button
              title="Aceitar"
              onPress={onAccept}
              variant="primary"
              style={styles.button}
              disabled={loading}
              icon="check"
            />
            <Button
              title="Rejeitar"
              onPress={onReject}
              variant="danger"
              style={styles.button}
              disabled={loading}
              icon="close"
            />
          </>
        ) : (
          <Button
            title="Cancelar"
            onPress={onCancel}
            variant="secondary"
            disabled={loading}
            icon="close"
          />
        )}
      </View>
    </View>
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
    marginBottom: 12,
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
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
