/**
 * ============================================
 * EXPO PUSH NOTIFICATION SERVICE
 * ============================================
 * 
 * Envia notificações push usando Expo Push Notification API
 */

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
}

/**
 * Envia uma push notification via Expo
 */
export async function sendPushNotification(message: PushMessage): Promise<boolean> {
  try {
    // Valida token
    if (!message.to || !message.to.startsWith('ExponentPushToken[')) {
      console.error('[PUSH] Token inválido:', message.to);
      return false;
    }

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        to: message.to,
        title: message.title,
        body: message.body,
        data: message.data || {},
        sound: message.sound || 'default',
        badge: message.badge,
        priority: message.priority || 'high',
        channelId: 'default',
      }),
    });

    const data: any = await response.json();

    if (data.data?.status === 'ok') {
      console.log('[PUSH] ✅ Notificação enviada com sucesso');
      return true;
    } else {
      console.error('[PUSH] ❌ Erro ao enviar:', data);
      return false;
    }
  } catch (error) {
    console.error('[PUSH] ❌ Exceção ao enviar notificação:', error);
    return false;
  }
}

/**
 * Envia push notifications para múltiplos usuários
 */
export async function sendBatchPushNotifications(messages: PushMessage[]): Promise<void> {
  try {
    const validMessages = messages.filter(m => 
      m.to && m.to.startsWith('ExponentPushToken[')
    );

    if (validMessages.length === 0) {
      console.log('[PUSH] Nenhuma mensagem válida para enviar');
      return;
    }

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(validMessages),
    });

    const data: any = await response.json();
    console.log('[PUSH] ✅ Batch enviado:', data);
  } catch (error) {
    console.error('[PUSH] ❌ Erro ao enviar batch:', error);
  }
}
