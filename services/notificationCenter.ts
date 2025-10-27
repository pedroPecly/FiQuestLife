/**
 * ============================================
 * NOTIFICATION CENTER - Gerenciamento In-App
 * ============================================
 * 
 * Gerencia o histórico de notificações in-app:
 * - Salva notificações recebidas localmente
 * - Controla status de lida/não lida
 * - Fornece badge count
 * - Histórico das últimas 50 notificações
 * 
 * @created 27 de outubro de 2025
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NotificationType } from './notifications';

// ==========================================
// TIPOS
// ==========================================

export interface InAppNotification {
  id: string;                    // UUID único
  type: NotificationType;        // Tipo da notificação
  title: string;                 // Título
  body: string;                  // Mensagem
  timestamp: number;             // Date.now()
  read: boolean;                 // false = não lida
  data?: any;                    // Dados extras (badgeId, level, etc)
  icon?: string;                 // Emoji ou ícone
}

// ==========================================
// CONSTANTES
// ==========================================

const STORAGE_KEY = 'notification_history';
const MAX_NOTIFICATIONS = 50;

// Ícones por tipo de notificação
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  DAILY_REMINDER: '⏰',
  STREAK_REMINDER: '🔥',
  BADGE_EARNED: '🏆',
  LEVEL_UP: '🎉',
  CHALLENGE_ASSIGNED: '🎯',
};

// Cores por tipo de notificação
export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  DAILY_REMINDER: '#2196F3',    // Azul
  STREAK_REMINDER: '#FF5722',   // Laranja/Vermelho
  BADGE_EARNED: '#FFD700',      // Dourado
  LEVEL_UP: '#9C27B0',          // Roxo
  CHALLENGE_ASSIGNED: '#4CAF50', // Verde
};

// ==========================================
// FUNÇÕES PRINCIPAIS
// ==========================================

/**
 * Salva uma nova notificação no histórico
 */
export const saveNotification = async (notification: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>): Promise<void> => {
  try {
    const history = await getNotificationHistory();
    
    const newNotification: InAppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
      icon: NOTIFICATION_ICONS[notification.type],
      ...notification,
    };

    // Adiciona no início do array
    history.unshift(newNotification);

    // Limita a 50 notificações
    const limitedHistory = history.slice(0, MAX_NOTIFICATIONS);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Erro ao salvar notificação:', error);
  }
};

/**
 * Busca todo o histórico de notificações
 */
export const getNotificationHistory = async (): Promise<InAppNotification[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao buscar histórico de notificações:', error);
    return [];
  }
};

/**
 * Busca apenas notificações não lidas
 */
export const getUnreadNotifications = async (): Promise<InAppNotification[]> => {
  const history = await getNotificationHistory();
  return history.filter(n => !n.read);
};

/**
 * Retorna a quantidade de notificações não lidas
 */
export const getUnreadCount = async (): Promise<number> => {
  const unread = await getUnreadNotifications();
  return unread.length;
};

/**
 * Marca uma notificação específica como lida
 */
export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    const history = await getNotificationHistory();
    const updated = history.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
  }
};

/**
 * Marca todas as notificações como lidas
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    const history = await getNotificationHistory();
    const updated = history.map(n => ({ ...n, read: true }));
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Erro ao marcar todas como lidas:', error);
  }
};

/**
 * Limpa todo o histórico de notificações
 */
export const clearAllNotifications = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar notificações:', error);
  }
};

/**
 * Deleta uma notificação específica
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    const history = await getNotificationHistory();
    const filtered = history.filter(n => n.id !== notificationId);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
  }
};

// ==========================================
// FORMATAÇÃO DE TEMPO
// ==========================================

/**
 * Formata o timestamp para texto relativo ("Há 5 minutos")
 */
export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Agora';
  if (minutes < 60) return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  if (hours < 24) return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  if (days < 7) return `Há ${days} ${days === 1 ? 'dia' : 'dias'}`;
  
  // Mais de 7 dias: mostra data
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'short' 
  });
};

// ==========================================
// DEBUG / TESTE
// ==========================================

/**
 * Cria notificações de teste para visualizar o sistema
 */
export const createTestNotifications = async (): Promise<void> => {
  const notifications = [
    {
      type: 'BADGE_EARNED' as NotificationType,
      title: 'Conquista Desbloqueada! 🏆',
      body: 'Você conquistou: Primeira Conquista! Parabéns!',
      data: { badgeId: 'test-1', rarity: 'RARE' },
    },
    {
      type: 'LEVEL_UP' as NotificationType,
      title: 'Level Up! 🎉',
      body: 'Parabéns! Você alcançou o nível 5!',
      data: { level: 5 },
    },
    {
      type: 'STREAK_REMINDER' as NotificationType,
      title: 'Não perca sua sequência! 🔥',
      body: 'Complete pelo menos 1 desafio hoje para manter seu streak',
      data: {},
    },
    {
      type: 'DAILY_REMINDER' as NotificationType,
      title: 'Novos desafios disponíveis! ⏰',
      body: 'Comece o dia completando seus desafios diários 🎯',
      data: {},
    },
    {
      type: 'CHALLENGE_ASSIGNED' as NotificationType,
      title: 'Novos Desafios! 🎯',
      body: '5 novos desafios foram atribuídos! Confira agora.',
      data: { count: 5 },
    },
  ];

  // Salva com delays diferentes para parecer mais real
  for (let i = 0; i < notifications.length; i++) {
    await saveNotification({
      ...notifications[i],
      // Ajusta timestamp para simular notificações em tempos diferentes
      // A função saveNotification já adiciona timestamp, mas vamos deixar assim
    });
    
    // Pequeno delay entre cada notificação
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('✅ 5 notificações de teste criadas!');
};
