/**
 * ============================================
 * SERVIÇO DE API - COMUNICAÇÃO COM BACKEND
 * ============================================
 * 
 * Centraliza todas as chamadas HTTP para o backend
 * Usa Axios para fazer requisições
 */

import axios from 'axios';

// URL base da API (mude conforme necessário)
// Em produção, use a URL real do servidor
// No desenvolvimento local, use o IP da sua máquina (não localhost!)
const API_URL = 'http://192.168.1.12:3000'; // IP local configurado

// Cria instância do Axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Serviço de Autenticação
 */
export const authService = {
  /**
   * Cadastrar novo usuário
   * @param email Email do usuário
   * @param username Nome de usuário (único)
   * @param password Senha do usuário
   * @param name Nome completo (opcional)
   */
  async register(
    email: string, 
    username: string, 
    password: string,
    name?: string
  ) {
    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password,
        ...(name && { name }), // Só envia se tiver valor
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.errors || 'Erro ao cadastrar usuário',
      };
    }
  },

  /**
   * Fazer login
   * @param identifier Email ou nome de usuário
   * @param password Senha do usuário
   */
  async login(identifier: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        identifier,
        password,
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer login',
      };
    }
  },

  /**
   * Buscar dados do usuário logado
   * @param token Token JWT
   */
  async getMe(token: string) {
    try {
      const response = await api.get('/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar dados do usuário',
      };
    }
  },
};

/**
 * Configurar token de autenticação para todas as requisições
 * Útil depois do login para proteger rotas
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
