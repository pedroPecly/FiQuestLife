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
  ensureNotificationChannelExists,
  getNotificationsEnabled,
  requestNotificationPermissions,
} from '../services/notifications';
import { registerPushToken } from '../services/pushToken';

// Flag global para garantir que setup só execute uma vez na vida do app
let globalSetupCompleted = false;

export function useNotifications() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  /**
   * Configura notificações ao iniciar app
   * ORDEM CRÍTICA para APK standalone:
   * 1. Criar canal Android (obrigatório)
   * 2. Solicitar permissões
   * 3. Registrar push token (SEMPRE, não usar cache)
   * 4. Agendar lembretes
   */
  const setupNotifications = async () => {
    try {
      console.log('===============================================');
      console.log('🔔 INICIANDO SETUP DE NOTIFICAÇÕES');
      console.log('📅 Timestamp:', new Date().toISOString());
      console.log('===============================================');
      
      // PASSO 1: CRÍTICO - Criar canal Android PRIMEIRO
      // Em APKs standalone, o canal DEVE existir antes de qualquer notificação
      console.log('📋 Passo 1/4: Criando canal Android...');
      await ensureNotificationChannelExists();
      console.log('✅ Passo 1/4: Canal verificado/criado');
      
      // PASSO 2: Solicitar permissões
      console.log('📋 Passo 2/4: Solicitando permissões...');
      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);
      
      if (!granted) {
        console.log('⚠️ Permissão de notificação não concedida - continuando sem push');
        setIsReady(true);
        return;
      }
      console.log('✅ Passo 2/4: Permissões concedidas');

      // PASSO 3: Registrar push token no backend (SEMPRE, não confiar em cache)
      // Token pode mudar entre builds, reinstalações, etc.
      console.log('📋 Passo 3/4: Registrando push token no backend...');
      const tokenRegistered = await registerPushToken();
      
      if (tokenRegistered) {
        console.log('✅ Passo 3/4: Token registrado com sucesso');
      } else {
        console.warn('⚠️ Passo 3/4: Falha ao registrar token - push pode não funcionar');
        console.warn('⚠️ Isso é normal em ambiente de dev ou se backend estiver offline');
      }
      
      // PASSO 4: Verificar preferências e agendar lembretes
      console.log('📋 Passo 4/4: Verificando preferências...');
      const enabled = await getNotificationsEnabled();
      
      if (enabled) {
        console.log('✅ Passo 4/4: Preferências verificadas');
        console.log('✅✅✅ SETUP DE NOTIFICAÇÕES COMPLETO');
      } else {
        console.log('ℹ️ Notificações desabilitadas pelo usuário');
      }
      console.log('===============================================');

      setIsReady(true);
    } catch (error) {
      console.error('===============================================');
      console.error('❌ ERRO CRÍTICO ao configurar notificações:', error);
      console.error('===============================================');
      setIsReady(true);
    }
  };

  useEffect(() => {
    // Evita setup duplicado usando flag global
    if (globalSetupCompleted) {
      console.log('⚠️ Setup de notificações já foi executado globalmente, pulando...');
      setIsReady(true);
      return;
    }
    
    globalSetupCompleted = true;
    setupNotifications();

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

    // Listener para notificações recebidas (app aberto)
    notificationListener.current = addNotificationReceivedListener(
      async (notification) => {
        const content = notification.request.content;
        const timestamp = new Date().toISOString();
        
        console.log('===============================================');
        console.log('📦 [PUSH RECEBIDO] APP ABERTO');
        console.log('🕒 Timestamp:', timestamp);
        console.log('📝 Título:', content.title);
        console.log('📝 Corpo:', content.body);
        console.log('📝 Som:', content.sound);
        console.log('📝 Badge:', content.badge);
        console.log('📝 Dados completos:', JSON.stringify(content.data, null, 2));
        console.log('===============================================');
        
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
        
        console.log('📑 Tipo extraído:', notificationType);
        console.log('📑 Salvando para usuário:', user.id);
        
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
        
        console.log('✅ Notificação salva localmente com tipo:', notificationType);
        console.log('===============================================');
      }
    );

    // Listener para quando usuário toca na notificação
    responseListener.current = addNotificationResponseListener(async (response) => {
      const data = response.notification.request.content.data;
      const content = response.notification.request.content;
      console.log('===============================================');
      console.log('👆 USUÁRIO TOCOU NA NOTIFICAÇÃO');
      console.log('===============================================');
      console.log('📝 Título:', content.title);
      console.log('📝 Tipo:', data?.type);
      console.log('📝 Dados completos:', JSON.stringify(data, null, 2));
      console.log('===============================================');
      
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
      
      console.log('📑 Tipo extraído para salvar:', notificationType);
      
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
      
      console.log('✅ Notificação do toque salva com tipo:', notificationType);
      console.log('===============================================');
      
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

  return {
    permissionGranted,
    isReady,
  };
}
