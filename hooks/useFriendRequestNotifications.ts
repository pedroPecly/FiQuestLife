/**
 * ============================================
 * HOOK: NOTIFICAÇÕES DE SOLICITAÇÕES DE AMIZADE
 * ============================================
 * 
 * Verifica periodicamente se há novas solicitações de amizade
 * e envia notificações push automaticamente
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef } from 'react';
import type { FriendRequest } from '../services/friend';
import { friendService } from '../services/friend';
import { notifyFriendRequest } from '../services/notifications';

const CHECK_INTERVAL = 60000; // 1 minuto

export const useFriendRequestNotifications = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Verifica imediatamente ao montar
    checkNewFriendRequests();

    // Configura verificação periódica
    intervalRef.current = setInterval(() => {
      checkNewFriendRequests();
    }, CHECK_INTERVAL) as unknown as NodeJS.Timeout;

    // Cleanup ao desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const checkNewFriendRequests = async () => {
    try {
      // Verifica se ainda há token antes de fazer a requisição
      const token = await AsyncStorage.getItem('@FiQuestLife:token');
      if (!token) {
        // Usuário não está mais logado, para verificação
        return;
      }

      // Busca solicitações pendentes
      const currentRequests = await friendService.getPendingRequests();

      // Busca cache de solicitações anteriores
      const previousRequestsJson = await AsyncStorage.getItem('friend_requests_cache');
      const previousRequests: FriendRequest[] = previousRequestsJson
        ? JSON.parse(previousRequestsJson)
        : [];

      // Identifica solicitações novas
      const previousIds = new Set(previousRequests.map((r) => r.id));
      const newRequests = currentRequests.filter((r) => !previousIds.has(r.id));

      // Envia notificação para cada nova solicitação
      for (const request of newRequests) {
        if (request.sender) {
          await notifyFriendRequest(request.sender.name, request.sender.username);
          console.log('✅ Notificação de solicitação enviada:', request.sender.name);
        }
      }

      // Atualiza cache
      if (newRequests.length > 0) {
        await AsyncStorage.setItem('friend_requests_cache', JSON.stringify(currentRequests));
      }
    } catch (error) {
      console.error('Erro ao verificar novas solicitações:', error);
      // Não mostra erro para o usuário, apenas loga
    }
  };
};
