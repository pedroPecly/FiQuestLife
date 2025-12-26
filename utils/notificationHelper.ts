/**
 * ============================================
 * NOTIFICATION HELPER
 * ============================================
 * 
 * Utilitários para gerenciar notificações de forma consistente
 * Centraliza a lógica de salvar notificações localmente
 * 
 * @created 23 de dezembro de 2025
 */

import { authStorage } from '../services/auth';
import {
    LocalNotificationType,
    getLocalNotifications,
    saveLocalNotification,
} from '../services/localNotificationStorage';

// ==========================================
// TIPOS
// ==========================================

export interface NotificationData {
  type: LocalNotificationType;
  title: string;
  message: string;
  data?: any;
}

// ==========================================
// FUNÇÕES PRINCIPAIS
// ==========================================

/**
 * Salva notificação localmente para o usuário logado
 * Verifica duplicatas antes de salvar
 * 
 * @param notification - Dados da notificação
 * @returns true se salvou com sucesso, false se usuário não logado ou erro
 * 
 * @example
 * await saveNotificationForCurrentUser({
 *   type: 'LEVEL_UP',
 *   title: 'Nível Aumentado! 🎉',
 *   message: 'Você chegou ao nível 5!',
 *   data: { level: 5 }
 * });
 */
export async function saveNotificationForCurrentUser(
  notification: NotificationData
): Promise<boolean> {
  try {
    // Verifica se usuário está logado
    const user = await authStorage.getUser();
    
    if (!user) {
      console.warn('[NOTIFICATION HELPER] ⚠️ Usuário não logado - notificação não salva');
      return false;
    }
    
    // Verifica duplicatas recentes (últimos 30 segundos)
    const existingNotifications = await getLocalNotifications(user.id, false);
    const isDuplicate = existingNotifications.some(n => 
      n.type === notification.type && 
      n.title === notification.title && 
      n.message === notification.message &&
      (Date.now() - new Date(n.createdAt).getTime()) < 30000
    );
    
    if (isDuplicate) {
      console.warn('[NOTIFICATION HELPER] ⚠️ Notificação duplicada detectada, ignorando');
      return false;
    }
    
    // Salva notificação
    await saveLocalNotification({
      userId: user.id,
      ...notification,
    });
    
    console.log('[NOTIFICATION HELPER] ✅ Notificação salva:', {
      type: notification.type,
      title: notification.title,
      userId: user.id,
    });
    
    return true;
  } catch (error) {
    console.error('[NOTIFICATION HELPER] ❌ Erro ao salvar notificação:', error);
    return false;
  }
}

/**
 * Salva múltiplas notificações de uma vez
 * Útil quando backend retorna array de notificações
 * 
 * @param notifications - Array de notificações
 * @returns Número de notificações salvas com sucesso
 */
export async function saveMultipleNotifications(
  notifications: NotificationData[]
): Promise<number> {
  let savedCount = 0;
  
  for (const notification of notifications) {
    const saved = await saveNotificationForCurrentUser(notification);
    if (saved) savedCount++;
  }
  
  console.log(`[NOTIFICATION HELPER] 📊 ${savedCount}/${notifications.length} notificações salvas`);
  
  return savedCount;
}

/**
 * Processa notificação retornada pelo backend e salva localmente
 * Backend pode retornar notificação em diferentes formatos
 * Esta função normaliza e salva
 * 
 * @param backendNotification - Notificação retornada pelo backend
 * @returns true se processou e salvou com sucesso
 */
export async function processBackendNotification(
  backendNotification: any
): Promise<boolean> {
  if (!backendNotification) {
    return false;
  }
  
  try {
    // Extrai campos necessários (formato pode variar)
    const notification: NotificationData = {
      type: backendNotification.type || 'CHALLENGE_COMPLETED',
      title: backendNotification.title || 'Notificação',
      message: backendNotification.message || backendNotification.body || '',
      data: backendNotification.data || {},
    };
    
    return await saveNotificationForCurrentUser(notification);
  } catch (error) {
    console.error('[NOTIFICATION HELPER] ❌ Erro ao processar notificação do backend:', error);
    return false;
  }
}

// ==========================================
// HELPERS ESPECÍFICOS POR TIPO
// ==========================================

/**
 * Cria e salva notificação de level up
 */
export async function notifyLevelUp(level: number): Promise<boolean> {
  return saveNotificationForCurrentUser({
    type: 'LEVEL_UP',
    title: 'Nível Aumentado! 🎉',
    message: `Parabéns! Você chegou ao nível ${level}!`,
    data: { level },
  });
}

/**
 * Cria e salva notificação de badge conquistado
 */
export async function notifyBadgeEarned(badgeName: string, badgeDescription: string): Promise<boolean> {
  return saveNotificationForCurrentUser({
    type: 'BADGE_EARNED',
    title: 'Nova Conquista! 🏆',
    message: `Você desbloqueou: ${badgeName}`,
    data: { badgeName, badgeDescription },
  });
}

/**
 * Cria e salva notificação de pedido de amizade
 */
export async function notifyFriendRequest(fromUserName: string, fromUserId: string): Promise<boolean> {
  return saveNotificationForCurrentUser({
    type: 'FRIEND_REQUEST',
    title: 'Novo Pedido de Amizade 👥',
    message: `${fromUserName} quer ser seu amigo!`,
    data: { fromUserId, fromUserName },
  });
}

/**
 * Cria e salva notificação de amizade aceita
 */
export async function notifyFriendAccepted(friendName: string, friendId: string): Promise<boolean> {
  return saveNotificationForCurrentUser({
    type: 'FRIEND_ACCEPTED',
    title: 'Amizade Aceita! 🎉',
    message: `${friendName} aceitou seu pedido de amizade!`,
    data: { friendId, friendName },
  });
}

/**
 * Cria e salva notificação de desafio completado
 */
export async function notifyChallengeCompleted(challengeName: string, xpGained: number): Promise<boolean> {
  return saveNotificationForCurrentUser({
    type: 'CHALLENGE_COMPLETED',
    title: 'Desafio Concluído! ✅',
    message: `${challengeName} - +${xpGained} XP`,
    data: { challengeName, xpGained },
  });
}

/**
 * Cria e salva notificação de milestone de streak
 */
export async function notifyStreakMilestone(streak: number): Promise<boolean> {
  return saveNotificationForCurrentUser({
    type: 'STREAK_MILESTONE',
    title: 'Sequência Incrível! 🔥',
    message: `${streak} dias consecutivos! Continue assim!`,
    data: { streak },
  });
}
