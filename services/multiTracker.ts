/**
 * ============================================
 * MULTI TRACKER SERVICE
 * ============================================
 * 
 * Gerencia múltiplos desafios de atividade simultaneamente.
 * Permite iniciar vários desafios (passos, km, minutos) ao mesmo tempo.
 * 
 * Features:
 * - Tracking simultâneo de N desafios
 * - Um único pedômetro/GPS para todos
 * - Auto-finaliza quando meta atingida
 * - Persistência em AsyncStorage
 * 
 * @created 02/01/2026
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import PedometerService from './pedometer';
import LocationService from './location';
import api from './api';

const ACTIVE_SESSIONS_KEY = '@FiQuestLife:activeSessions';

// ==========================================
// TYPES
// ==========================================

export interface ActiveSession {
  challengeId: string;
  userChallengeId: string;
  trackingType: 'STEPS' | 'DISTANCE' | 'DURATION';
  targetValue: number;
  targetUnit: string;
  startTime: number;
  currentValue: number;
  completed: boolean;
}

// ==========================================
// SERVICE
// ==========================================

class MultiTrackerService {
  private activeSessions: Map<string, ActiveSession> = new Map();
  private globalTracking = false;
  private updateInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<() => void> = new Set();

  /**
   * Inicia tracking de um desafio
   * Se já estiver rastreando globalmente, apenas adiciona à lista
   */
  async startTracking(session: Omit<ActiveSession, 'startTime' | 'currentValue' | 'completed'>): Promise<void> {
    const newSession: ActiveSession = {
      ...session,
      startTime: Date.now(),
      currentValue: 0,
      completed: false,
    };

    this.activeSessions.set(session.userChallengeId, newSession);
    await this.saveSessionsToStorage();

    // Sempre chamar startGlobalTracking para reavaliar sensores necessários
    await this.startGlobalTracking();

    this.notifyListeners();
    console.log(`[MULTI TRACKER] Desafio iniciado: ${session.trackingType} (${this.activeSessions.size} ativos)`);
  }

  /**
   * Para tracking de um desafio específico
   */
  async stopTracking(userChallengeId: string, markAsComplete = false): Promise<ActiveSession | null> {
    const session = this.activeSessions.get(userChallengeId);
    if (!session) return null;

    if (markAsComplete) {
      session.completed = true;
      // Enviar para o backend
      await this.syncToBackend(session);
    }

    this.activeSessions.delete(userChallengeId);
    await this.saveSessionsToStorage();

    // Se não há mais sessões ativas, parar tracking global
    if (this.activeSessions.size === 0) {
      await this.stopGlobalTracking();
    }

    this.notifyListeners();
    console.log(`[MULTI TRACKER] Desafio parado: ${userChallengeId} (${this.activeSessions.size} restantes)`);
    
    return session;
  }

  /**
   * Inicia tracking global (pedômetro + GPS + timer)
   */
  private async startGlobalTracking(): Promise<void> {
    // Verificar quais tipos de sessões existem
    const hasStepSessions = Array.from(this.activeSessions.values()).some(s => s.trackingType === 'STEPS');
    const hasDistanceSessions = Array.from(this.activeSessions.values()).some(s => s.trackingType === 'DISTANCE');

    // Iniciar pedômetro apenas se há sessões de STEPS e ainda não está rodando
    if (hasStepSessions) {
      if (!PedometerService.isTracking()) {
        try {
          console.log('[MULTI TRACKER] 🚀 Iniciando pedômetro...');
          await PedometerService.startTracking((steps) => {
            this.updateStepSessions(steps);
          });
          console.log('[MULTI TRACKER] ✅ Pedômetro iniciado');
        } catch (error) {
          console.error('[MULTI TRACKER] Erro ao iniciar pedômetro:', error);
        }
      } else {
        console.log('[MULTI TRACKER] ✅ Pedômetro já está ativo (mantendo sessão atual)');
      }
    }

    // Iniciar GPS apenas se há sessões de DISTANCE
    if (hasDistanceSessions) {
      try {
        await LocationService.startTracking();
        console.log('[MULTI TRACKER] GPS iniciado');
      } catch (error) {
        console.error('[MULTI TRACKER] Erro ao iniciar GPS:', error);
      }
    }

    // Update loop (a cada 2 segundos) - sempre ativo enquanto houver sessões
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => {
        this.updateAllSessions();
      }, 2000);
      console.log('[MULTI TRACKER] Timer iniciado');
      this.globalTracking = true;
    }

    console.log('[MULTI TRACKER] 🚀 Tracking ajustado');
  }

  /**
   * Para tracking global
   */
  private async stopGlobalTracking(): Promise<void> {
    if (!this.globalTracking) return;
    
    this.globalTracking = false;

    // Verificar se ainda há sessões ativas de cada tipo
    const hasStepSessions = Array.from(this.activeSessions.values()).some(s => s.trackingType === 'STEPS');
    const hasDistanceSessions = Array.from(this.activeSessions.values()).some(s => s.trackingType === 'DISTANCE');

    // Parar pedômetro apenas se não há mais sessões de STEPS
    if (!hasStepSessions) {
      console.log('[MULTI TRACKER] Parando pedômetro (sem sessões STEPS)');
      PedometerService.stopTracking();
    }

    // Parar GPS apenas se não há mais sessões de DISTANCE
    if (!hasDistanceSessions) {
      console.log('[MULTI TRACKER] Parando GPS (sem sessões DISTANCE)');
      LocationService.stopTracking();
    }

    // Parar timer apenas se não há mais sessões
    if (this.activeSessions.size === 0) {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
        console.log('[MULTI TRACKER] Timer parado (sem sessões)');
      }
    }

    console.log('[MULTI TRACKER] ⏹️ Tracking global ajustado');
  }

  /**
   * Atualiza sessões de passos
   */
  private updateStepSessions(steps: number): void {
    this.activeSessions.forEach((session, id) => {
      if (session.trackingType === 'STEPS') {
        session.currentValue = steps;
        this.checkCompletion(session);
      }
    });
    this.notifyListeners();
  }

  /**
   * Atualiza todas as sessões
   */
  private updateAllSessions(): void {
    const now = Date.now();
    const distance = LocationService.getCurrentDistance();

    this.activeSessions.forEach((session) => {
      // Atualizar DISTANCE
      if (session.trackingType === 'DISTANCE') {
        session.currentValue = distance;
        this.checkCompletion(session);
      }

      // Atualizar DURATION
      if (session.trackingType === 'DURATION') {
        session.currentValue = Math.floor((now - session.startTime) / 1000);
        this.checkCompletion(session);
      }
    });

    this.saveSessionsToStorage();
    this.notifyListeners();
  }

  /**
   * Verifica se desafio completou e auto-finaliza
   */
  private checkCompletion(session: ActiveSession): void {
    if (session.completed) return;

    const progress = session.currentValue / session.targetValue;
    if (progress >= 1.0) {
      console.log(`[MULTI TRACKER] ✅ Desafio completado: ${session.trackingType}`);
      session.completed = true;
      this.syncToBackend(session);
    }
  }

  /**
   * Sincroniza com backend
   */
  private async syncToBackend(session: ActiveSession): Promise<void> {
    try {
      await api.post(`/activity/track`, {
        userChallengeId: session.userChallengeId,
        trackingType: session.trackingType,
        value: session.currentValue,
        duration: Math.floor((Date.now() - session.startTime) / 1000),
      });
      console.log('[MULTI TRACKER] ✅ Sincronizado com backend');
    } catch (error) {
      console.error('[MULTI TRACKER] Erro ao sincronizar:', error);
    }
  }

  /**
   * Obtém todas as sessões ativas
   */
  getActiveSessions(): ActiveSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Obtém sessão específica
   */
  getSession(userChallengeId: string): ActiveSession | undefined {
    return this.activeSessions.get(userChallengeId);
  }

  /**
   * Verifica se desafio está ativo
   */
  isTracking(userChallengeId: string): boolean {
    return this.activeSessions.has(userChallengeId);
  }

  /**
   * Para todos os trackings
   */
  async stopAll(): Promise<void> {
    for (const [id, session] of this.activeSessions.entries()) {
      if (session.completed) {
        await this.syncToBackend(session);
      }
    }
    this.activeSessions.clear();
    await this.stopGlobalTracking();
    await this.saveSessionsToStorage();
    this.notifyListeners();
  }

  /**
   * Adiciona listener para mudanças
   */
  addListener(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifica todos os listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  /**
   * Salva sessões no AsyncStorage
   */
  private async saveSessionsToStorage(): Promise<void> {
    try {
      const data = Array.from(this.activeSessions.values());
      await AsyncStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[MULTI TRACKER] Erro ao salvar sessões:', error);
    }
  }

  /**
   * Carrega sessões do AsyncStorage (ao abrir app)
   */
  async loadSessionsFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(ACTIVE_SESSIONS_KEY);
      if (!stored) {
        console.log('[MULTI TRACKER] Nenhuma sessão salva');
        return;
      }
      
      const data: ActiveSession[] = JSON.parse(stored);
      
      if (data.length === 0) {
        console.log('[MULTI TRACKER] Nenhuma sessão ativa');
        return;
      }
      
      data.forEach(session => {
        this.activeSessions.set(session.userChallengeId, session);
      });

      // Aguardar 1 segundo para sensores estarem prontos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reiniciar tracking se houver sessões
      if (this.activeSessions.size > 0) {
        try {
          await this.startGlobalTracking();
          console.log(`[MULTI TRACKER] ✅ ${this.activeSessions.size} sessões restauradas`);
        } catch (trackingError) {
          console.error('[MULTI TRACKER] ⚠️ Erro ao reiniciar tracking:', trackingError);
          // Falha silenciosa - não deve crashar o app
        }
      }
    } catch (error) {
      console.error('[MULTI TRACKER] ⚠️ Erro ao carregar sessões:', error);
      // Limpar sessões corrompidas
      await AsyncStorage.removeItem(ACTIVE_SESSIONS_KEY);
    }
  }
}

export default new MultiTrackerService();
