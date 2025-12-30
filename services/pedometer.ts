/**
 * ============================================
 * PEDOMETER SERVICE
 * ============================================
 * 
 * Serviço para rastreamento de passos usando Expo Sensors.
 * Gerencia contagem diária de passos e persistência local.
 * 
 * @created 30/12/2025
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';

const STORAGE_KEY = '@FiQuestLife:dailySteps';

export interface StepData {
  steps: number;
  date: string;
  lastUpdate: number;
}

class PedometerService {
  private subscription: any = null;
  private dailySteps: number = 0;
  private sessionSteps: number = 0;
  private sessionStartSteps: number = 0;
  private sessionStartTime: Date | null = null;

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
   * Inicia o rastreamento contínuo de passos
   * @param onUpdate Callback chamado quando passos são atualizados
   */
  async startTracking(onUpdate: (steps: number) => void): Promise<void> {
    const available = await this.isAvailable();
    if (!available) {
      throw new Error('Pedômetro não disponível neste dispositivo');
    }

    // Obter passos atuais do sistema como baseline
    this.sessionStartTime = new Date();
    const currentSteps = await this.getDailySteps();
    this.sessionStartSteps = currentSteps;
    this.sessionSteps = 0;

    console.log('[PEDOMETER] Rastreamento iniciado. Baseline:', this.sessionStartSteps);

    // Iniciar subscription para monitorar mudanças
    this.subscription = Pedometer.watchStepCount(async (result) => {
      // Obter total atual do sistema
      const totalNow = await this.getDailySteps();
      
      // Calcular diferença desde o início da sessão
      this.sessionSteps = totalNow - this.sessionStartSteps;
      
      onUpdate(this.sessionSteps);
      console.log('[PEDOMETER] Passos da sessão:', this.sessionSteps, `(${this.sessionStartSteps} → ${totalNow})`);
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
   * Obtém a contagem de passos desde a meia-noite
   * Útil para sincronizar com o servidor
   */
  async getDailySteps(): Promise<number> {
    try {
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const result = await Pedometer.getStepCountAsync(start, end);
      return result?.steps || 0;
    } catch (error) {
      console.error('[PEDOMETER] Erro ao obter passos do dia:', error);
      return 0;
    }
  }

  /**
   * Obtém passos em um intervalo de tempo específico
   */
  async getStepsBetween(start: Date, end: Date): Promise<number> {
    try {
      const result = await Pedometer.getStepCountAsync(start, end);
      return result?.steps || 0;
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
   * Retorna a contagem de passos do dia todo (carregada do sistema)
   */
  getTotalDailySteps(): number {
    return this.dailySteps;
  }

  /**
   * Retorna quando a sessão foi iniciada
   */
  getSessionStartTime(): Date | null {
    return this.sessionStartTime;
  }

  /**
   * Salva progresso de passos no AsyncStorage
   */
  private async saveDailySteps(): Promise<void> {
    try {
      const data: StepData = {
        steps: this.dailySteps,
        date: new Date().toISOString().split('T')[0],
        lastUpdate: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[PEDOMETER] Erro ao salvar passos:', error);
    }
  }

  /**
   * Carrega progresso de passos do AsyncStorage
   * Reseta se for um novo dia
   */
  private async loadDailySteps(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StepData = JSON.parse(stored);
        const today = new Date().toISOString().split('T')[0];
        
        if (data.date === today) {
          this.dailySteps = data.steps;
          console.log('[PEDOMETER] Passos carregados:', this.dailySteps);
        } else {
          this.dailySteps = 0;
          console.log('[PEDOMETER] Novo dia, resetando passos');
        }
      } else {
        this.dailySteps = 0;
      }
    } catch (error) {
      console.error('[PEDOMETER] Erro ao carregar passos:', error);
      this.dailySteps = 0;
    }
  }

  /**
   * Reseta contagem diária (útil para testes)
   */
  async resetDailySteps(): Promise<void> {
    this.dailySteps = 0;
    this.sessionSteps = 0;
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log('[PEDOMETER] Passos resetados');
  }
}

export default new PedometerService();
