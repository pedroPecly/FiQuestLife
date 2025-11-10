/**
 * ============================================
 * NOTIFICATION NAVIGATION SERVICE
 * ============================================
 * 
 * Serviço para gerenciar navegação a partir de notificações.
 * Mapeia tipos de notificação para suas respectivas rotas e parâmetros.
 */

import { router } from 'expo-router';
import type { BackendNotification } from './notificationApi';

/**
 * Navega para o destino apropriado baseado no tipo e dados da notificação
 */
export const navigateFromNotification = (notification: BackendNotification): void => {
  console.log('[NOTIFICATION NAV] Navegando:', notification.type, notification.data);

  try {
    switch (notification.type) {
      case 'FRIEND_REQUEST':
        handleFriendRequest(notification);
        break;

      case 'FRIEND_ACCEPTED':
        handleFriendAccepted(notification);
        break;

      case 'ACTIVITY_LIKE':
        handleActivityLike(notification);
        break;

      case 'ACTIVITY_COMMENT':
        handleActivityComment(notification);
        break;

      case 'BADGE_EARNED':
        handleBadgeEarned(notification);
        break;

      case 'LEVEL_UP':
        handleLevelUp(notification);
        break;

      case 'CHALLENGE_COMPLETED':
        handleChallengeCompleted(notification);
        break;

      case 'STREAK_MILESTONE':
        handleStreakMilestone(notification);
        break;

      default:
        console.warn('[NOTIFICATION NAV] Tipo de notificação desconhecido:', notification.type);
    }
  } catch (error) {
    console.error('[NOTIFICATION NAV] Erro ao navegar:', error);
  }
};

/**
 * Handler para solicitação de amizade
 * Navega para a aba de amigos com a tab de solicitações recebidas
 */
const handleFriendRequest = (notification: BackendNotification): void => {
  const friendId = notification.data?.friendId || notification.data?.userId;
  
  router.push({
    pathname: '/(tabs)/friends',
    params: { 
      tab: 'requests',
      highlightUserId: friendId || '',
      timestamp: Date.now().toString(), // Force unique navigation
    },
  });
};

/**
 * Handler para amizade aceita
 * Navega para o perfil do novo amigo
 */
const handleFriendAccepted = (notification: BackendNotification): void => {
  const friendId = notification.data?.friendId || notification.data?.userId;
  
  if (friendId) {
    router.push({
      pathname: '/screens/FriendProfileScreen',
      params: { id: friendId },
    });
  } else {
    // Fallback: navega para lista de amigos
    router.push({
      pathname: '/(tabs)/friends',
      params: { tab: 'friends' },
    });
  }
};

/**
 * Handler para likes em atividades
 * SEMPRE navega para "Meus Posts" pois notificações de like são sobre SUAS postagens
 */
const handleActivityLike = (notification: BackendNotification): void => {
  const activityId = notification.data?.activityId;
  
  console.log('[NOTIFICATION NAV] ========================================');
  console.log('[NOTIFICATION NAV] Tipo: ACTIVITY_LIKE');
  console.log('[NOTIFICATION NAV] Activity ID:', activityId);
  console.log('[NOTIFICATION NAV] Dados completos:', JSON.stringify(notification.data));
  
  if (!activityId) {
    console.warn('[NOTIFICATION NAV] ⚠️ ActivityId não encontrado! Navegando para myPosts sem highlight.');
    console.log('[NOTIFICATION NAV] Esta é uma notificação antiga. Delete-a e crie uma nova curtida para testar.');
    // Navega sem parâmetros de highlight
    router.push({
      pathname: '/(tabs)/explore',
      params: {
        tab: 'myPosts',
      },
    });
    return;
  }
  
  console.log('[NOTIFICATION NAV] Navegando para: /(tabs)/explore');
  console.log('[NOTIFICATION NAV] Params:', { tab: 'myPosts', highlightActivityId: activityId });
  console.log('[NOTIFICATION NAV] ========================================');
  
  router.push({
    pathname: '/(tabs)/explore',
    params: {
      tab: 'myPosts',
      highlightActivityId: activityId,
      timestamp: Date.now().toString(), // Force unique navigation
    },
  });
};

/**
 * Handler para comentários em atividades
 * SEMPRE navega para "Meus Posts" e abre o modal de comentários
 */
const handleActivityComment = (notification: BackendNotification): void => {
  const activityId = notification.data?.activityId;
  
  console.log('[NOTIFICATION NAV] ========================================');
  console.log('[NOTIFICATION NAV] Tipo: ACTIVITY_COMMENT');
  console.log('[NOTIFICATION NAV] Activity ID:', activityId);
  console.log('[NOTIFICATION NAV] Dados completos:', JSON.stringify(notification.data));
  
  if (!activityId) {
    console.warn('[NOTIFICATION NAV] ⚠️ ActivityId não encontrado! Navegando para myPosts sem highlight.');
    console.log('[NOTIFICATION NAV] Esta é uma notificação antiga. Delete-a e crie um novo comentário para testar.');
    // Navega sem parâmetros de highlight
    router.push({
      pathname: '/(tabs)/explore',
      params: {
        tab: 'myPosts',
      },
    });
    return;
  }
  
  console.log('[NOTIFICATION NAV] Navegando para: /(tabs)/explore');
  console.log('[NOTIFICATION NAV] Params:', { tab: 'myPosts', highlightActivityId: activityId, openComments: 'true' });
  console.log('[NOTIFICATION NAV] ========================================');
  
  router.push({
    pathname: '/(tabs)/explore',
    params: {
      tab: 'myPosts',
      highlightActivityId: activityId,
      openComments: 'true', // Flag para abrir modal de comentários
      timestamp: Date.now().toString(), // Force unique navigation
    },
  });
};

/**
 * Handler para badge conquistado
 * Navega para a aba de badges
 */
const handleBadgeEarned = (notification: BackendNotification): void => {
  router.push('/(tabs)/badges');
};

/**
 * Handler para level up
 * Navega para a tela de perfil do usuário
 */
const handleLevelUp = (notification: BackendNotification): void => {
  router.push('/screens/ProfileScreen');
};

/**
 * Handler para desafio completado
 * Navega para a tela de desafios
 */
const handleChallengeCompleted = (notification: BackendNotification): void => {
  router.push('/(tabs)');
};

/**
 * Handler para marco de streak
 * Navega para a tela de desafios onde o streak é exibido
 */
const handleStreakMilestone = (notification: BackendNotification): void => {
  router.push('/(tabs)');
};
