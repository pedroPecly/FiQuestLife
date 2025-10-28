/**
 * ============================================
 * HOOK DE NOTIFICAÇÕES
 * ============================================
 * 
 * Hook personalizado para gerenciar notificações globalmente.
 * - Setup automático ao montar app
 * - Listeners para receber e responder notificações
 * - Navegação inteligente ao tocar em notificação
 * 
 * Uso: Chamar no _layout.tsx (root do app)
 * @created 27 de outubro de 2025
 */

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { saveNotification } from '../services/notificationCenter';
import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getNotificationsEnabled,
  requestNotificationPermissions,
  scheduleDailyReminder,
  scheduleStreakReminder,
} from '../services/notifications';

export function useNotifications() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    setupNotifications();

    // Listener para notificações recebidas (app aberto)
    notificationListener.current = addNotificationReceivedListener(
      async (notification) => {
        const content = notification.request.content;
        console.log('📬 Notificação recebida:', content.title);
        
        // Se a notificação tem flag saveToFeed, salva no feed local
        if (content.data?.saveToFeed && content.data?.type) {
          await saveNotification({
            type: content.data.type as any,
            title: content.title || '',
            body: content.body || '',
            data: content.data,
          });
          console.log('💾 Notificação salva no feed local');
        }
      }
    );

    // Listener para quando usuário toca na notificação
    responseListener.current = addNotificationResponseListener(async (response) => {
      const data = response.notification.request.content.data;
      const content = response.notification.request.content;
      console.log('👆 Usuário tocou na notificação:', data?.type);
      
      // Salva notificações agendadas quando usuário interage com elas
      // (Para o caso de notificações que chegaram quando app estava fechado)
      if (data?.saveToFeed && data?.type) {
        await saveNotification({
          type: data.type as any,
          title: content.title || '',
          body: content.body || '',
          data: data,
        });
        console.log('💾 Notificação agendada salva no feed ao tocar');
      }
      
      handleNotificationTap(data);
    });

    // Cleanup ao desmontar
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  /**
   * Configura notificações ao iniciar app
   * - Solicita permissões
   * - Agenda lembretes se habilitado
   */
  const setupNotifications = async () => {
    try {
      // Solicita permissões
      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);

      if (granted) {
        // Verifica se usuário quer receber notificações
        const enabled = await getNotificationsEnabled();
        
        if (enabled) {
          // Agenda lembretes diários
          await scheduleDailyReminder();
          await scheduleStreakReminder();
          console.log('✅ Notificações configuradas e agendadas');
        } else {
          console.log('ℹ️ Notificações desabilitadas pelo usuário');
        }
      } else {
        console.log('⚠️ Permissão de notificação não concedida');
      }

      setIsReady(true);
    } catch (error) {
      console.error('❌ Erro ao configurar notificações:', error);
      setIsReady(true);
    }
  };

  /**
   * Navega para tela apropriada quando usuário toca na notificação
   * @param data Dados da notificação
   */
  const handleNotificationTap = (data: any) => {
    if (!data?.type) return;

    switch (data.type) {
      case 'DAILY_REMINDER':
      case 'CHALLENGE_ASSIGNED':
      case 'STREAK_REMINDER':
        // Navega para tela de desafios
        router.push('/(tabs)/challenges');
        break;

      case 'BADGE_EARNED':
        // Navega para tela de badges
        router.push('/(tabs)/badges');
        break;

      case 'LEVEL_UP':
        // Navega para perfil (home)
        router.push('/(tabs)' as any);
        break;

      default:
        console.log('ℹ️ Tipo de notificação desconhecido:', data.type);
    }
  };

  return {
    permissionGranted,
    isReady,
  };
}
