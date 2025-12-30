/**
 * 🤖 Google Fit Service (Android)
 * 
 * Integração com Google Fit para obter dados de atividades físicas:
 * - Passos diários
 * - Distância percorrida
 * - Calorias queimadas
 * - Atividades registradas
 * 
 * Requer: react-native-health (também suporta Android via Google Fit)
 */

import AppleHealthKit from 'react-native-health'; // Também funciona no Android!
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export interface HealthData {
  steps: number;
  distance: number; // metros
  activeEnergy: number; // kcal
  activities?: Activity[];
}

export interface Activity {
  type: string; // 'Running', 'Walking', 'Cycling'
  distance: number;
  duration: number; // segundos
  calories: number;
  startDate: Date;
  endDate: Date;
}

class GoogleFitService {
  private initialized = false;

  /**
   * Inicializa Google Fit e solicita permissões
   */
  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      console.log('[GOOGLE FIT] ⚠️ Apenas disponível no Android');
      return false;
    }

    // Não funciona no Expo Go
    if (Constants.appOwnership === 'expo') {
      console.log('[GOOGLE FIT] ⚠️ Não disponível no Expo Go (requer Development Build)');
      return false;
    }

    if (this.initialized) {
      console.log('[GOOGLE FIT] ✅ Já inicializado');
      return true;
    }

    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.StepCount,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.DistanceCycling,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        ],
        write: [
          AppleHealthKit.Constants.Permissions.StepCount,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
        ],
      },
    };

    return new Promise((resolve) => {
      // No Android, initHealthKit conecta ao Google Fit
      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.error('[GOOGLE FIT] ❌ Erro ao inicializar:', error);
          resolve(false);
        } else {
          console.log('[GOOGLE FIT] ✅ Inicializado com sucesso');
          this.initialized = true;
          resolve(true);
        }
      });
    });
  }

  /**
   * Obtém dados de atividade do dia atual
   */
  async getTodayData(): Promise<HealthData> {
    await this.initialize();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    console.log('[GOOGLE FIT] 📊 Buscando dados do dia...');

    const [steps, distance, energy] = await Promise.all([
      this.getSteps(today, now),
      this.getDistance(today, now),
      this.getCalories(today, now),
    ]);

    console.log(`[GOOGLE FIT] ✅ Dados obtidos: ${steps} passos, ${distance.toFixed(0)}m, ${energy.toFixed(0)}kcal`);

    return {
      steps,
      distance,
      activeEnergy: energy,
    };
  }

  /**
   * Obtém passos em um período
   */
  private async getSteps(startDate: Date, endDate: Date): Promise<number> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getStepCount(options, (err, results) => {
        if (err) {
          console.error('[GOOGLE FIT] ❌ Erro ao obter passos:', err);
          resolve(0);
        } else {
          const steps = results?.value || 0;
          console.log(`[GOOGLE FIT] 👣 Passos: ${steps}`);
          resolve(steps);
        }
      });
    });
  }

  /**
   * Obtém distância percorrida
   */
  private async getDistance(startDate: Date, endDate: Date): Promise<number> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
        if (err) {
          console.error('[GOOGLE FIT] ❌ Erro ao obter distância:', err);
          resolve(0);
        } else {
          const distance = results?.value || 0;
          console.log(`[GOOGLE FIT] 📏 Distância: ${distance.toFixed(0)}m`);
          resolve(distance);
        }
      });
    });
  }

  /**
   * Obtém calorias queimadas
   */
  private async getCalories(startDate: Date, endDate: Date): Promise<number> {
    return new Promise((resolve) => {
      const options = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
        if (err) {
          console.error('[GOOGLE FIT] ❌ Erro ao obter calorias:', err);
          resolve(0);
        } else {
          const calories = Array.isArray(results) && results.length > 0 ? results[0].value : 0;
          console.log(`[GOOGLE FIT] 🔥 Calorias: ${calories.toFixed(0)}kcal`);
          resolve(calories);
        }
      });
    });
  }

  /**
   * Obtém atividades do dia
   */
  async getTodayActivities(): Promise<Activity[]> {
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
          console.error('[GOOGLE FIT] ❌ Erro ao obter atividades:', err);
          resolve([]);
        } else {
          const activities = (results || []).map((a: any) => ({
            type: a.activityName || 'Unknown',
            distance: a.distance || 0,
            duration: a.duration || 0,
            calories: a.calories || 0,
            startDate: new Date(a.start),
            endDate: new Date(a.end),
          }));
          
          console.log(`[GOOGLE FIT] 🏃 ${activities.length} atividades encontradas`);
          resolve(activities);
        }
      });
    });
  }

  /**
   * Salva atividade no Google Fit
   */
  async saveActivity(activity: {
    type: 'Running' | 'Walking' | 'Cycling';
    distance: number;
    duration: number;
    calories: number;
    startDate: Date;
    endDate: Date;
  }): Promise<boolean> {
    await this.initialize();

    return new Promise((resolve) => {
      const activityType = activity.type as any; // Type conversion for compatibility
      AppleHealthKit.saveWorkout(
        {
          type: activityType,
          energyBurned: activity.calories,
          startDate: activity.startDate.toISOString(),
          endDate: activity.endDate.toISOString(),
        } as any, // Compatibility with library types
        (err) => {
          if (err) {
            console.error('[GOOGLE FIT] ❌ Erro ao salvar atividade:', err);
            resolve(false);
          } else {
            console.log('[GOOGLE FIT] ✅ Atividade salva no Google Fit');
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * Verifica se Google Fit está disponível
   */
  isAvailable(): boolean {
    return Platform.OS === 'android';
  }

  /**
   * Obtém dados históricos dos últimos N dias
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
        this.getCalories(date, endDate),
      ]);

      results.push({ steps, distance, activeEnergy: energy });
    }

    console.log(`[GOOGLE FIT] 📅 Dados históricos de ${days} dias obtidos`);
    return results;
  }
}

export default new GoogleFitService();
