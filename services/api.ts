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

// URL base da API - Agora usando variável de ambiente
// Configure no arquivo .env na raiz do projeto
// EXPO_PUBLIC_API_URL=http://SEU_IP:3000/api
//
// ⚠️ ATENÇÃO: O IP pode mudar quando você reinicia o PC ou roteador!
// Se o login parar de funcionar, atualize o .env com seu IP atual:
// Windows: Execute 'ipconfig' no terminal e procure por "Endereço IPv4"
// Mac/Linux: Execute 'ifconfig' ou 'ip addr show'
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.2:3000';

// Log para debug (remove em produção)
console.log('🌐 API URL configurada:', API_URL);

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
      
      // Se existe token, adiciona no header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('❌ Erro no interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ============================================
 * INTERCEPTOR DE RESPOSTA - TRATA ERROS 401
 * ============================================
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se receber 401 (não autorizado), limpa o token
    if (error.response?.status === 401) {
      console.log('🔓 Token inválido ou expirado - limpando dados...');
      try {
        await authStorage.clear();
      } catch (clearError) {
        console.error('❌ Erro ao limpar storage:', clearError);
      }
    }
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
   * @param profileData Dados do perfil a atualizar (todos opcionais)
   */
  async updateProfile(profileData: {
    name?: string;
    username?: string;
    bio?: string;
    birthDate?: string;
    profilePublic?: boolean;
    notificationsEnabled?: boolean;
    dailyReminderTime?: string;
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

  /**
   * Upload de foto de perfil (avatar)
   * Token JWT é injetado automaticamente pelo interceptor
   * @param imageUri URI local da imagem selecionada
   */
  async uploadAvatar(imageUri: string) {
    try {
      // Cria FormData para upload multipart
      const formData = new FormData();
      
      // Extrai extensão do arquivo
      const uriParts = imageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      // Adiciona a imagem ao FormData
      // @ts-ignore - FormData aceita File/Blob no React Native
      formData.append('avatar', {
        uri: imageUri,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      });

      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return { 
        success: true, 
        data: response.data.user || response.data,
        message: response.data.message || 'Foto atualizada com sucesso!'
      };
    } catch (error: any) {
      console.error('Erro ao fazer upload do avatar:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao fazer upload da foto',
      };
    }
  },

  /**
   * Remove foto de perfil do usuário
   * Token JWT é injetado automaticamente pelo interceptor
   */
  async removeAvatar() {
    try {
      const response = await api.delete('/user/avatar');
      
      return { 
        success: true, 
        data: response.data.user || response.data,
        message: response.data.message || 'Foto removida com sucesso!'
      };
    } catch (error: any) {
      console.error('Erro ao remover avatar:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao remover foto de perfil',
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
