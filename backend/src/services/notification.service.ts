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
  | 'STREAK_MILESTONE'
  | 'CHALLENGE_INVITE'
  | 'CHALLENGE_ACCEPTED';

interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

/**
 * Criar notificação (somente push, dados salvos localmente no frontend)
 */
export async function createNotification(notificationData: CreateNotificationData) {
  try {
    // ============================================
    // PUSH NOTIFICATION: Para usuários offline
    // ============================================
    // Notificações são salvas LOCALMENTE no frontend (AsyncStorage)
    // Backend apenas envia push notification
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

    // Retorna os dados da notificação para o frontend salvar localmente
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data,
      read: false,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[NOTIFICATION SERVICE] Erro ao criar notificação:', error);
    throw error;
  }
}

/**
 * Buscar notificações do usuário
 * NOTA: Notificações são armazenadas localmente no frontend (AsyncStorage)
 * Esta função não é mais usada, mas mantida para compatibilidade
 */
export async function getUserNotifications(_userId: string, _limit: number = 50, _onlyUnread = false) {
  console.log('[NOTIFICATION SERVICE] getUserNotifications chamada - retornando array vazio (notificações são locais)');
  return [];
}

/**
 * Marcar notificação como lida
 * NOTA: Notificações são gerenciadas localmente no frontend
 */
export async function markAsRead(_notificationId: string, _userId: string) {
  console.log('[NOTIFICATION SERVICE] markAsRead chamada - operação local no frontend');
  return { success: true };
}

/**
 * Marcar todas como lidas
 * NOTA: Notificações são gerenciadas localmente no frontend
 */
export async function markAllAsRead(_userId: string) {
  console.log('[NOTIFICATION SERVICE] markAllAsRead chamada - operação local no frontend');
  return { count: 0 };
}

/**
 * Contar notificações não lidas
 * NOTA: Contagem é feita localmente no frontend
 */
export async function getUnreadCount(_userId: string) {
  console.log('[NOTIFICATION SERVICE] getUnreadCount chamada - retornando 0 (contagem é local)');
  return 0;
}

/**
 * Deletar notificação
 * NOTA: Notificações são gerenciadas localmente no frontend
 */
export async function deleteNotification(_notificationId: string, _userId: string) {
  console.log('[NOTIFICATION SERVICE] deleteNotification chamada - operação local no frontend');
  return { success: true };
}

/**
 * Helpers para criar notificações específicas
 */

export async function notifyActivityLike(
  activityOwnerId: string,
  activityId: string,
  likerName: string,
  activityDescription: string
) {
  console.log('[NOTIFICATION SERVICE] 💖 Criando notificação de curtida');
  console.log('[NOTIFICATION SERVICE] 💖 Owner ID:', activityOwnerId);
  console.log('[NOTIFICATION SERVICE] 💖 Activity ID:', activityId);
  console.log('[NOTIFICATION SERVICE] 💖 Liker:', likerName);
  
  const notification = await createNotification({
    userId: activityOwnerId,
    type: 'ACTIVITY_LIKE',
    title: 'Nova curtida! ❤️',
    message: `${likerName} curtiu sua conquista: ${activityDescription}`,
    data: {
      type: 'ACTIVITY_LIKE',
      activityId,
      likerName,
      activityDescription,
    },
  });
  
  console.log('[NOTIFICATION SERVICE] ✅ Notificação de curtida processada:', notification?.id);
  return notification;
}

