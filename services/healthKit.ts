/**
 * 🏥 Apple HealthKit Service
 * 
 * Integração com Apple Health para obter dados precisos de atividades físicas:
 * - Passos diários
 * - Distância percorrida (caminhada + corrida)
 * - Calorias ativas queimadas
 * - Workouts completos (com dados do Apple Watch)
 * 
 * Requer: react-native-health
 */

import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export interface HealthData {
  steps: number;
  distance: number; // metros
  activeEnergy: number; // kcal
  heartRate?: number;
  workouts?: Workout[];
}

export interface Workout {
  type: string; // 'Running', 'Walking', 'Cycling'
  distance: number; // metros
  duration: number; // segundos
  calories: number;
  startDate: Date;
  endDate: Date;
}

class HealthKitService {
  private initialized = false;

  /**
   * Inicializa HealthKit e solicita permissões ao usuário
   */
  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('[HEALTHKIT] ⚠️ Apenas disponível no iOS');
      return false;
    }

    // Não funciona no Expo Go
    if (Constants.appOwnership === 'expo') {
      console.log('[HEALTHKIT] ⚠️ Não disponível no Expo Go (requer Development Build)');
      return false;
    }

    if (this.initialized) {
      console.log('[HEALTHKIT] ✅ Já inicializado');
      return true;
    }

    const permissions: HealthKitPermissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.StepCount,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.DistanceCycling,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.Workout,
        ],
        write: [
          AppleHealthKit.Constants.Permissions.StepCount,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.Workout,
        ],
      },
    };

    return new Promise((resolve) => {
      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.error('[HEALTHKIT] ❌ Erro ao inicializar:', error);
          resolve(false);
        } else {
          console.log('[HEALTHKIT] ✅ Inicializado com sucesso');
          this.initialized = true;
          resolve(true);
        }
      });
    });
  }

  /**
   * Obtém dados de atividade do dia atual
   * Inclui: passos, distância, calorias
   */
  async getTodayData(): Promise<HealthData> {
    await this.initialize();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    console.log('[HEALTHKIT] 📊 Buscando dados do dia...');

    const [steps, distance, energy] = await Promise.all([
      this.getSteps(today, now),
      this.getDistance(today, now),
      this.getActiveEnergy(today, now),
    ]);

    console.log(`[HEALTHKIT] ✅ Dados obtidos: ${steps} passos, ${distance.toFixed(0)}m, ${energy.toFixed(0)}kcal`);

    return {
      steps,
      distance,
      activeEnergy: energy,
    };
  }

  /**
   * Obtém passos em um período específico
   */
  private async getSteps(startDate: Date, endDate: Date): Promise<number> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getStepCount(options, (err, results) => {
        if (err) {
          console.error('[HEALTHKIT] ❌ Erro ao obter passos:', err);
          resolve(0);
        } else {
          const steps = results?.value || 0;
          console.log(`[HEALTHKIT] 👣 Passos: ${steps}`);
          resolve(steps);
        }
      });
    });
  }

  /**
   * Obtém distância percorrida (caminhada + corrida)
   * Dados vêm do acelerômetro do iPhone ou Apple Watch
   */
  private async getDistance(startDate: Date, endDate: Date): Promise<number> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
        if (err) {
          console.error('[HEALTHKIT] ❌ Erro ao obter distância:', err);
          resolve(0);
        } else {
          const distance = results?.value || 0;
          console.log(`[HEALTHKIT] 📏 Distância: ${distance.toFixed(0)}m`);
          resolve(distance);
        }
      });
    });
  }

  /**
   * Obtém calorias ativas queimadas (exclui metabolismo basal)
   */
  private async getActiveEnergy(startDate: Date, endDate: Date): Promise<number> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
        if (err) {
          console.error('[HEALTHKIT] ❌ Erro ao obter energia:', err);
          resolve(0);
        } else {
          const energy = Array.isArray(results) && results.length > 0 ? results[0].value : 0;
          console.log(`[HEALTHKIT] 🔥 Calorias: ${energy.toFixed(0)}kcal`);
          resolve(energy);
        }
      });
    });
  }

  /**
   * Obtém workouts completos do dia (corridas, caminhadas, ciclismo)
   * Inclui dados detalhados do Apple Watch se disponível
   */
  async getTodayWorkouts(): Promise<Workout[]> {
    await this.initialize();

    return new Promise((resolve) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const options = {
        startDate: today.toISOString(),
        endDate: new Date().toISOString(),
      };

      AppleHealthKit.getSamples(options, (err, results) => {
        if (err) {
          console.error('[HEALTHKIT] ❌ Erro ao obter workouts:', err);
          resolve([]);
        } else {
          const workouts = (results || []).map((w: any) => ({
            type: w.activityName || 'Unknown',
            distance: w.distance || 0,
            duration: w.duration || 0,
            calories: w.calories || 0,
            startDate: new Date(w.start),
            endDate: new Date(w.end),
          }));
          
          console.log(`[HEALTHKIT] 🏃 ${workouts.length} workouts encontrados`);
          resolve(workouts);
        }
      });
    });
  }

  /**
   * Salva workout no Apple Health
   * Usado quando usuário completa desafio manualmente via modal
   */
  async saveWorkout(workout: {
    type: 'Running' | 'Walking' | 'Cycling';
    distance: number;
    duration: number;
    calories: number;
    startDate: Date;
    endDate: Date;
  }): Promise<boolean> {
    await this.initialize();

    return new Promise((resolve) => {
      const activityType = workout.type as any; // Type conversion for compatibility
      AppleHealthKit.saveWorkout(
        {
          type: activityType,
          energyBurned: workout.calories,
          startDate: workout.startDate.toISOString(),
          endDate: workout.endDate.toISOString(),
        } as any, // Compatibility with library types
        (err) => {
          if (err) {
            console.error('[HEALTHKIT] ❌ Erro ao salvar workout:', err);
            resolve(false);
          } else {
            console.log('[HEALTHKIT] ✅ Workout salvo no Apple Health');
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * Verifica se HealthKit está disponível (apenas iOS)
   */
  isAvailable(): boolean {
    return Platform.OS === 'ios';
  }

  /**
   * Obtém dados históricos dos últimos N dias
   * Útil para preencher progresso de desafios semanais/mensais
   */
  async getHistoricalData(days: number): Promise<HealthData[]> {
    await this.initialize();

    const results: HealthData[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const [steps, distance, energy] = await Promise.all([
        this.getSteps(date, endDate),
        this.getDistance(date, endDate),
        this.getActiveEnergy(date, endDate),
      ]);

      results.push({ steps, distance, activeEnergy: energy });
    }

    console.log(`[HEALTHKIT] 📅 Dados históricos de ${days} dias obtidos`);
    return results;
  }
}

export default new HealthKitService();
