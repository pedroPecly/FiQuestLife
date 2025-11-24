/**
 * ============================================
 * HOOK DE NOTIFICAÇÕES
 * ============================================
 * 
 * Hook personalizado para gerenciar notificações globalmente.
 * - Setup automático ao montar app
 * - Listeners para receber e responder notificações
 * - Navegação inteligente ao tocar em notificação
 * - Salva notificações localmente (AsyncStorage)
 * 
 * Uso: Chamar no _layout.tsx (root do app)
 * @created 27 de outubro de 2025
 */

import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { authStorage } from '../services/auth';
import { getLocalNotifications, saveLocalNotification } from '../services/localNotificationStorage';
import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getNotificationsEnabled,
  requestNotificationPermissions,
  scheduleDailyReminder,
  scheduleStreakReminder,
} from '../services/notifications';
import { registerPushToken } from '../services/pushToken';

export function useNotifications() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const setupCompleted = useRef(false); // Flag para evitar setup múltiplo

  useEffect(() => {
    // Evita setup duplicado
    if (setupCompleted.current) {
      console.log('⚠️ Setup de notificações já foi executado, pulando...');
      return;
    }
    
    setupCompleted.current = true;
    setupNotifications();

    // Listener para notificações recebidas (app aberto)
    notificationListener.current = addNotificationReceivedListener(
      async (notification) => {
        const content = notification.request.content;
        console.log('📬 Notificação recebida:', content.title);
        console.log('📬 Dados da notificação:', JSON.stringify(content.data));
        
        // Pega userId do usuário logado
        const user = await authStorage.getUser();
        if (!user) {
          console.log('⚠️ Usuário não logado, notificação não salva');
          return;
        }
        
        // Verificar se já existe uma notificação similar recente (evitar duplicatas)
        const existingNotifications = await getLocalNotifications(user.id, false);
        const similarNotification = existingNotifications.find(n => 
          n.type === content.data?.type && 
          n.title === content.title && 
          n.message === content.body &&
          // Verificar se foi criada nos últimos 30 segundos
          (Date.now() - new Date(n.createdAt).getTime()) < 30000
        );
        
        if (similarNotification) {
          console.log('⚠️ Notificação duplicada detectada, ignorando:', content.title);
          return;
        }
        
        // Salvar notificação localmente
        const notificationData = content.data as any;
        const notificationType = notificationData?.type;
        
        console.log('📬 Tipo extraído:', notificationType);
        
        if (!notificationType) {
          console.warn('⚠️ Notificação sem tipo! Dados:', JSON.stringify(notificationData));
        }
        
        await saveLocalNotification({
          userId: user.id,
          type: notificationType || 'CHALLENGE_COMPLETED',
          title: content.title || 'Notificação',
          message: content.body || '',
          data: notificationData,
        });
        
        console.log('💾 Notificação salva localmente com tipo:', notificationType);
      }
    );

    // Listener para quando usuário toca na notificação
    responseListener.current = addNotificationResponseListener(async (response) => {
      const data = response.notification.request.content.data;
      const content = response.notification.request.content;
      console.log('👆 Usuário tocou na notificação');
      console.log('👆 Tipo:', data?.type);
      console.log('👆 Dados completos:', JSON.stringify(data));
      
      // Pega userId do usuário logado
      const user = await authStorage.getUser();
      if (!user) {
        console.log('⚠️ Usuário não logado, notificação não salva');
        handleNotificationTap(data);
        return;
      }
      
      // Salvar notificação localmente se ainda não foi salva
      const notificationData = data as any;
      const notificationType = notificationData?.type;
      
      console.log('👆 Tipo extraído para salvar:', notificationType);
      
      if (!notificationType) {
        console.warn('⚠️ Notificação tocada sem tipo! Dados:', JSON.stringify(notificationData));
      }
      
      await saveLocalNotification({
        userId: user.id,
        type: notificationType || 'CHALLENGE_COMPLETED',
        title: content.title || 'Notificação',
        message: content.body || '',
        data: notificationData,
      });
      
      console.log('💾 Notificação do toque salva com tipo:', notificationType);
      
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
        // Registra o push token no backend
        await registerPushToken();
        
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
