/**
 * ============================================
 * LOCAL NOTIFICATION STORAGE SERVICE
 * ============================================
 * 
 * Gerencia notificações armazenadas localmente no dispositivo.
 * As notificações são salvas apenas no AsyncStorage e filtradas por usuário.
 * 
 * Principais funcionalidades:
 * - Salvar notificação recebida (com userId)
 * - Buscar notificações do usuário logado
 * - Marcar como lida
 * - Deletar notificação
 * - Limpar notificações de um usuário específico (troca de conta)
 * - Contar não lidas do usuário logado
 * 
 * IMPORTANTE: Notificações persistem entre sessões do mesmo usuário
 * e são filtradas por userId para suportar múltiplas contas no mesmo dispositivo.
 * 
 * @created 21 de novembro de 2025
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ==========================================
// CONSTANTES
// ==========================================

const STORAGE_KEY = '@fiquestlife:local_notifications';
const MAX_NOTIFICATIONS_PER_USER = 100; // Máximo por usuário

// ==========================================
// TIPOS
// ==========================================

export type LocalNotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'ACTIVITY_LIKE'
  | 'ACTIVITY_COMMENT'
  | 'BADGE_EARNED'
  | 'LEVEL_UP'
  | 'CHALLENGE_COMPLETED'
  | 'STREAK_MILESTONE';

export interface LocalNotification {
  id: string;
  userId: string; // NOVO: ID do usuário dono da notificação
  type: LocalNotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

// ==========================================
// FUNÇÕES AUXILIARES INTERNAS
// ==========================================

/**
 * Buscar TODAS as notificações (de todos os usuários)
 */
async function getAllNotifications(): Promise<LocalNotification[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('❌ Erro ao buscar notificações:', error);
    return [];
  }
}

/**
 * Salvar TODAS as notificações (de todos os usuários)
 */
async function saveAllNotifications(notifications: LocalNotification[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('❌ Erro ao salvar notificações:', error);
  }
}

// ==========================================
// FUNÇÕES PRINCIPAIS (PÚBLICAS)
// ==========================================

/**
 * Buscar notificações do usuário logado
 * @param userId - ID do usuário logado
 * @param onlyUnread - Se true, retorna apenas não lidas
 * @returns Array de notificações do usuário
 */
export async function getLocalNotifications(userId: string, onlyUnread = false): Promise<LocalNotification[]> {
  try {
    const allNotifications = await getAllNotifications();
    
    // Filtra notificações do usuário
    let userNotifications = allNotifications.filter(n => n.userId === userId);
    
    // Ordena por data (mais recentes primeiro)
    userNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    if (onlyUnread) {
      return userNotifications.filter(n => !n.read);
    }

    return userNotifications;
  } catch (error) {
    console.error('❌ Erro ao buscar notificações locais:', error);
    return [];
  }
}

/**
 * Salvar nova notificação
 * @param notification - Dados da notificação (deve incluir userId)
 */
export async function saveLocalNotification(
  notification: Omit<LocalNotification, 'id' | 'createdAt' | 'read'>
): Promise<void> {
  try {
    const allNotifications = await getAllNotifications();
    
    const newNotification: LocalNotification = {
      ...notification,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Adiciona nova notificação
    allNotifications.unshift(newNotification);
    
    // Limita notificações por usuário (mantém apenas as 100 mais recentes de cada usuário)
    const notificationsByUser = new Map<string, LocalNotification[]>();
    
    allNotifications.forEach(notif => {
      if (!notificationsByUser.has(notif.userId)) {
        notificationsByUser.set(notif.userId, []);
      }
      notificationsByUser.get(notif.userId)!.push(notif);
    });
    
    // Limita a MAX_NOTIFICATIONS_PER_USER por usuário
    const limitedNotifications: LocalNotification[] = [];
    notificationsByUser.forEach((userNotifs) => {
      limitedNotifications.push(...userNotifs.slice(0, MAX_NOTIFICATIONS_PER_USER));
    });
    
    await saveAllNotifications(limitedNotifications);
    console.log('✅ Notificação salva localmente:', newNotification.title);
  } catch (error) {
    console.error('❌ Erro ao salvar notificação local:', error);
  }
}

/**
 * Marcar notificação como lida
 * @param userId - ID do usuário logado
 * @param notificationId - ID da notificação
 */
export async function markLocalNotificationAsRead(userId: string, notificationId: string): Promise<void> {
  try {
    const allNotifications = await getAllNotifications();
    const updated = allNotifications.map(n =>
      n.id === notificationId && n.userId === userId ? { ...n, read: true } : n
    );
    await saveAllNotifications(updated);
    console.log('✅ Notificação marcada como lida:', notificationId);
  } catch (error) {
    console.error('❌ Erro ao marcar notificação como lida:', error);
  }
}

/**
 * Marcar todas as notificações do usuário como lidas
 * @param userId - ID do usuário logado
 */
export async function markAllLocalNotificationsAsRead(userId: string): Promise<void> {
  try {
    const allNotifications = await getAllNotifications();
    const updated = allNotifications.map(n => 
      n.userId === userId ? { ...n, read: true } : n
    );
    await saveAllNotifications(updated);
    console.log('✅ Todas as notificações do usuário marcadas como lidas');
  } catch (error) {
    console.error('❌ Erro ao marcar todas como lidas:', error);
  }
}

/**
 * Deletar uma notificação específica
 * @param userId - ID do usuário logado (segurança)
 * @param notificationId - ID da notificação
 */
export async function deleteLocalNotification(userId: string, notificationId: string): Promise<void> {
  try {
    const allNotifications = await getAllNotifications();
    const updated = allNotifications.filter(n => 
      !(n.id === notificationId && n.userId === userId)
    );
    await saveAllNotifications(updated);
    console.log('✅ Notificação deletada:', notificationId);
  } catch (error) {
    console.error('❌ Erro ao deletar notificação:', error);
  }
}

/**
 * Limpar notificações de um usuário específico (trocar de conta)
 * @param userId - ID do usuário a ter notificações removidas
 */
export async function clearUserNotifications(userId: string): Promise<void> {
  try {
    const allNotifications = await getAllNotifications();
    const updated = allNotifications.filter(n => n.userId !== userId);
    await saveAllNotifications(updated);
    console.log('✅ Notificações do usuário removidas:', userId);
  } catch (error) {
    console.error('❌ Erro ao limpar notificações do usuário:', error);
  }
}

/**
 * Contar notificações não lidas do usuário
 * @param userId - ID do usuário logado
 * @returns Número de notificações não lidas
 */
export async function getLocalUnreadCount(userId: string): Promise<number> {
  try {
    const notifications = await getLocalNotifications(userId, true);
    return notifications.length;
  } catch (error) {
    console.error('❌ Erro ao contar não lidas:', error);
    return 0;
  }
}
