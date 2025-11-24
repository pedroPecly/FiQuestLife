import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFriendRequestNotifications } from '../../hooks/useFriendRequestNotifications';
import { friendService } from '../../services/friend';

export default function TabLayout() {
  // Hook que verifica novas solicitações de amizade periodicamente
  useFriendRequestNotifications();
  
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadPendingRequests();

    // Atualiza a cada 30 segundos
    const interval = setInterval(loadPendingRequests, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Configura visual da navigation bar no Android para ficar consistente
    // com a tab bar do app (cores / contraste dos botões do sistema).
    if (Platform.OS === 'android') {
      (async () => {
        try {
          await NavigationBar.setBackgroundColorAsync('#FFFFFF');
          await NavigationBar.setButtonStyleAsync('dark');
        } catch (err) {
          // ignore errors in environments where navigation bar API não está disponível
        }
      })();
    }
  }, []);

  const loadPendingRequests = async () => {
    try {
      const requests = await friendService.getPendingRequests();
      setPendingRequestsCount(requests.length);
    } catch (error) {
      // Silently fail
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#20B2AA',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          // Ajusta a altura/padding considerando safe area do dispositivo (gestos / navbar)
          // Reduzimos a base para uma nav bar mais compacta
          height: Platform.select({ web: 70, default: 50 + (insets.bottom || 0) }),
          paddingBottom: Platform.select({ web: 12, default: 8 + (insets.bottom || 0) }),
          // Espaçamento superior reduzido para aproximar os ícones do topo
          paddingTop: Platform.select({ web: 12, default: 8 }),
        },
        tabBarLabelStyle: {
          fontSize: Platform.select({ web: 12, default: 11 }),
          fontWeight: '600',
        },
        // Animações de transição entre tabs
        animation: 'shift',
        ...((Platform.OS === 'ios' || Platform.OS === 'android') && {
          // Animação suave no iOS e Android
          animationDuration: 300,
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'home' : 'home-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: 'Desafios',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'trophy' : 'trophy-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: 'Conquistas',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'shield-star' : 'shield-star-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Amigos',
          tabBarBadge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'account-group' : 'account-group-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Usuário',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? 'account' : 'account-outline'} 
              size={28} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
