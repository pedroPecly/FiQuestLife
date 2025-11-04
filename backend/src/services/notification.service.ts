/**
 * ============================================
 * NOTIFICATION SERVICE
 * ============================================
 * 
 * Gerencia criação e envio de notificações
 */

import { prisma } from '../lib/prisma.js';
import { sendPushNotification } from './expo-push.service.js';

export type NotificationType = 
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'ACTIVITY_LIKE'
  | 'ACTIVITY_COMMENT'
  | 'BADGE_EARNED'
  | 'LEVEL_UP'
  | 'CHALLENGE_COMPLETED'
  | 'STREAK_MILESTONE';

interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

/**
 * Criar notificação no banco
 */
export async function createNotification(notificationData: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data ? JSON.stringify(notificationData.data) : null,
      },
    });

    // Enviar push notification
    try {
      const user = await prisma.user.findUnique({
        where: { id: notificationData.userId },
        select: { expoPushToken: true },
      });

      if (user?.expoPushToken) {
        console.log('[NOTIFICATION SERVICE] Enviando push para token:', user.expoPushToken);
        await sendPushNotification({
          to: user.expoPushToken,
          title: notificationData.title,
          body: notificationData.message,
          data: notificationData.data,
          badge: 1,
        });
      } else {
        console.log('[NOTIFICATION SERVICE] Usuário sem token de push');
      }
    } catch (pushError) {
      // Não falha se o push der erro
      console.error('[NOTIFICATION SERVICE] Erro ao enviar push (continuando):', pushError);
    }

    return notification;
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Erro ao criar notificação:', error);
    throw error;
  }
}

/**
 * Buscar notificações do usuário
 */
export async function getUserNotifications(userId: string, limit: number = 50, onlyUnread = false) {
  try {
    console.log('[NOTIFICATION SERVICE] Buscando notificações - userId:', userId, 'limit:', limit, 'onlyUnread:', onlyUnread);
    
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(onlyUnread ? { read: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    console.log('[NOTIFICATION SERVICE] Notificações encontradas no DB:', notifications.length);
    if (notifications.length > 0) {
      console.log('[NOTIFICATION SERVICE] Primeira notificação:', {
        id: notifications[0].id,
        type: notifications[0].type,
        title: notifications[0].title,
        read: notifications[0].read,
        createdAt: notifications[0].createdAt,
      });
    }

    return notifications.map((n) => ({
      ...n,
      data: n.data ? JSON.parse(n.data) : null,
    }));
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Erro ao buscar notificações:', error);
    throw error;
  }
}

/**
 * Marcar notificação como lida
 */
export async function markAsRead(notificationId: string, userId: string) {
  try {
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Garantir que é do usuário
      },
      data: {
        read: true,
      },
    });

    return notification;
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Erro ao marcar como lida:', error);
    throw error;
  }
}

/**
 * Marcar todas como lidas
 */
export async function markAllAsRead(userId: string) {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return result;
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Erro ao marcar todas como lidas:', error);
    throw error;
  }
}

/**
 * Contar notificações não lidas
 */
export async function getUnreadCount(userId: string) {
  try {
    console.log('[NOTIFICATION SERVICE] Contando não lidas para userId:', userId);
    
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
    
    console.log('[NOTIFICATION SERVICE] Total de não lidas:', count);

    return count;
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Erro ao contar não lidas:', error);
    throw error;
  }
}

/**
 * Deletar notificação
 */
export async function deleteNotification(notificationId: string, userId: string) {
  try {
    await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId, // Garantir que é do usuário
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Erro ao deletar notificação:', error);
    throw error;
  }
}

/**
 * Helpers para criar notificações específicas
 */

export async function notifyActivityLike(activityOwnerId: string, likerName: string, activityDescription: string) {
  console.log('[NOTIFICATION SERVICE] Criando notificação de curtida para:', activityOwnerId);
  
  const notification = await createNotification({
    userId: activityOwnerId,
    type: 'ACTIVITY_LIKE',
    title: 'Nova curtida! ❤️',
    message: `${likerName} curtiu sua conquista: ${activityDescription}`,
    data: {
      likerName,
      activityDescription,
    },
  });
  
  console.log('[NOTIFICATION SERVICE] Notificação criada:', notification?.id);
  return notification;
}

