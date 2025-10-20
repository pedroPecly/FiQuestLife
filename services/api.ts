/**
 * ============================================
 * SERVIÇO DE API - COMUNICAÇÃO COM BACKEND
 * ============================================
 * 
 * Centraliza todas as chamadas HTTP para o backend
 * Usa Axios para fazer requisições
 * Inclui interceptor para adicionar token JWT automaticamente
 */

import axios from 'axios';
import { authStorage } from './auth';

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
 * ============================================
 * INTERCEPTOR - ADICIONA TOKEN JWT AUTOMATICAMENTE
 * ============================================
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Busca o token do AsyncStorage
      const token = await authStorage.getToken();
      
      console.log('🔑 Interceptor - Token encontrado:', token ? '✅ Sim' : '❌ Não');
      
      // Se existe token, adiciona no header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Interceptor - Header adicionado:', config.headers.Authorization.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ Interceptor - Nenhum token encontrado no AsyncStorage');
      }
      
      return config;
    } catch (error) {
      console.error('❌ Erro no interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Erro no interceptor (reject):', error);
    return Promise.reject(error);
  }
);

/**
 * Serviço de Autenticação
 */
export const authService = {
  /**
   * Cadastrar novo usuário
   * @param email Email do usuário
   * @param username Nome de usuário (único)
   * @param password Senha do usuário
   * @param name Nome completo (obrigatório)
   * @param birthDate Data de nascimento (obrigatório)
   */
  async register(
    email: string, 
    username: string, 
    password: string,
    name: string,
    birthDate: string
  ) {
    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password,
        name,
        birthDate,
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
   * Token JWT é injetado automaticamente pelo interceptor
   */
  async getMe() {
    try {
      const response = await api.get('/user/me');
      
      // Backend retorna { message: '...', user: {...} }
      // Retornamos apenas o objeto user
      return { 
        success: true, 
        data: response.data.user || response.data 
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar dados do usuário',
      };
    }
  },

  /**
   * Atualizar perfil do usuário
   * Token JWT é injetado automaticamente pelo interceptor
   * @param profileData Dados do perfil a atualizar
   */
  async updateProfile(profileData: {
    name: string;
    username: string;
    bio?: string;
    birthDate: string;
  }) {
    try {
      const response = await api.put('/user/profile', profileData);
      
      return { 
        success: true, 
        data: response.data.user || response.data,
        message: response.data.message 
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao atualizar perfil',
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
