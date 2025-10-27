/**
 * ============================================
 * NOTIFICATION ITEM - Item de Notificação
 * ============================================
 * 
 * Representa uma notificação individual no feed.
 * 
 * Features:
 * - Visual diferente para lida/não lida
 * - Ícone colorido por tipo
 * - Timestamp relativo
 * - Touch para navegar
 * 
 * @created 27 de outubro de 2025
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatTimestamp, NOTIFICATION_COLORS, type InAppNotification } from '../../services/notificationCenter';

// ==========================================
// TIPOS
// ==========================================

interface NotificationItemProps {
  notification: InAppNotification;
  onPress: (notification: InAppNotification) => void;
}

// ==========================================
// COMPONENTE
// ==========================================

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const isUnread = !notification.read;
  const iconColor = NOTIFICATION_COLORS[notification.type];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isUnread && styles.unreadContainer,
      ]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      {/* Ícone */}
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
        <Text style={styles.iconEmoji}>{notification.icon}</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={[styles.title, isUnread && styles.unreadTitle]}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.timestamp}>
          {formatTimestamp(notification.timestamp)}
        </Text>
      </View>

      {/* Indicador de não lida */}
      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadContainer: {
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#333',
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    marginLeft: 8,
    marginTop: 6,
  },
});