export async function notifyActivityComment(
  activityOwnerId: string,
  commenterName: string,
  commentContent: string,
  activityDescription: string
) {
  console.log('[NOTIFICATION SERVICE] Criando notificação de comentário para:', activityOwnerId);
  
  const notification = await createNotification({
    userId: activityOwnerId,
    type: 'ACTIVITY_COMMENT',
    title: 'Novo comentário! 💬',
    message: `${commenterName} comentou: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
    data: {
      commenterName,
      commentContent,
      activityDescription,
    },
  });
  
  console.log('[NOTIFICATION SERVICE] Notificação criada:', notification?.id);
  return notification;
}

export async function notifyFriendRequest(receiverId: string, senderName: string) {
  // Verificar se já existe notificação similar recente (últimos 5 segundos)
  const recentNotification = await prisma.notification.findFirst({
    where: {
      userId: receiverId,
      type: 'FRIEND_REQUEST',
      createdAt: {
        gte: new Date(Date.now() - 5000), // 5 segundos atrás
      },
    },
  });

  if (recentNotification) {
    console.log('[NOTIFICATION SERVICE] Notificação de friend request duplicada bloqueada');
    return recentNotification;
  }

  return createNotification({
    userId: receiverId,
    type: 'FRIEND_REQUEST',
    title: 'Nova solicitação de amizade! 🤝',
    message: `${senderName} quer ser seu amigo!`,
    data: {
      senderName,
    },
  });
}

export async function notifyFriendAccepted(senderId: string, accepterName: string) {
  // Verificar se já existe notificação similar recente (últimos 5 segundos)
  const recentNotification = await prisma.notification.findFirst({
    where: {
      userId: senderId,
      type: 'FRIEND_ACCEPTED',
      createdAt: {
        gte: new Date(Date.now() - 5000), // 5 segundos atrás
      },
    },
  });

  if (recentNotification) {
    console.log('[NOTIFICATION SERVICE] Notificação de friend accepted duplicada bloqueada');
    return recentNotification;
  }

  return createNotification({
    userId: senderId,
    type: 'FRIEND_ACCEPTED',
    title: 'Solicitação aceita! 🎉',
    message: `${accepterName} aceitou sua solicitação de amizade!`,
    data: {
      accepterName,
    },
  });
}

export async function notifyBadgeEarned(userId: string, badgeName: string, rarity: string) {
  const rarityEmojis: Record<string, string> = {
    COMMON: '⚪',
    RARE: '🔵',
    EPIC: '🟣',
    LEGENDARY: '🟠',
  };

  const emoji = rarityEmojis[rarity] || '🏆';

  return createNotification({
    userId,
    type: 'BADGE_EARNED',
    title: `${emoji} Conquista Desbloqueada!`,
    message: `Parabéns! Você desbloqueou "${badgeName}"`,
    data: {
      badgeName,
      rarity,
    },
  });
}

export async function notifyLevelUp(userId: string, newLevel: number) {
  return createNotification({
    userId,
    type: 'LEVEL_UP',
    title: '🎉 Level Up!',
    message: `Incrível! Você subiu para o nível ${newLevel}!`,
    data: {
      level: newLevel,
    },
  });
}

export async function notifyChallengeCompleted(
  userId: string,
  challengeName: string,
  xpEarned: number,
  coinsEarned: number
) {
  return createNotification({
    userId,
    type: 'CHALLENGE_COMPLETED',
    title: '✅ Desafio Completado!',
    message: `Você completou "${challengeName}" e ganhou ${xpEarned} XP e ${coinsEarned} moedas!`,
    data: {
      challengeName,
      xpEarned,
      coinsEarned,
    },
  });
}

export async function notifyStreakMilestone(userId: string, streakDays: number) {
  const milestones = [7, 30, 100, 365];
  const isMilestone = milestones.includes(streakDays);

  if (!isMilestone && streakDays % 10 !== 0) {
    return; // Só notifica em milestones importantes ou múltiplos de 10
  }

  return createNotification({
    userId,
    type: 'STREAK_MILESTONE',
    title: '🔥 Streak Impressionante!',
    message: `Você está em chamas! ${streakDays} dias consecutivos!`,
    data: {
      streakDays,
    },
  });
}
