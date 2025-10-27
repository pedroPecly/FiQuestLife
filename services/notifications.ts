/**
 * ============================================
 * SERVIÇO DE NOTIFICAÇÕES
 * ============================================
 * 
 * Gerencia todas as notificações do app:
 * - Permissões
 * - Notificações agendadas (lembretes diários)
 * - Notificações instantâneas (badges, level up)
 * - Configurações do usuário
 * 
 * Tecnologia: Expo Notifications
 * @created 27 de outubro de 2025
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { saveNotification } from './notificationCenter';

// ==========================================
// TIPOS
// ==========================================

export type NotificationType = 
  | 'DAILY_REMINDER'    // Lembrete de desafios diários (9h)
  | 'CHALLENGE_ASSIGNED' // Novos desafios atribuídos
  | 'BADGE_EARNED'      // Badge conquistado
  | 'LEVEL_UP'          // Subiu de nível
  | 'STREAK_REMINDER';  // Lembrete de streak (21h)

export interface NotificationData {
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
}

// ==========================================
// CONFIGURAÇÕES GLOBAIS
// ==========================================

/**
 * Define como o app deve se comportar ao receber notificação
 * - shouldShowAlert: mostrar banner/alert
 * - shouldPlaySound: tocar som
 * - shouldSetBadge: atualizar badge no ícone do app
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ==========================================
// CONSTANTES
// ==========================================

const STORAGE_KEY = '@fiquestlife:notifications_enabled';

// ==========================================
// PERMISSÕES
// ==========================================

/**
 * Solicita permissão para enviar notificações
 * Obrigatório para iOS, recomendado para Android
 * 
 * @returns true se permissão concedida, false caso contrário
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  // Notificações não funcionam no simulador/emulador
  if (!Device.isDevice) {
    console.warn('⚠️ Notificações não funcionam no simulador');
    return false;
  }

  // Verifica permissão atual
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Se não tem permissão, solicita
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Se permissão negada
  if (finalStatus !== 'granted') {
    console.warn('❌ Permissão de notificação negada');
    return false;
  }

  // Configurar canal de notificação (Android obrigatório)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'FiQuestLife',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#20B2AA',
      sound: 'default',
      enableVibrate: true,
    });
  }

  console.log('✅ Permissão de notificação concedida');
  return true;
}

/**
 * Verifica se notificações estão habilitadas
 * @returns true se permitidas, false caso contrário
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  return settings.granted;
}

// ==========================================
// NOTIFICAÇÕES AGENDADAS (LEMBRETES)
// ==========================================

/**
 * Agenda lembrete diário de desafios
 * Envia todo dia às 9h da manhã
 * Lembra usuário de completar seus desafios diários
 */
export async function scheduleDailyReminder(): Promise<void> {
  try {
    // Cancela lembretes anteriores para evitar duplicação
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.content.data?.type === 'DAILY_REMINDER') {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }

    // Agenda novo lembrete diário (9h)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Novos Desafios Disponíveis!',
        body: 'Seus desafios diários já estão prontos. Vamos conquistá-los?',
        data: { type: 'DAILY_REMINDER' },
        sound: true,
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });

    console.log('✅ Lembrete diário agendado para 9h');
  } catch (error) {
    console.error('❌ Erro ao agendar lembrete diário:', error);
  }
}

/**
 * Agenda lembrete de streak (final do dia)
 * Envia às 21h se não completou nenhum desafio
 * Evita que usuário perca sua sequência
 */
export async function scheduleStreakReminder(): Promise<void> {
  try {
    // Cancela lembretes anteriores
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.content.data?.type === 'STREAK_REMINDER') {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }

    // Agenda novo lembrete de streak (21h)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Não perca sua sequência!',
        body: 'Complete pelo menos um desafio hoje para manter seu streak!',
        data: { type: 'STREAK_REMINDER' },
        sound: true,
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 0,
      },
    });

    console.log('✅ Lembrete de streak agendado para 21h');
  } catch (error) {
    console.error('❌ Erro ao agendar lembrete de streak:', error);
  }
}

/**
 * Cancela lembrete de streak
 * Chamado quando usuário completa um desafio
 * Evita notificação desnecessária
 */
export async function cancelStreakReminder(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notif of scheduled) {
      if (notif.content.data?.type === 'STREAK_REMINDER') {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        console.log('✅ Lembrete de streak cancelado (desafio completado)');
      }
    }
  } catch (error) {
    console.error('❌ Erro ao cancelar lembrete de streak:', error);
  }
}

/**
 * Cancela todas as notificações agendadas
 * Usado quando usuário desabilita notificações
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Todas as notificações agendadas canceladas');
  } catch (error) {
    console.error('❌ Erro ao cancelar notificações:', error);
  }
}

// ==========================================
// NOTIFICAÇÕES INSTANTÂNEAS
// ==========================================

/**
 * Notifica imediatamente quando usuário conquista badge
 * @param badgeName Nome do badge conquistado
 * @param rarity Raridade (COMMON, RARE, EPIC, LEGENDARY)
 */
