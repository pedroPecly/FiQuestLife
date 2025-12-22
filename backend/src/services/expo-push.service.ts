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
      console.error('[PUSH] ❌ Token inválido:', message.to);
      return false;
    }

    console.log('[PUSH] 📤 Enviando notificação para:', message.to);
    console.log('[PUSH] 📤 Título:', message.title);
    console.log('[PUSH] 📤 Corpo:', message.body);
    console.log('[PUSH] 📤 Dados:', JSON.stringify(message.data));

    // Payload otimizado para Android
    const payload = {
      to: message.to,
      title: message.title,
      body: message.body,
      data: message.data || {},
      sound: message.sound || 'default',
      badge: message.badge,
      priority: message.priority || 'high',
      channelId: 'default',
      // Configurações específicas do Android
      android: {
        channelId: 'default',
        priority: 'max',
        sound: 'default',
        vibrate: [0, 250, 250, 250],
      },
      // Time to live - 1 dia (86400 segundos)
      ttl: 86400,
      // Expiração - tempo atual + 1 dia
      expiration: Math.floor(Date.now() / 1000) + 86400,
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Verifica se a resposta é JSON válida
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('[PUSH] ❌ Resposta não é JSON:', text.substring(0, 200));
      return false;
    }

    const data: any = await response.json();

    console.log('[PUSH] 📥 Resposta do Expo:', JSON.stringify(data));

    if (data.data?.status === 'ok') {
      console.log('[PUSH] ✅ Notificação enviada com sucesso');
      console.log('[PUSH] ✅ Ticket ID:', data.data.id);
      return true;
    } else if (data.data?.status === 'error') {
      console.error('[PUSH] ❌ Erro do Expo:', data.data.message);
      console.error('[PUSH] ❌ Detalhes:', data.data.details);
      return false;
    } else {
      console.error('[PUSH] ❌ Resposta inesperada:', JSON.stringify(data));
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
