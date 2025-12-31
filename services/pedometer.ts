/**
 * ============================================
 * PEDOMETER SERVICE (Optimized)
 * ============================================
 * 
 * Serviço otimizado para rastreamento de passos usando Expo Sensors.
 * Suporta iOS (date range) e Android (continuous tracking).
 * 
 * Otimizações:
 * - Debouncing no save (30s ou 50 passos)
 * - Singleton garantido
 * - Lifecycle management
 * - Zero recursão
 * - Minimal I/O
 * 
 * @created 30/12/2025
 * @updated 31/12/2025 - Performance optimizations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

const STORAGE_KEY = '@FiQuestLife:dailySteps';
const CACHE_SAVE_INTERVAL = 30000; // 30 segundos
const CACHE_STEP_THRESHOLD = 50;   // Salvar a cada 50 passos

export interface StepData {
  steps: number;
  date: string;
  lastUpdate: number;
}

class PedometerService {
  // Session tracking
  private subscription: any = null;
  private sessionSteps: number = 0;
  private sessionStartSteps: number = 0;
  private sessionStartTime: Date | null = null;

  // Daily tracking (Android)
  private dailyStepSubscription: any = null;
  private dailyStepCount: number = 0;
  private dailyTrackingInitialized: boolean = false;
  
  // Cache optimization
  private lastCacheTime: number = 0;
  private lastCachedSteps: number = 0;
  private cacheTimer: NodeJS.Timeout | null = null;

  /**
   * Verifica se o pedômetro está disponível no dispositivo
   */
  async isAvailable(): Promise<boolean> {
    try {
      return await Pedometer.isAvailableAsync();
    } catch (error) {
      console.error('[PEDOMETER] Erro ao verificar disponibilidade:', error);
      return false;
    }
  }

  /**
   * Inicia rastreamento de sessão (para modal de tracking)
   * @param onUpdate Callback chamado quando passos são atualizados
   */
  async startTracking(onUpdate: (steps: number) => void): Promise<void> {
    const available = await this.isAvailable();
    if (!available) {
      throw new Error('Pedômetro não disponível neste dispositivo');
    }

    // Inicializar rastreamento diário se necessário (sem recursão)
    if (Platform.OS === 'android' && !this.dailyTrackingInitialized) {
      await this.initializeDailyTracking();
    }

    // Obter baseline (iOS: API, Android: cache)
    this.sessionStartTime = new Date();
    this.sessionStartSteps = Platform.OS === 'ios' 
      ? await this.getDailyStepsIOS()
      : this.dailyStepCount;
    this.sessionSteps = 0;

    console.log('[PEDOMETER] Rastreamento de sessão iniciado. Baseline:', this.sessionStartSteps);

    // Monitorar incrementos
    this.subscription = Pedometer.watchStepCount((result) => {
      this.sessionSteps += result.steps;
      onUpdate(this.sessionSteps);
    });
  }

  /**
   * Para o rastreamento de passos
   */
  stopTracking(): number {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
      console.log('[PEDOMETER] Rastreamento parado. Passos da sessão:', this.sessionSteps);
    }
    return this.sessionSteps;
  }

  /**
   * Obtém passos diários (plataforma-agnóstico)
   */
  async getDailySteps(): Promise<number> {
    if (Platform.OS === 'ios') {
      return this.getDailyStepsIOS();
    }
    
    // Android: inicializar se necessário
    if (!this.dailyTrackingInitialized) {
      await this.initializeDailyTracking();
    }
    
    return this.dailyStepCount;
  }

  /**
   * iOS: Busca passos por date range (API nativa)
   */
  private async getDailyStepsIOS(): Promise<number> {
    try {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const result = await Pedometer.getStepCountAsync(start, end);
      return result?.steps || 0;
    } catch (error) {
      console.error('[PEDOMETER] Erro iOS:', error);
      return 0;
    }
  }

  /**
   * Android: Inicializa rastreamento contínuo (UMA VEZ)
   */
  private async initializeDailyTracking(): Promise<void> {
    if (Platform.OS !== 'android' || this.dailyTrackingInitialized) return;
    
    // Carregar cache
    this.dailyStepCount = await this.loadCachedDailySteps();
    this.dailyTrackingInitialized = true;
    
    console.log('[PEDOMETER] 🚀 Rastreamento diário iniciado. Cache:', this.dailyStepCount);
    
    // Monitorar incrementos
    this.dailyStepSubscription = Pedometer.watchStepCount((result) => {
      this.dailyStepCount += result.steps;
      
      // Salvar com debouncing (tempo OU threshold)
      this.debouncedCacheSave();
    });

    // Auto-save periódico (backup)
    this.cacheTimer = setInterval(() => {
      this.forceCacheSave();
    }, CACHE_SAVE_INTERVAL);
  }

  /**
   * Salva cache com debouncing (otimização de I/O)
   */
  private debouncedCacheSave(): void {
    const now = Date.now();
    const timeDiff = now - this.lastCacheTime;
    const stepDiff = Math.abs(this.dailyStepCount - this.lastCachedSteps);
    
    // Salvar se: 30s passou OU 50+ passos acumulados
    if (timeDiff >= CACHE_SAVE_INTERVAL || stepDiff >= CACHE_STEP_THRESHOLD) {
      this.forceCacheSave();
    }
  }

  /**
   * Força salvamento imediato do cache
   */
  private forceCacheSave(): void {
    this.saveCachedDailySteps(this.dailyStepCount);
    this.lastCacheTime = Date.now();
    this.lastCachedSteps = this.dailyStepCount;
  }

  /**
   * Para rastreamento diário + limpa timers
   */
  private stopDailyTracking(): void {
    if (this.dailyStepSubscription) {
      this.dailyStepSubscription.remove();
      this.dailyStepSubscription = null;
    }
    
    if (this.cacheTimer) {
      clearInterval(this.cacheTimer);
      this.cacheTimer = null;
    }
    
    // Salvar antes de parar
    this.forceCacheSave();
    
    this.dailyTrackingInitialized = false;
    console.log('[PEDOMETER] Rastreamento diário parado');
  }

  /**
   * Carrega passos diários do cache (Android)
   */
  private async loadCachedDailySteps(): Promise<number> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StepData = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        
        // Retornar apenas se for do mesmo dia
        if (data.date === today) {
          return data.steps;
        }
      }
      return 0;
    } catch (error) {
      console.error('[PEDOMETER] Erro ao carregar cache:', error);
      return 0;
    }
  }

  /**
   * Salva passos diários no cache (Android)
   */
  private async saveCachedDailySteps(steps: number): Promise<void> {
    try {
      const data: StepData = {
        steps,
        date: new Date().toISOString().split('T')[0],
        lastUpdate: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[PEDOMETER] Erro ao salvar cache:', error);
    }
  }

  /**
   * Obtém passos em um intervalo de tempo específico
   * APENAS iOS - Android não suporta date ranges
   */
  async getStepsBetween(start: Date, end: Date): Promise<number> {
    try {
      // Funcionalidade exclusiva do iOS
      if (Platform.OS === 'ios') {
        const result = await Pedometer.getStepCountAsync(start, end);
        return result?.steps || 0;
      }
      
      // Android: não suportado
      console.warn('[PEDOMETER] getStepsBetween não suportado no Android');
      return 0;
    } catch (error) {
      console.error('[PEDOMETER] Erro ao obter passos no intervalo:', error);
      return 0;
    }
  }

  /**
   * Retorna a contagem de passos da sessão atual
   */
  getCurrentSteps(): number {
    return this.sessionSteps;
  }

  /**
   * Retorna quando a sessão foi iniciada
   */
  getSessionStartTime(): Date | null {
    return this.sessionStartTime;
  }

  /**
   * Reseta contagem diária (útil para testes)
   */
  async resetDailySteps(): Promise<void> {
    this.sessionSteps = 0;
    this.dailyStepCount = 0;
    this.lastCachedSteps = 0;
    this.stopDailyTracking();
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('[PEDOMETER] Passos resetados');
  }

  /**
   * Cleanup completo - SEMPRE chamar no unmount
   */
  cleanup(): void {
    this.stopTracking();
    this.stopDailyTracking();
    console.log('[PEDOMETER] Cleanup completo');
  }
}

export default new PedometerService();
