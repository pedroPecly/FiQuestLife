import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
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

  // Fallback para aparelhos antigos com botões físicos onde insets.bottom pode ser 0
  const rawBottom = insets?.bottom ?? 0;
  // Se estivermos em standalone (APK) e o inset for 0, usamos fallback maior
  const isStandalone = Constants.appOwnership !== 'expo';
  const bottomFallback = Platform.OS === 'android' && rawBottom === 0
    ? (isStandalone ? 16 : 10)
    : rawBottom;
  const baseTabBarHeight = 50; // altura base compacta

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
          // Usa fallback em aparelhos antigos para evitar corte por botões físicos
          height: Platform.select({ web: 70, default: baseTabBarHeight + bottomFallback }),
          paddingBottom: Platform.select({ web: 12, default: 4 + bottomFallback }),
          // Espaçamento superior levemente aumentado para dar mais distância
          // entre a nav bar e a área de ação em aparelhos menores
          paddingTop: Platform.select({ web: 12, default: 2 }),
        },
        tabBarLabelStyle: {
          fontSize: Platform.select({ web: 12, default: 9 }),
          fontWeight: '600',
        },
        // Animações de transição entre tabs
        animation: 'shift',
        ...((Platform.OS === 'ios' || Platform.OS === 'android') && {
          // Animação suave no iOS e Android
          animationDuration: 300,
        }),
      }}>
      {/* 1 — Início: hub pessoal do usuário (perfil, stats, conquistas) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      {/* 2 — Explorar: feed social da comunidade */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'compass' : 'compass-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      {/* 3 — Desafios: posição central = maior destaque visual (core loop) */}
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

      {/* 4 — Amigos: social com badge de notificação */}
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

      {/* 5 — Conta: configurações e gerenciamento de conta (extremo direito — padrão universal) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'cog' : 'cog-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      {/* Ocultas da navbar — acessíveis via navegação programática */}
      <Tabs.Screen name="inventory" options={{ href: null }} />
      <Tabs.Screen name="shop"      options={{ href: null }} />
      <Tabs.Screen name="badges"    options={{ href: null }} />
    </Tabs>
  );
}
