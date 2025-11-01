import type { UserSearchResult } from '@/services/friend';
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
    success: '#34C759',
  },
};

interface UserSearchCardProps {
  user: UserSearchResult;
  onAddFriend?: () => void;
  onPress?: () => void;
  loading?: boolean;
}

export const UserSearchCard: React.FC<UserSearchCardProps> = ({
  user,
  onAddFriend,
  onPress,
  loading = false,
}) => {
  // Gera iniciais do nome
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Define texto e ação do botão baseado no status
  const getButtonConfig = () => {
    switch (user.status) {
      case 'FRIENDS':
        return { title: 'Amigos', variant: 'secondary' as const, disabled: true, icon: 'check' };
      case 'SENT':
        return {
          title: 'Pendente',
          variant: 'secondary' as const,
          disabled: true,
          icon: 'clock-outline',
        };
      case 'RECEIVED':
        return {
          title: 'Responder',
          variant: 'primary' as const,
          disabled: false,
          icon: 'account-check',
        };
      case 'BLOCKED':
        return { title: 'Bloqueado', variant: 'danger' as const, disabled: true, icon: 'block-helper' };
      default:
        return {
          title: 'Adicionar',
          variant: 'primary' as const,
          disabled: false,
          icon: 'account-plus',
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Avatar */}
        <Avatar initials={initials} imageUrl={user.avatarUrl} size={50} />

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
            gap={10}
          />
        </View>

        {/* Action Button */}
        <Button
          title={buttonConfig.title}
          variant={buttonConfig.variant}
          onPress={buttonConfig.disabled ? undefined : onAddFriend}
          disabled={buttonConfig.disabled || loading}
          icon={buttonConfig.icon}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  button: {
    marginLeft: 8,
  },
});
