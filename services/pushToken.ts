/**
 * ============================================
 * PUSH TOKEN SERVICE (Frontend)
 * ============================================
 * 
 * Gerencia registro de Expo Push Token no backend
 */

import * as Notifications from 'expo-notifications';
import api from './api';

/**
 * Registra o Expo Push Token no backend
 */
export async function registerPushToken(): Promise<boolean> {
  try {
    // Obtém o token do Expo
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '3d9c9e4f-42ba-4ac8-b313-1fef0567b711',
    });

    const expoPushToken = tokenData.data;
    
    if (!expoPushToken) {
      console.log('[PUSH TOKEN] Não foi possível obter token');
      return false;
    }

    console.log('[PUSH TOKEN] Token obtido:', expoPushToken);

    // Envia para o backend
    await api.post('/push-token', { expoPushToken });
    
    console.log('[PUSH TOKEN] ✅ Token registrado no backend');
    return true;
  } catch (error: any) {
    // Se for erro 401, não mostra erro (usuário não está autenticado)
    if (error.response?.status === 401) {
      console.log('[PUSH TOKEN] Usuário não autenticado - token não registrado');
      return false;
    }
    console.error('[PUSH TOKEN] Erro ao registrar token:', error);
    return false;
  }
}

/**
 * Remove o Push Token do backend (logout)
 */
export async function unregisterPushToken(): Promise<void> {
  try {
    await api.delete('/push-token');
    console.log('[PUSH TOKEN] ✅ Token removido do backend');
  } catch (error) {
    console.error('[PUSH TOKEN] Erro ao remover token:', error);
  }
}