export async function notifyActivityComment(
  activityOwnerId: string,
  activityId: string,
  commenterName: string,
  commentContent: string,
  activityDescription: string
) {
  console.log('[NOTIFICATION SERVICE] 💬 Criando notificação de comentário');
  console.log('[NOTIFICATION SERVICE] 💬 Owner ID:', activityOwnerId);
  console.log('[NOTIFICATION SERVICE] 💬 Activity ID:', activityId);
  console.log('[NOTIFICATION SERVICE] 💬 Commenter:', commenterName);
  console.log('[NOTIFICATION SERVICE] 💬 Comment:', commentContent.substring(0, 100));
  
  const notification = await createNotification({
    userId: activityOwnerId,
    type: 'ACTIVITY_COMMENT',
    title: 'Novo comentário! 💬',
    message: `${commenterName} comentou: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
    data: {
      type: 'ACTIVITY_COMMENT',
      activityId,
      commenterName,
      commentContent,
      activityDescription,
    },
  });
  
  console.log('[NOTIFICATION SERVICE] ✅ Notificação de comentário processada:', notification?.id);
  return notification;
}

export async function notifyFriendRequest(receiverId: string, senderName: string) {
  console.log('[NOTIFICATION SERVICE] Criando notificação de friend request para:', receiverId);
  
  return createNotification({
    userId: receiverId,
    type: 'FRIEND_REQUEST',
    title: 'Nova solicitação de amizade! 🤝',
    message: `${senderName} quer ser seu amigo!`,
    data: {
      type: 'FRIEND_REQUEST',
      senderName,
    },
  });
}

export async function notifyFriendAccepted(senderId: string, accepterName: string) {
  console.log('[NOTIFICATION SERVICE] Criando notificação de friend accepted para:', senderId);
  
  return createNotification({
    userId: senderId,
    type: 'FRIEND_ACCEPTED',
    title: 'Solicitação aceita! 🎉',
    message: `${accepterName} aceitou sua solicitação de amizade!`,
    data: {
      type: 'FRIEND_ACCEPTED',
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
      type: 'BADGE_EARNED',
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
      type: 'LEVEL_UP',
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
      type: 'CHALLENGE_COMPLETED',
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
      type: 'STREAK_MILESTONE',
      streakDays,
    },
  });
}

export async function notifyChallengeInvite(invitation: any) {
  console.log('[NOTIFICATION SERVICE] 🎯 Criando notificação de convite de desafio');
  console.log('[NOTIFICATION SERVICE] 🎯 Para:', invitation.toUser.name);
  console.log('[NOTIFICATION SERVICE] 🎯 De:', invitation.fromUser.name);
  console.log('[NOTIFICATION SERVICE] 🎯 Desafio:', invitation.challenge.title);

  return createNotification({
    userId: invitation.toUserId,
    type: 'CHALLENGE_INVITE',
    title: '🎯 Novo Desafio!',
    message: `${invitation.fromUser.name} desafiou você em "${invitation.challenge.title}"${invitation.message ? ` - ${invitation.message}` : ''}`,
    data: {
      type: 'CHALLENGE_INVITE',
      invitationId: invitation.id,
      challengeId: invitation.challengeId,
      challengeTitle: invitation.challenge.title,
      fromUserId: invitation.fromUserId,
      fromUserName: invitation.fromUser.name,
      message: invitation.message,
    },
  });
}

export async function notifyChallengeAccepted(invitation: any) {
  console.log('[NOTIFICATION SERVICE] ✅ Criando notificação de desafio aceito');
  console.log('[NOTIFICATION SERVICE] ✅ Para:', invitation.fromUser?.name);
  console.log('[NOTIFICATION SERVICE] ✅ Desafio:', invitation.challenge?.title);

  // Verifica se tem todas as informações necessárias
  if (!invitation.toUser || !invitation.fromUser || !invitation.challenge) {
    console.error('[NOTIFICATION SERVICE] ❌ Dados incompletos para notificação:', {
      hasToUser: !!invitation.toUser,
      hasFromUser: !!invitation.fromUser,
      hasChallenge: !!invitation.challenge,
    });
    throw new Error('Dados incompletos para criar notificação');
  }

  return createNotification({
    userId: invitation.fromUserId,
    type: 'CHALLENGE_ACCEPTED',
    title: '✅ Desafio Aceito!',
    message: `${invitation.toUser.name} aceitou seu desafio em "${invitation.challenge.title}"!`,
    data: {
      type: 'CHALLENGE_ACCEPTED',
      invitationId: invitation.id,
      challengeId: invitation.challengeId,
      challengeTitle: invitation.challenge.title,
      toUserId: invitation.toUserId,
      toUserName: invitation.toUser.name,
    },
  });
}
