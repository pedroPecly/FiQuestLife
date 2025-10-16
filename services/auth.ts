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

// Chave para armazenar o token
const TOKEN_KEY = '@FiQuestLife:token';
const USER_KEY = '@FiQuestLife:user';

export const authStorage = {
  /**
   * Salvar token e dados do usuário
   */
  async saveAuth(token: string, user: any) {
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
      return null;
    }
  },

  /**
   * Recuperar dados do usuário
   */
  async getUser() {
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
   */
  async logout() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      return true;
    } catch (error) {
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
