/**
 * ============================================
 * NOTIFICATION FEED - Feed de Notificações
 * ============================================
 * 
 * Modal fullscreen mostrando todas as notificações.
 * 
 * Features:
 * - Lista completa de notificações
 * - Pull-to-refresh
 * - Marca todas como lidas ao abrir
 * - Estado vazio
 * - Botão de limpar todas
 * 
 * @created 27 de outubro de 2025
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import type { InAppNotification } from '../../services/notificationCenter';
import {
    clearAllNotifications,
    getNotificationHistory,
    markAllAsRead,
    markAsRead,
} from '../../services/notificationCenter';
import type { NotificationType } from '../../services/notifications';
import { NotificationItem } from './NotificationItem';

// ==========================================
// TIPOS
// ==========================================

interface NotificationFeedProps {
  visible: boolean;
  onClose: () => void;
  onBadgeCountChange?: (count: number) => void;
}

// ==========================================
// COMPONENTE
// ==========================================

export const NotificationFeed: React.FC<NotificationFeedProps> = ({
  visible,
  onClose,
  onBadgeCountChange,
}) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // CARREGAMENTO
  // ==========================================

  const loadNotifications = useCallback(async () => {
    try {
      const history = await getNotificationHistory();
      setNotifications(history);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Carrega ao abrir modal
  useEffect(() => {
    if (visible) {
      setLoading(true);
      loadNotifications();
      
      // Marca todas como lidas após 1 segundo (dá tempo de ver)
      setTimeout(async () => {
        await markAllAsRead();
        onBadgeCountChange?.(0);
        loadNotifications(); // Recarrega para atualizar visual
      }, 1000);
    }
  }, [visible, loadNotifications, onBadgeCountChange]);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = async (notification: InAppNotification) => {
    // Marca como lida
    await markAsRead(notification.id);
    
    // Navega baseado no tipo
    navigateByType(notification.type, notification.data);
    
    // Fecha o modal
    onClose();
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    setNotifications([]);
    onBadgeCountChange?.(0);
  };

  // ==========================================
  // NAVEGAÇÃO
  // ==========================================

  const navigateByType = (type: NotificationType, data?: any) => {
    switch (type) {
      case 'DAILY_REMINDER':
      case 'STREAK_REMINDER':
      case 'CHALLENGE_ASSIGNED':
        router.push('/(tabs)/challenges' as any);
        break;
      case 'BADGE_EARNED':
        router.push('/(tabs)/badges' as any);
        break;
      case 'LEVEL_UP':
        router.push('/(tabs)/' as any);
        break;
    }
  };

  // ==========================================
  // RENDERS
  // ==========================================

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="bell-off-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
      <Text style={styles.emptySubtitle}>
        Suas notificações aparecerão aqui
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Notificações</Text>
      <View style={styles.headerActions}>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {renderHeader()}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#20B2AA" />
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationItem
                notification={item}
                onPress={handleNotificationPress}
              />
            )}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#20B2AA"
              />
            }
            contentContainerStyle={
              notifications.length === 0 && styles.emptyList
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
});
