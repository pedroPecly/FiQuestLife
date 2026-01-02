/**
 * ============================================
 * GERENCIADOR DE AUTENTICAÇÃO
 * ============================================
 * 
 * Responsável por:
 * - Armazenar token JWT de forma segura
 * - Recuperar token
 * - Remover token (logout)
 * - Verificar se usuário está logado
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types/user';
import ActivitySyncService from './activitySync';
import { unregisterPushToken } from './pushToken';

// Chave para armazenar o token
const TOKEN_KEY = '@FiQuestLife:token';
const USER_KEY = '@FiQuestLife:user';

export const authStorage = {
  /**
   * Salvar token e dados do usuário
   */
  async saveAuth(token: string, user: User) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Recuperar token
   */
  async getToken() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      return null;
    }
  },

  /**
   * Recuperar dados do usuário
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Verificar se usuário está logado
   */
  async isLoggedIn() {
    const token = await this.getToken();
    return !!token;
  },

  /**
   * Fazer logout (remover token e dados do usuário)
   * Remove também o push token do backend para parar de receber notificações
   * 
   * IMPORTANTE: Notificações locais NÃO são limpas no logout.
   * Elas persistem entre sessões do mesmo usuário para manter histórico.
   * As notificações são filtradas por userId automaticamente.
   */
  async logout() {
    try {
      // Remover push token do backend ANTES de limpar o token de autenticação
      // Isso garante que o token ainda é válido ao chamar a API
      try {
        await unregisterPushToken();
        console.log('[AUTH] Push token removido com sucesso');
      } catch (error) {
        console.error('[AUTH] Erro ao remover push token (continuando logout):', error);
        // Não bloqueia o logout se houver erro ao remover push token
      }

      // Remover dados de autenticação do AsyncStorage
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      
      // Limpar cache de sincronização de atividades
      ActivitySyncService.clearCache();
      
      console.log('[AUTH] Logout concluído com sucesso');
      console.log('[AUTH] ℹ️ Notificações locais mantidas para próximo login');
      return true;
    } catch (error) {
      console.error('[AUTH] Erro durante logout:', error);
      return false;
    }
  },

  /**
   * Limpar todos os dados
   */
  async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      return false;
    }
  },
};
