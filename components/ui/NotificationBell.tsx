/**
 * ============================================
 * NOTIFICATION BELL - Ícone de Sino
 * ============================================
 * 
 * Ícone de sino com badge count de notificações não lidas.
 * Exibido no header do app.
 * 
 * Features:
 * - Badge vermelho com contador
 * - Animação ao receber nova notificação
 * - Touch feedback
 * 
 * @created 27 de outubro de 2025
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

// ==========================================
// TIPOS
// ==========================================

interface NotificationBellProps {
  unreadCount: number;
  onPress: () => void;
  size?: number;
  color?: string;
}

// ==========================================
// COMPONENTE
// ==========================================

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onPress,
  size = 24,
  color = '#333',
}) => {
  // Animação de shake quando recebe notificação
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const prevCount = useRef(unreadCount);

  useEffect(() => {
    // Se o count aumentou, anima o sino
    if (unreadCount > prevCount.current) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    prevCount.current = unreadCount;
  }, [unreadCount, shakeAnim]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.iconBackground}>
        <Animated.View style={{ transform: [{ rotate: shakeAnim.interpolate({
          inputRange: [-10, 10],
          outputRange: ['-10deg', '10deg'],
        }) }] }}>
          <MaterialCommunityIcons 
            name={unreadCount > 0 ? 'bell' : 'bell-outline'} 
            size={size} 
            color={color} 
          />
        </Animated.View>
      </View>
      
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Animated.Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Animated.Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 4,
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
