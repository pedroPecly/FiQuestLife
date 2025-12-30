/**
 * ============================================
 * ACTIVITY SYNC SERVICE
 * ============================================
 * 
 * Serviço para sincronização automática de atividades físicas.
 * Atualiza progresso de desafios baseado em dados dos sensores nativos
 * (pedômetro, GPS) mesmo quando o app está fechado.
 * 
 * Features:
 * - Auto-sync ao abrir app
 * - Leitura de passos desde meia-noite
 * - Auto-completar desafios quando meta é atingida
 * - Persistência local com AsyncStorage
 * 
 * @created 30/12/2025
 * @phase Implementação Fase 1 - Auto-Sync
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import PedometerService from './pedometer';
import HealthKitService from './healthKit';
import GoogleFitService from './googleFit';
import { Platform } from 'react-native';

const DAILY_PROGRESS_KEY = '@FiQuestLife:dailyProgress';

// ==========================================
// TYPES
// ==========================================

export interface DailyProgress {
  steps: number;
  distance: number; // metros (estimado)
  date: string; // YYYY-MM-DD
  lastSync: number; // timestamp
}

export interface ChallengeProgress {
  challengeId: string;
  title: string;
  currentValue: number;
  targetValue: number;
  completed: boolean;
  trackingType: 'STEPS' | 'DISTANCE' | 'DURATION';
}

interface ActiveChallenge {
  id: string;
  title: string;
  trackingType: 'STEPS' | 'DISTANCE' | 'DURATION';
  targetValue: number;
  currentProgress: number;
  status: string;
}

// ==========================================
// SERVICE
// ==========================================

class ActivitySyncService {
  private syncing = false;
  private challengesCache: { data: ActiveChallenge[], timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Sincroniza atividades do dia e atualiza desafios
   * Chamado ao abrir o app ou quando volta ao foreground
   */
  async syncActivityOnAppOpen(): Promise<ChallengeProgress[]> {
    // Evitar múltiplas syncs simultâneas
    if (this.syncing) {
      console.log('[ACTIVITY SYNC] Sync já em andamento, ignorando...');
      return [];
    }

    try {
      this.syncing = true;
      console.log('[ACTIVITY SYNC] 🔄 Iniciando sincronização...');

      // 1. Obter dados dos sensores nativos
      const todayData = await this.getTodayActivityData();
      console.log('[ACTIVITY SYNC] 📊 Dados do dia:', {
        steps: todayData.steps,
        distance: `${(todayData.distance / 1000).toFixed(2)}km`,
        date: todayData.date,
      });

      // 2. Verificar se é um novo dia
      const lastProgress = await this.getLastDailyProgress();
      const isNewDay = lastProgress?.date !== todayData.date;

      if (isNewDay && lastProgress) {
        console.log('[ACTIVITY SYNC] 📅 Novo dia detectado, resetando progresso');
      }

      // 3. Buscar desafios ativos com tracking
      const challenges = await this.getActiveChallengesWithTracking();
      console.log(`[ACTIVITY SYNC] 🎯 ${challenges.length} desafios ativos encontrados`);

      if (challenges.length === 0) {
        await this.saveDailyProgress(todayData);
        return [];
      }

      // 4. Atualizar progresso de cada desafio
      const results: ChallengeProgress[] = [];

      for (const challenge of challenges) {
        const result = await this.updateChallengeProgress(challenge, todayData);
        results.push(result);

        if (result.completed) {
          console.log(`[ACTIVITY SYNC] ✅ Desafio "${result.title}" completado automaticamente!`);
        } else {
          const percent = Math.round((result.currentValue / result.targetValue) * 100);
          console.log(`[ACTIVITY SYNC] 📈 Desafio "${result.title}": ${percent}% (${result.currentValue}/${result.targetValue})`);
        }
      }

      // 5. Salvar estado atual
      await this.saveDailyProgress(todayData);

      // 6. Sync com backend (batch)
      await this.syncToBackend(results);

      const completedCount = results.filter(r => r.completed).length;
      console.log(`[ACTIVITY SYNC] ✨ Sincronização concluída: ${completedCount} desafios completados, ${results.length - completedCount} atualizados`);

      return results;

    } catch (error) {
      console.error('[ACTIVITY SYNC] ❌ Erro na sincronização:', error);
      throw error;
    } finally {
      this.syncing = false;
    }
  }

  /**
   * Obtém dados de atividade do dia atual
   * Prioridade: HealthKit/GoogleFit > Pedômetro nativo
   * 
   * FASE 2: Integração com Health APIs para dados mais precisos
   */
  private async getTodayActivityData(): Promise<DailyProgress> {
    const today = new Date().toISOString().split('T')[0];

    try {
      // FASE 2: Tentar HealthKit (iOS) ou Google Fit (Android) primeiro
      if (Platform.OS === 'ios' && HealthKitService.isAvailable()) {
        try {
          const healthData = await HealthKitService.getTodayData();
          console.log('[ACTIVITY SYNC] ✅ Usando dados do Apple Health');
          
          return {
            steps: healthData.steps,
            distance: healthData.distance, // Distância REAL do HealthKit!
            date: today,
            lastSync: Date.now(),
          };
        } catch (error) {
          console.warn('[ACTIVITY SYNC] ⚠️ Falha no HealthKit, usando fallback:', error);
        }
      } else if (Platform.OS === 'android' && GoogleFitService.isAvailable()) {
        try {
          const fitData = await GoogleFitService.getTodayData();
          console.log('[ACTIVITY SYNC] ✅ Usando dados do Google Fit');
          
          return {
            steps: fitData.steps,
            distance: fitData.distance, // Distância REAL do Google Fit!
            date: today,
            lastSync: Date.now(),
          };
        } catch (error) {
          console.warn('[ACTIVITY SYNC] ⚠️ Falha no Google Fit, usando fallback:', error);
        }
      }

      // Fallback: Pedômetro nativo com estimativa
      console.log('[ACTIVITY SYNC] 📱 Usando pedômetro nativo (estimativa)');
      const steps = await PedometerService.getDailySteps();

      // Distância estimada: 0.78m por passo (média adulto caminhando)
      // Fase 2 irá usar HealthKit para distância real
      const estimatedDistance = Math.round(steps * 0.78);

      return {
        steps,
        distance: estimatedDistance,
        date: today,
        lastSync: Date.now(),
      };
    } catch (error) {
      console.error('[ACTIVITY SYNC] Erro ao obter dados:', error);
      
      // Fallback: retornar dados zerados
      return {
        steps: 0,
        distance: 0,
        date: today,
        lastSync: Date.now(),
      };
    }
  }

  /**
   * Busca desafios ativos que possuem tracking automático
   * Implementa cache de 5 minutos para reduzir chamadas à API
   */
  private async getActiveChallengesWithTracking(): Promise<ActiveChallenge[]> {
    const now = Date.now();
    
    // Usar cache se válido
    if (this.challengesCache && 
        now - this.challengesCache.timestamp < this.CACHE_TTL) {
      console.log('[ACTIVITY SYNC] 💾 Usando desafios em cache');
      return this.challengesCache.data;
    }
    
    try {
      console.log('[ACTIVITY SYNC] 🌐 Buscando desafios do servidor...');
      const response = await api.get('/challenges/active-with-tracking');
      const data = response.data.data || [];
      
      // Atualizar cache
      this.challengesCache = { data, timestamp: now };
      
      return data;
    } catch (error: any) {
      // Se endpoint não existe ainda (404), retornar array vazio
      if (error.response?.status === 404) {
        console.warn('[ACTIVITY SYNC] Endpoint /challenges/active-with-tracking não encontrado (esperado durante desenvolvimento)');
        return [];
      }
      
      // Se erro 500, pode ser que não tenha desafios com tracking
      if (error.response?.status === 500) {
        console.warn('[ACTIVITY SYNC] ⚠️ Erro no servidor ao buscar desafios (pode não ter desafios com tracking ativos)');
        return [];
      }
      
      console.error('[ACTIVITY SYNC] Erro ao buscar desafios:', error.message);
      
      // Se tiver cache antigo, usar como fallback
      if (this.challengesCache) {
        console.warn('[ACTIVITY SYNC] ⚠️ Usando cache expirado como fallback');
        return this.challengesCache.data;
      }
      
      return [];
    }
  }

  /**
   * Atualiza progresso de um desafio específico
   */
  private async updateChallengeProgress(
    challenge: ActiveChallenge,
    todayData: DailyProgress
  ): Promise<ChallengeProgress> {
    const { id, title, trackingType, targetValue, currentProgress, status } = challenge;

    // Determinar valor atual baseado no tipo
    let currentValue = currentProgress || 0;
    
    switch (trackingType) {
      case 'STEPS':
        currentValue = todayData.steps;
        break;
      case 'DISTANCE':
        currentValue = todayData.distance;
        break;
      case 'DURATION':
        // Duração requer sessões explícitas (não auto-sync)
        // Manter progresso atual
        return {
          challengeId: id,
          title,
          currentValue: currentProgress || 0,
          targetValue,
          completed: false,
          trackingType,
        };
      default:
        currentValue = currentProgress || 0;
    }

    // Verificar se atingiu meta
    const completed = currentValue >= targetValue && status !== 'COMPLETED';

    // Atualizar no backend
    try {
      if (completed) {
        // Auto-completar desafio
        await api.post(`/challenges/${id}/complete`, {
          autoCompleted: true,
          trackingData: {
            steps: todayData.steps,
            distance: todayData.distance,
            timestamp: Date.now(),
          },
        });
      } else {
        // Apenas atualizar progresso
        await api.put(`/challenges/${id}/progress`, {
          currentValue,
          trackingData: {
            steps: todayData.steps,
            distance: todayData.distance,
            timestamp: Date.now(),
          },
        });
      }
    } catch (error: any) {
      // Se endpoint não existe (404), apenas log warning
      if (error.response?.status === 404) {
        console.warn(`[ACTIVITY SYNC] Endpoint para atualizar desafio ${id} não encontrado (esperado durante desenvolvimento)`);
      } else {
        console.error(`[ACTIVITY SYNC] Erro ao atualizar desafio ${id}:`, error.message);
      }
    }

    return {
      challengeId: id,
      title,
      currentValue,
      targetValue,
      completed,
      trackingType,
    };
  }

  /**
   * Salva progresso diário no AsyncStorage
   */
  private async saveDailyProgress(progress: DailyProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('[ACTIVITY SYNC] Erro ao salvar progresso:', error);
    }
  }

  /**
   * Obtém último progresso salvo
   */
  private async getLastDailyProgress(): Promise<DailyProgress | null> {
    try {
      const stored = await AsyncStorage.getItem(DAILY_PROGRESS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('[ACTIVITY SYNC] Erro ao carregar progresso:', error);
      return null;
    }
  }

  /**
   * Sincroniza resultados com backend em batch
   */
  private async syncToBackend(results: ChallengeProgress[]): Promise<void> {
    if (results.length === 0) return;

    try {
      await api.post('/activity/batch-sync', {
        results: results.map(r => ({
          challengeId: r.challengeId,
          currentValue: r.currentValue,
          completed: r.completed,
        })),
        timestamp: Date.now(),
      });
    } catch (error: any) {
      // Falha silenciosa, será sincronizado na próxima abertura
      if (error.response?.status === 404) {
        console.warn('[ACTIVITY SYNC] Endpoint /activity/batch-sync não encontrado (esperado durante desenvolvimento)');
      } else {
        console.error('[ACTIVITY SYNC] Erro no batch sync:', error.message);
      }
    }
  }

  /**
   * Retorna progresso atual do dia (para UI)
   */
  async getCurrentProgress(): Promise<DailyProgress | null> {
    // Tentar obter dados atualizados primeiro
    try {
      const todayData = await this.getTodayActivityData();
      await this.saveDailyProgress(todayData);
      return todayData;
    } catch (error) {
      // Fallback para último salvo
      return this.getLastDailyProgress();
    }
  }

  /**
   * Força reset do progresso diário (útil para testes)
   */
  async resetDailyProgress(): Promise<void> {
    await AsyncStorage.removeItem(DAILY_PROGRESS_KEY);
    console.log('[ACTIVITY SYNC] Progresso diário resetado');
  }

  /**
   * Invalida cache de desafios (forçar reload do servidor)
   * Útil após completar desafio ou aceitar novo desafio
   */
  invalidateChallengesCache(): void {
    this.challengesCache = null;
    console.log('[ACTIVITY SYNC] 🗑️ Cache de desafios invalidado');
  }
}

export default new ActivitySyncService();
