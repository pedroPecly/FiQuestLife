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
 * @updated 6 de dezembro de 2025 - Correções para APK standalone
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ==========================================
// TIPOS
// ==========================================

export type NotificationType = 
  | 'DAILY_REMINDER'    // Lembrete de desafios diários (9h)
  | 'CHALLENGE_ASSIGNED' // Novos desafios atribuídos
  | 'BADGE_EARNED'      // Badge conquistado
  | 'LEVEL_UP'          // Subiu de nível
  | 'STREAK_REMINDER'   // Lembrete de streak (21h)
  | 'FRIEND_REQUEST';   // Solicitação de amizade recebida

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
// PERMISSÕES E CONFIGURAÇÃO DE CANAL
// ==========================================

/**
 * CRÍTICO: Garante que o canal de notificação Android existe
 * Deve ser chamado ANTES de qualquer outra operação de notificação
 * 
 * Em APKs standalone, o canal DEVE existir antes de receber notificações
 * No Expo Go isso não é necessário (canais pré-configurados)
 * 
 * @returns Promise<void>
 */
export async function ensureNotificationChannelExists(): Promise<void> {
  // Canal só é necessário no Android
  if (Platform.OS !== 'android') {
    return;
  }
  
  try {
    // Verifica se canal já existe
    const existingChannel = await Notifications.getNotificationChannelAsync('default');
    
    if (existingChannel) {
      console.log('[CANAL] ✅ Canal de notificação já existe:', existingChannel.name);
      return;
    }
    
    // Criar canal se não existir
    console.log('[CANAL] Criando canal de notificação Android...');
    
    await Notifications.setNotificationChannelAsync('default', {
      name: 'FiQuestLife',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#20B2AA',
      sound: 'default',
      enableVibrate: true,
      showBadge: true,
      enableLights: true,
    });
    
    console.log('[CANAL] ✅ Canal de notificação criado com sucesso');
    
    // Verificar se foi realmente criado
    const verifyChannel = await Notifications.getNotificationChannelAsync('default');
    if (verifyChannel) {
      console.log('[CANAL] ✅ Canal verificado:', verifyChannel.name);
    } else {
      console.error('[CANAL] ❌ ERRO: Canal não foi criado!');
    }
  } catch (error) {
    console.error('[CANAL] ❌ Erro ao criar canal:', error);
    throw error;
  }
}

/**
 * Solicita permissão para enviar notificações
 * Obrigatório para iOS, recomendado para Android
 * 
 * IMPORTANTE: Esta função NÃO cria mais o canal Android
 * O canal deve ser criado ANTES através de ensureNotificationChannelExists()
 * 
 * @returns true se permissão concedida, false caso contrário
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  // Emuladores/simuladores podem ter comportamento limitado para push tokens,
  // mas ainda podemos tentar configurar permissões para testar notificações locais
  if (!Device.isDevice) {
    console.warn('⚠️ Você está em um simulador/emulador. Push tokens podem não funcionar.');
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

  // NOTA: Canal Android é criado em ensureNotificationChannelExists()
  // Não criamos aqui para evitar problemas de timing

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
    // Cancela TODOS os lembretes do tipo DAILY_REMINDER para evitar duplicação
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    let cancelledCount = 0;
    
    for (const notif of scheduled) {
      if (notif.content.data?.type === 'DAILY_REMINDER') {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        cancelledCount++;
      }
    }
    
    if (cancelledCount > 0) {
      console.log(`🧹 Cancelados ${cancelledCount} lembretes diários antigos`);
    }

    // Agenda novo lembrete diário (9h)
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Novos Desafios Disponíveis!',
        body: 'Seus desafios diários já estão prontos. Vamos conquistá-los?',
        data: { type: 'DAILY_REMINDER' },
        channelId: 'default',
        sound: true,
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });

    console.log(`✅ Lembrete diário agendado para 9h (ID: ${notificationId})`);
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
    // Cancela TODOS os lembretes do tipo STREAK_REMINDER para evitar duplicação
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    let cancelledCount = 0;
    
    for (const notif of scheduled) {
      if (notif.content.data?.type === 'STREAK_REMINDER') {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        cancelledCount++;
      }
    }
    
    if (cancelledCount > 0) {
      console.log(`🧹 Cancelados ${cancelledCount} lembretes de streak antigos`);
    }

    // Agenda novo lembrete de streak (21h)
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Não perca sua sequência!',
        body: 'Complete pelo menos um desafio hoje para manter seu streak!',
        data: { 
          type: 'STREAK_REMINDER',
          saveToFeed: true, // Flag para salvar no feed ao receber
        },
        channelId: 'default',
        sound: true,
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 21,
        minute: 0,
      },
    });

    console.log(`✅ Lembrete de streak agendado para 21h (ID: ${notificationId})`);
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
 * Notifica imediatamente quando usuário conquista conquista
 * @param badgeName Nome da conquista conquistada
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

    // Envia notificação push (será salva automaticamente pelo listener)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${emoji} Conquista Desbloqueada!`,
        body: `Parabéns! Você desbloqueou "${badgeName}"`,
        data: { type: 'BADGE_EARNED', badgeName, rarity },
        channelId: 'default',
        sound: true,
        badge: 1,
      },
      trigger: null, // Envia imediatamente
    });

    console.log(`✅ Notificação de conquista enviada: ${badgeName}`);
  } catch (error) {
    console.error('❌ Erro ao notificar conquista:', error);
  }
}

/**
 * Notifica quando usuário sobe de nível
 * @param newLevel Novo nível alcançado
 */