export async function notifyBadgeEarned(badgeName: string, rarity: string): Promise<void> {
  try {
    const rarityEmojis: Record<string, string> = {
      COMMON: '⚪',
      RARE: '🔵',
      EPIC: '🟣',
      LEGENDARY: '🟠',
    };

    const emoji = rarityEmojis[rarity] || '🏆';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${emoji} Badge Conquistado!`,
        body: `Parabéns! Você desbloqueou "${badgeName}"`,
        data: { type: 'BADGE_EARNED', badgeName, rarity },
        sound: true,
        badge: 1,
      },
      trigger: null, // Envia imediatamente
    });

    console.log(`✅ Notificação de badge enviada: ${badgeName}`);
  } catch (error) {
    console.error('❌ Erro ao notificar badge:', error);
  }
}

/**
 * Notifica quando usuário sobe de nível
 * @param newLevel Novo nível alcançado
 */
export async function notifyLevelUp(newLevel: number): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Level Up!',
        body: `Incrível! Você subiu para o nível ${newLevel}!`,
        data: { type: 'LEVEL_UP', level: newLevel },
        sound: true,
        badge: 1,
      },
      trigger: null, // Envia imediatamente
    });

    console.log(`✅ Notificação de level up enviada: Nível ${newLevel}`);
  } catch (error) {
    console.error('❌ Erro ao notificar level up:', error);
  }
}

/**
 * Notifica quando novos desafios são atribuídos
 * @param count Número de desafios atribuídos (padrão: 5)
 */
export async function notifyChallengesAssigned(count: number = 5): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Novos Desafios!',
        body: `${count} novos desafios foram atribuídos para você hoje!`,
        data: { type: 'CHALLENGE_ASSIGNED', count },
        sound: true,
        badge: count,
      },
      trigger: null, // Envia imediatamente
    });

    console.log(`✅ Notificação de desafios enviada: ${count} desafios`);
  } catch (error) {
    console.error('❌ Erro ao notificar desafios:', error);
  }
}

// ==========================================
// CONFIGURAÇÕES DO USUÁRIO
// ==========================================

/**
 * Salva preferência de notificações do usuário
 * @param enabled true para ativar, false para desativar
 */
export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));

    if (enabled) {
      // Ativa notificações - agenda lembretes
      await scheduleDailyReminder();
      await scheduleStreakReminder();
      console.log('✅ Notificações ativadas');
    } else {
      // Desativa notificações - cancela todos os lembretes
      await cancelAllScheduledNotifications();
      console.log('✅ Notificações desativadas');
    }
  } catch (error) {
    console.error('❌ Erro ao salvar preferência de notificações:', error);
  }
}

/**
 * Verifica se usuário quer receber notificações
 * @returns true se ativado, false se desativado
 */
export async function getNotificationsEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : true; // Default: ativado
  } catch (error) {
    console.error('❌ Erro ao carregar preferência de notificações:', error);
    return true; // Default em caso de erro
  }
}

// ==========================================
// LISTENERS
// ==========================================

/**
 * Salva notificação recebida no histórico local (in-app)
 * Chamado automaticamente quando notificação chega
 */
async function saveNotificationToHistory(notification: Notifications.Notification) {
  try {
    const { title, body, data } = notification.request.content;
    
    await saveNotification({
      type: (data?.type as NotificationType) || 'DAILY_REMINDER',
      title: title || 'Notificação',
      body: body || '',
      data: data,
    });
  } catch (error) {
    console.error('Erro ao salvar notificação no histórico:', error);
  }
}

/**
 * Adiciona listener para quando usuário toca na notificação
 * Usado para navegar para tela apropriada
 * 
 * @param callback Função chamada quando usuário toca
 * @returns Subscription (para cleanup)
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Adiciona listener para notificações recebidas (app aberto)
 * Usado para atualizar UI quando notificação chega
 * TAMBÉM salva notificação no histórico in-app
 * 
 * @param callback Função chamada quando notificação chega
 * @returns Subscription (para cleanup)
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener((notification) => {
    // Salva no histórico in-app
    saveNotificationToHistory(notification);
    
    // Chama callback do usuário
    callback(notification);
  });
}

// ==========================================
// UTILITÁRIOS
// ==========================================

/**
 * Lista todas as notificações agendadas (debug)
 * @returns Array de notificações agendadas
 */
export async function getScheduledNotifications() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  console.log('📋 Notificações agendadas:', scheduled.length);
  scheduled.forEach((notif) => {
    console.log(`  - ${notif.content.title} (${notif.content.data?.type})`);
  });
  return scheduled;
}
