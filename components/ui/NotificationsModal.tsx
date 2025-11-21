/**
 * ============================================
 * NOTIFICATIONS MODAL
 * ============================================
 * 
 * Modal para exibir lista de notificações locais
 * As notificações são armazenadas apenas no AsyncStorage
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { authStorage } from '../../services/auth';
import type { LocalNotification } from '../../services/localNotificationStorage';
import {
    clearUserNotifications,
    deleteLocalNotification,
    getLocalNotifications,
    getLocalUnreadCount,
    markAllLocalNotificationsAsRead,
    markLocalNotificationAsRead,
} from '../../services/localNotificationStorage';
import { navigateFromNotification } from '../../services/notificationNavigation';
import { BottomSheetModal } from './BottomSheetModal';
import { NotificationItem } from './NotificationItem';

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

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationsModal({ visible, onClose, onUnreadCountChange }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Pega userId do usuário logado
      const user = await authStorage.getUser();
      if (!user) {
        console.log('[NOTIFICATIONS MODAL] Usuário não logado');
        setNotifications([]);
        onUnreadCountChange?.(0);
        return;
      }

      console.log('[NOTIFICATIONS MODAL] Carregando notificações locais...');
      const data = await getLocalNotifications(user.id, false);
      console.log('[NOTIFICATIONS MODAL] Notificações recebidas:', data.length);
      setNotifications(data);

      // Atualizar contagem de não lidas
      const unreadCount = await getLocalUnreadCount(user.id);
      console.log('[NOTIFICATIONS MODAL] Não lidas:', unreadCount);
      onUnreadCountChange?.(unreadCount);
    } catch (error) {
      console.error('[NOTIFICATIONS MODAL] Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (visible) {
      console.log('[NOTIFICATIONS MODAL] Modal aberto, carregando notificações...');
      loadNotifications();
      
      // Marca todas como lidas automaticamente após 1 segundo
      setTimeout(async () => {
        try {
          const user = await authStorage.getUser();
          if (!user) return;
          
          await markAllLocalNotificationsAsRead(user.id);
          console.log('[NOTIFICATIONS MODAL] Todas marcadas como lidas');
          
          // Atualiza estado local
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          onUnreadCountChange?.(0);
        } catch (error) {
          console.error('[NOTIFICATIONS MODAL] Erro ao marcar todas como lidas:', error);
        }
      }, 1000);
    }
  }, [visible, onUnreadCountChange]);

  const handleNotificationPress = async (notification: LocalNotification) => {
    console.log('[NOTIFICATIONS MODAL] ========================================');
    console.log('[NOTIFICATIONS MODAL] Notificação clicada:', notification.type);
    console.log('[NOTIFICATIONS MODAL] ID:', notification.id);
    console.log('[NOTIFICATIONS MODAL] Dados:', JSON.stringify(notification.data));
    console.log('[NOTIFICATIONS MODAL] ========================================');

    // Marca como lida se ainda não estiver
    if (!notification.read) {
      try {
        const user = await authStorage.getUser();
        if (!user) return;
        
        await markLocalNotificationAsRead(user.id, notification.id);
        
        // Atualizar localmente
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );

        // Atualizar contagem
        const unreadCount = await getLocalUnreadCount(user.id);
        onUnreadCountChange?.(unreadCount);
      } catch (error) {
        console.error('Erro ao marcar como lida:', error);
      }
    }

    // Fecha o modal antes de navegar
    console.log('[NOTIFICATIONS MODAL] Fechando modal...');
    onClose();

    // Navega para o destino apropriado
    setTimeout(() => {
      console.log('[NOTIFICATIONS MODAL] Chamando navigateFromNotification...');
      navigateFromNotification(notification);
    }, 300); // Pequeno delay para animação do modal fechar
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const user = await authStorage.getUser();
      if (!user) return;
      
      await deleteLocalNotification(user.id, notificationId);
      
      // Remover localmente
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      
      // Atualizar contagem de não lidas
      const unreadCount = await getLocalUnreadCount(user.id);
      onUnreadCountChange?.(unreadCount);
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      const user = await authStorage.getUser();
      if (!user) return;
      
      await clearUserNotifications(user.id);
      
      // Limpar localmente
      setNotifications([]);
      onUnreadCountChange?.(0);
      
      console.log('[NOTIFICATIONS MODAL] Todas as notificações foram limpas');
    } catch (error) {
      console.error('[NOTIFICATIONS MODAL] Erro ao limpar notificações:', error);
    }
  };

  const renderNotification = ({ item }: { item: LocalNotification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title="Notificações"
      headerRight={
        notifications.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={22} color={theme.colors.accent.red} />
          </TouchableOpacity>
        ) : undefined
      }
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color={theme.colors.text.secondary} />
          <Text style={styles.emptyText}>Nenhuma notificação</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} />
          }
        />
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    padding: 8,
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
});