export async function notifyLevelUp(newLevel: number): Promise<void> {
  try {
    // Envia notificação push (será salva automaticamente pelo listener)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 Level Up!',
        body: `Incrível! Você subiu para o nível ${newLevel}!`,
        data: { type: 'LEVEL_UP', level: newLevel },
        channelId: 'default',
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
 * 
 * @param callback Função chamada quando notificação chega
 * @returns Subscription (para cleanup)
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Notifica quando recebe uma solicitação de amizade
 * @param senderName Nome de quem enviou a solicitação
 * @param senderUsername Username de quem enviou
 */
export async function notifyFriendRequest(senderName: string, senderUsername: string): Promise<void> {
  try {
    // Envia notificação push (será salva automaticamente pelo listener)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '👥 Nova Solicitação de Amizade',
        body: `${senderName} (@${senderUsername}) quer ser seu amigo!`,
        data: { 
          type: 'FRIEND_REQUEST', 
          senderName, 
          senderUsername,
        },
        channelId: 'default',
        sound: true,
        badge: 1,
      },
      trigger: null, // Envia imediatamente
    });

    console.log(`✅ Notificação de solicitação enviada: ${senderName}`);
  } catch (error) {
    console.error('❌ Erro ao notificar solicitação de amizade:', error);
  }
}

/**
 * Notifica quando recebe uma curtida (local)
 * @param activityOwnerId ID do dono da atividade
 * @param activityId ID da atividade
 * @param likerName Nome de quem curtiu
 * @param activityDescription Descrição da atividade
 */
export async function notifyActivityLike(
  activityOwnerId: string,
  activityId: string,
  likerName: string,
  activityDescription: string
): Promise<void> {
  try {
    // Envia notificação local
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nova curtida! ❤️',
        body: `${likerName} curtiu sua conquista: ${activityDescription}`,
        data: {
          type: 'ACTIVITY_LIKE',
          activityId,
          likerName,
          activityDescription,
        },
        channelId: 'default',
        sound: true,
        badge: 1,
      },
      trigger: null, // Envia imediatamente
    });

    console.log(`✅ Notificação local de curtida enviada`);
  } catch (error) {
    console.error('❌ Erro ao notificar curtida:', error);
  }
}

/**
 * Notifica quando recebe um comentário (local)
 * @param activityOwnerId ID do dono da atividade
 * @param activityId ID da atividade
 * @param commenterName Nome de quem comentou
 * @param commentContent Conteúdo do comentário
 * @param activityDescription Descrição da atividade
 */
export async function notifyActivityComment(
  activityOwnerId: string,
  activityId: string,
  commenterName: string,
  commentContent: string,
  activityDescription: string
): Promise<void> {
  try {
    // Envia notificação local
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Novo comentário! 💬',
        body: `${commenterName} comentou: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
        data: {
          type: 'ACTIVITY_COMMENT',
          activityId,
          commenterName,
          commentContent,
          activityDescription,
        },
        channelId: 'default',
        sound: true,
        badge: 1,
      },
      trigger: null, // Envia imediatamente
    });

    console.log(`✅ Notificação local de comentário enviada`);
  } catch (error) {
    console.error('❌ Erro ao notificar comentário:', error);
  }
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
