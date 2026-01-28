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
import api from './api';
import LocationService from './location';
import PedometerService from './pedometer';

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
  isPaused: boolean;
  pausedTime: number; // Tempo total pausado em ms
  lastPauseTime: number | null; // Timestamp do último pause
  accumulatedDuration: number; // Para DURATION: duração já acumulada antes da última pausa
  baseSteps: number; // Para STEPS: passos já contabilizados antes de pausar
  baseDistance: number; // Para DISTANCE: distância já contabilizada antes de pausar
  sessionStartSteps: number; // Passos no momento de iniciar/retomar (para calcular delta)
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
  async startTracking(session: Omit<ActiveSession, 'startTime' | 'currentValue' | 'completed' | 'isPaused' | 'pausedTime' | 'lastPauseTime' | 'accumulatedDuration' | 'baseSteps' | 'baseDistance' | 'sessionStartSteps'>): Promise<void> {
    const newSession: ActiveSession = {
      ...session,
      startTime: Date.now(),
      currentValue: 0,
      completed: false,
      isPaused: false,
      pausedTime: 0,
      lastPauseTime: null,
      accumulatedDuration: 0,
      baseSteps: 0,
      baseDistance: 0,
      sessionStartSteps: 0,
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
   * Pausa tracking de um desafio específico
   * Mantém a sessão mas para de atualizar valores
   */
  async pauseTracking(userChallengeId: string): Promise<void> {
    const session = this.activeSessions.get(userChallengeId);
    if (!session || session.isPaused) return;

    // Para todos os tipos: calcular e salvar valor atual
    if (session.trackingType === 'DURATION') {
      const elapsedSinceLastResume = Math.floor((Date.now() - session.startTime) / 1000);
      session.accumulatedDuration = session.accumulatedDuration + elapsedSinceLastResume;
      session.currentValue = session.accumulatedDuration;
      console.log(`[MULTI TRACKER PAUSE] DURATION - currentValue: ${session.currentValue}s, acumulado: ${session.accumulatedDuration}s`);
    } else if (session.trackingType === 'STEPS') {
      // Salvar passos acumulados como base
      session.baseSteps = session.currentValue;
      console.log(`[MULTI TRACKER PAUSE] STEPS - baseSteps salvos: ${session.baseSteps}`);
    } else if (session.trackingType === 'DISTANCE') {
      // Salvar distância acumulada como base
      session.baseDistance = session.currentValue;
      console.log(`[MULTI TRACKER PAUSE] DISTANCE - baseDistance salva: ${session.baseDistance}`);
    }

    session.isPaused = true;
    session.lastPauseTime = Date.now();
    
    await this.saveSessionsToStorage();
    this.notifyListeners();
    
    console.log(`[MULTI TRACKER] Desafio pausado: ${userChallengeId}, currentValue salvo: ${session.currentValue}`);
  }

  /**
   * Retoma tracking de um desafio pausado
   */
  async resumeTracking(userChallengeId: string): Promise<void> {
    const session = this.activeSessions.get(userChallengeId);
    if (!session || !session.isPaused) return;

    // Calcular tempo que ficou pausado
    if (session.lastPauseTime) {
      const pauseDuration = Date.now() - session.lastPauseTime;
      session.pausedTime += pauseDuration;
    }

    // Para STEPS: resetar sessionStartSteps para capturar novo baseline ao retomar
    if (session.trackingType === 'STEPS') {
      session.sessionStartSteps = 0; // Será atualizado na primeira leitura do pedômetro
      console.log(`[MULTI TRACKER RESUME] STEPS - aguardando nova leitura (base: ${session.baseSteps})`);
    }

    // Para DISTANCE: GPS continuará do ponto anterior
    if (session.trackingType === 'DISTANCE') {
      console.log(`[MULTI TRACKER RESUME] DISTANCE - retomando (base: ${session.baseDistance})`);
    }

    // Resetar startTime para agora (novo ciclo para DURATION)
    session.startTime = Date.now();
    session.isPaused = false;
    session.lastPauseTime = null;

    // Reiniciar sensores se necessário
    await this.startGlobalTracking();

    await this.saveSessionsToStorage();
    this.notifyListeners();
    
    console.log(`[MULTI TRACKER] Desafio retomado: ${userChallengeId} (acumulado: ${session.accumulatedDuration}s)`);
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
      if (session.trackingType === 'STEPS' && !session.isPaused) {
        // Na primeira leitura após retomar, definir sessionStartSteps
        if (session.sessionStartSteps === 0) {
          session.sessionStartSteps = steps;
          console.log(`[MULTI TRACKER STEPS] Baseline definido: ${steps} passos`);
        }
        
        // Calcular passos nesta sessão + passos anteriores acumulados
        const stepsInCurrentSession = steps - session.sessionStartSteps;
        session.currentValue = session.baseSteps + stepsInCurrentSession;
        
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
    let hasChanges = false;

    this.activeSessions.forEach((session) => {
      // Não atualizar sessões pausadas
      if (session.isPaused) return;

      // Atualizar DISTANCE - somar distância atual com a base acumulada
      if (session.trackingType === 'DISTANCE') {
        const oldValue = session.currentValue;
        // distance é a distância da sessão atual do GPS, adicionar à base
        session.currentValue = session.baseDistance + distance;
        if (oldValue !== session.currentValue) hasChanges = true;
        this.checkCompletion(session);
      }

      // Atualizar DURATION - usar duração acumulada + tempo desde último resume
      if (session.trackingType === 'DURATION') {
        const elapsedSinceResume = Math.floor((now - session.startTime) / 1000);
        const newValue = session.accumulatedDuration + elapsedSinceResume;
        
        if (session.currentValue !== newValue) {
          session.currentValue = newValue;
          hasChanges = true;
          
          // Log a cada 3 segundos
          if (session.currentValue % 3 === 0) {
            console.log(`[MULTI TRACKER DURATION] Acumulado: ${session.accumulatedDuration}s + Desde resume: ${elapsedSinceResume}s = ${session.currentValue}s`);
          }
        }
        
        this.checkCompletion(session);
      }
    });

    // Só salvar e notificar se algo mudou
    if (hasChanges) {
      this.saveSessionsToStorage();
      this.notifyListeners();
    }
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
   * Valida se os desafios ainda existem no backend antes de restaurar
   */
  async loadSessionsFromStorage(): Promise<void> {
    try {
      console.log('[MULTI TRACKER] Carregando sessões...');
      const stored = await AsyncStorage.getItem(ACTIVE_SESSIONS_KEY);
      if (!stored) {
        console.log('[MULTI TRACKER] Nenhuma sessão salva');
        return;
      }
      
      const data: ActiveSession[] = JSON.parse(stored);
      
      if (!Array.isArray(data) || data.length === 0) {
        console.log('[MULTI TRACKER] Nenhuma sessão ativa');
        return;
      }
      
      // Validar todas as sessões em paralelo para melhor performance
      const validationPromises = data.map(async (session) => {
        try {
          await api.get(`/user-challenges/${session.userChallengeId}`);
          return {
            success: true,
            session: {
              ...session,
              baseSteps: session.baseSteps ?? 0,
              baseDistance: session.baseDistance ?? 0,
              sessionStartSteps: session.sessionStartSteps ?? 0,
            } as ActiveSession,
          };
        } catch (error: any) {
          const reason = error?.response?.status === 404 
            ? 'desafio não existe' 
            : error?.message || 'erro desconhecido';
          return {
            success: false,
            session,
            reason,
          };
        }
      });

      const results = await Promise.allSettled(validationPromises);
      const validSessions: ActiveSession[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { success, session, reason } = result.value;
          if (success) {
            validSessions.push(session as ActiveSession);
            console.log(`[MULTI TRACKER] ✅ Sessão válida: ${session.userChallengeId}`);
          } else {
            console.log(`[MULTI TRACKER] ⚠️ Descartando sessão: ${session.userChallengeId} (${reason})`);
          }
        } else {
          console.log(`[MULTI TRACKER] ⚠️ Falha crítica ao validar sessão ${data[index]?.userChallengeId}`);
        }
      });
      
      // Restaurar apenas sessões válidas
      if (validSessions.length === 0) {
        console.log('[MULTI TRACKER] Nenhuma sessão válida encontrada');
        await AsyncStorage.removeItem(ACTIVE_SESSIONS_KEY);
        return;
      }
      
      validSessions.forEach(session => {
        this.activeSessions.set(session.userChallengeId, session);
      });

      console.log(`[MULTI TRACKER] ${this.activeSessions.size} sessões válidas carregadas, aguardando sensores...`);
      
      // Aguardar 2 segundos para sensores estarem prontos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reiniciar tracking se houver sessões
      if (this.activeSessions.size > 0) {
        try {
          await this.startGlobalTracking();
          console.log(`[MULTI TRACKER] ✅ ${this.activeSessions.size} sessões restauradas com sucesso`);
        } catch (trackingError) {
          console.error('[MULTI TRACKER] ⚠️ Erro ao reiniciar tracking:', trackingError);
          // Limpar sessões se falhar (evita loop infinito de crashes)
          this.activeSessions.clear();
          await AsyncStorage.removeItem(ACTIVE_SESSIONS_KEY);
        }
      }
    } catch (error) {
      console.error('[MULTI TRACKER] ⚠️ Erro ao carregar sessões:', error);
      // Limpar dados corrompidos
      try {
        await AsyncStorage.removeItem(ACTIVE_SESSIONS_KEY);
        console.log('[MULTI TRACKER] Sessões corrompidas removidas');
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Limpa todas as sessões (útil ao fazer logout ou trocar de conta)
   */
  async clearAllSessions(): Promise<void> {
    console.log('[MULTI TRACKER] Limpando todas as sessões...');
    this.activeSessions.clear();
    await this.stopGlobalTracking();
    await AsyncStorage.removeItem(ACTIVE_SESSIONS_KEY);
    this.notifyListeners();
    console.log('[MULTI TRACKER] ✅ Sessões limpas');
  }
}

export default new MultiTrackerService();
