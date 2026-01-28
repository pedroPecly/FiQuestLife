/**
 * ============================================
 * USE ACTIVITY TRACKER HOOK
 * ============================================
 * 
 * Custom hook para gerenciar lógica de rastreamento de atividades físicas.
 * Centraliza toda a lógica de negócio, state management e integração
 * com sensores (pedômetro, GPS) e backend.
 * 
 * Benefícios:
 * - Separação de concerns (UI vs Lógica)
 * - Testabilidade (funções puras isoladas)
 * - Reusabilidade (pode ser usado em outros contextos)
 * - Manutenção simplificada
 * 
 * @created 30/12/2025
 * @phase Refatoração Fase 2
 */

import activityService from '@/services/activity';
import type { TrackingType } from '@/services/challenge';
import LocationService from '@/services/location';
import PedometerService from '@/services/pedometer';
import {
  calculateProgress,
  formatActivityValueWithUnit,
} from '@/utils/activityFormatters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

// ==========================================
// TYPES
// ==========================================

interface UseActivityTrackerParams {
  challengeId: string;
  trackingType: TrackingType;
  targetValue: number;
  onComplete: () => void;
}

interface ActivityTrackerState {
  isTracking: boolean;
  isPaused: boolean;
  startTime: Date | null;
  duration: number;
  steps: number;
  distance: number;
  saving: boolean;
  pausedTime: number; // Tempo total pausado em segundos
  lastPauseTime: number | null; // Timestamp do último pause
}

interface PersistedSession {
  challengeId: string;
  trackingType: TrackingType;
  startTime: number;
  duration: number;
  steps: number;
  distance: number;
  pausedTime: number;
  lastPauseTime: number | null;
  isTracking: boolean;
  accumulatedDuration: number;
}

interface ActivityTrackerComputed {
  currentValue: number;
  progress: number;
  displayValue: string;
  targetDisplay: string;
  canFinish: boolean;
}

interface ActivityTrackerActions {
  start: () => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  finish: () => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

export interface UseActivityTrackerReturn {
  state: ActivityTrackerState;
  computed: ActivityTrackerComputed;
  actions: ActivityTrackerActions;
}

// ==========================================
// HOOK
// ==========================================

export function useActivityTracker({
  challengeId,
  trackingType,
  targetValue,
  onComplete,
}: UseActivityTrackerParams): UseActivityTrackerReturn {
  // ==========================================
  // CONSTANTS
  // ==========================================
  const STORAGE_KEY = `@FiQuestLife:tracker:${challengeId}`;

  // ==========================================
  // STATE
  // ==========================================
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [saving, setSaving] = useState(false);
  const [pausedTime, setPausedTime] = useState(0); // Tempo total pausado
  const [lastPauseTime, setLastPauseTime] = useState<number | null>(null);
  const [accumulatedDuration, setAccumulatedDuration] = useState(0); // Duração acumulada antes da última pausa
  
  // Usar ref para ter valor síncrono e evitar problemas de closure
  const accumulatedDurationRef = useRef(0);
  const startTimeRef = useRef<Date | null>(null);

  // ==========================================
  // COMPUTED VALUES
  // ==========================================
  const getCurrentValue = (): number => {
    switch (trackingType) {
      case 'STEPS':
        return steps;
      case 'DISTANCE':
        return distance;
      case 'DURATION':
        return duration;
      default:
        return 0;
    }
  };

  const currentValue = getCurrentValue();
  const progress = calculateProgress(currentValue, targetValue);
  const displayValue = formatActivityValueWithUnit(currentValue, trackingType);
  const targetDisplay = formatActivityValueWithUnit(targetValue, trackingType);
  const canFinish = progress >= 100;
  const isPaused = startTime !== null && !isTracking;

  // ==========================================
  // PERSISTENCE
  // ==========================================

  /**
   * Salva o estado atual no AsyncStorage
   */
  const saveSession = async (): Promise<void> => {
    try {
      if (!startTime) return;

      const session: PersistedSession = {
        challengeId,
        trackingType,
        startTime: startTime.getTime(),
        duration,
        steps,
        distance,
        pausedTime,
        lastPauseTime,
        isTracking,
        accumulatedDuration,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      console.log(`[TRACKER] Sessão salva: ${trackingType} - ${currentValue}/${targetValue} (duração: ${duration}s)`);
    } catch (error) {
      console.error('[TRACKER] Erro ao salvar sessão:', error);
    }
  };

  /**
   * Carrega sessão salva do AsyncStorage
   */
  const loadSession = async (): Promise<void> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const session: PersistedSession = JSON.parse(stored);
      
      // Verificar se é para o mesmo desafio
      if (session.challengeId !== challengeId) return;

      console.log(`[TRACKER] Restaurando sessão: ${session.trackingType}`);
      console.log(`  - Duração: ${session.duration}s`);
      console.log(`  - Acumulado: ${session.accumulatedDuration}s`);
      
      const restoredStartTime = new Date(session.startTime);
      const restoredAccumulatedDuration = session.accumulatedDuration || session.duration;
      
      setStartTime(restoredStartTime);
      setDuration(session.duration);
      setSteps(session.steps);
      setDistance(session.distance);
      setPausedTime(session.pausedTime);
      setLastPauseTime(session.lastPauseTime);
      setAccumulatedDuration(restoredAccumulatedDuration);
      
      // CRÍTICO: Atualizar refs também
      startTimeRef.current = restoredStartTime;
      accumulatedDurationRef.current = restoredAccumulatedDuration;
      
      // Se estava rastreando, retomar automaticamente
      if (session.isTracking) {
        console.log('[TRACKER] Retomando rastreamento automaticamente...');
        setIsTracking(true);
        await restartSensors();
      }
    } catch (error) {
      console.error('[TRACKER] Erro ao carregar sessão:', error);
    }
  };

  /**
   * Remove sessão salva do AsyncStorage
   */
  const clearSession = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('[TRACKER] Sessão removida');
    } catch (error) {
      console.error('[TRACKER] Erro ao limpar sessão:', error);
    }
  };

  /**
   * Reinicia sensores (usado ao restaurar sessão)
   */
  const restartSensors = async (): Promise<void> => {
    try {
      // Reiniciar pedômetro
      if (trackingType === 'STEPS' || trackingType === 'DISTANCE') {
        const available = await PedometerService.isAvailable();
        if (available) {
          // Usar steps já acumulados como baseline
          PedometerService.startTracking((newSteps) => {
            setSteps(prev => Math.max(prev, newSteps));
          });
        }
      }

      // Reiniciar GPS
      if (trackingType === 'DISTANCE') {
        const hasPermission = await LocationService.requestPermissions();
        if (hasPermission) {
          await LocationService.startTracking();
        }
      }
    } catch (error) {
      console.error('[TRACKER] Erro ao reiniciar sensores:', error);
    }
  };

  // ==========================================
  // TIMER EFFECT
  // ==========================================
  useEffect(() => {
    let interval: number | null = null;

    if (isTracking && startTime) {
      // Atualizar refs
      startTimeRef.current = startTime;
      
      // Log inicial
      console.log(`[TRACKER TIMER] Iniciando timer - accumulatedDuration: ${accumulatedDurationRef.current}s`);
      
      interval = window.setInterval(() => {
        // Calcular tempo desde o último start/resume usando ref
        const currentStartTime = startTimeRef.current;
        if (!currentStartTime) return;
        
        const elapsedSinceResume = Math.floor((Date.now() - currentStartTime.getTime()) / 1000);
        // Somar com o tempo acumulado antes (usar ref para valor mais recente)
        const totalDuration = accumulatedDurationRef.current + elapsedSinceResume;
        setDuration(totalDuration);

        // Log a cada 3 segundos para debug
        if (totalDuration % 3 === 0) {
          console.log(`[TRACKER TIMER] Acumulado: ${accumulatedDurationRef.current}s + Atual: ${elapsedSinceResume}s = ${totalDuration}s`);
        }

        // Atualizar distância periodicamente se estiver rastreando GPS
        if (trackingType === 'DISTANCE' && LocationService.isTracking()) {
          const currentDistance = LocationService.getDistance();
          setDistance(currentDistance);
        }

        // Salvar progresso periodicamente (a cada 5 segundos)
        if (totalDuration % 5 === 0 && totalDuration > 0) {
          saveSession();
        }
      }, 1000);
    }

    return () => {
      if (interval !== null) {
        console.log('[TRACKER TIMER] Parando timer');
        clearInterval(interval);
      }
    };
  }, [isTracking, startTime, trackingType]);

  // ==========================================
  // LOAD SAVED SESSION ON MOUNT
  // ==========================================
  useEffect(() => {
    loadSession();
    
    // Cleanup ao desmontar
    return () => {
      // Se estiver rastreando ao sair da tela, salvar estado
      if (isTracking || isPaused) {
        saveSession();
      }
    };
  }, []); // Executar apenas na montagem

  // ==========================================
  // HELPERS
  // ==========================================
  const getActivityType = (type: TrackingType): string => {
    switch (type) {
      case 'STEPS':
        return 'WALK';
      case 'DISTANCE':
        return 'RUN';
      case 'DURATION':
        return 'EXERCISE';
      case 'ALTITUDE':
        return 'CLIMB';
      case 'MANUAL':
      default:
        return 'OTHER';
    }
  };

  const stopAllSensors = () => {
    PedometerService.stopTracking();
    if (trackingType === 'DISTANCE' && LocationService.isTracking()) {
      LocationService.stopTracking();
    }
  };

  const resetState = () => {
    setIsTracking(false);
    setStartTime(null);
    setDuration(0);
    setSteps(0);
    setDistance(0);
    setSaving(false);
    setPausedTime(0);
    setLastPauseTime(null);
    setAccumulatedDuration(0);
    
    // Resetar refs também
    startTimeRef.current = null;
    accumulatedDurationRef.current = 0;
  };

  // ==========================================
  // ACTIONS
  // ==========================================

  /**
   * Inicia o rastreamento de atividade
   * - Valida e inicia sensores necessários (pedômetro, GPS)
   * - Solicita permissões se necessário
   * - Define startTime e isTracking = true
   */
  const start = async (): Promise<void> => {
    try {
      // Iniciar pedômetro para STEPS e DISTANCE
      if (trackingType === 'STEPS' || trackingType === 'DISTANCE') {
        const available = await PedometerService.isAvailable();
        if (available) {
          PedometerService.startTracking((stepCount) => {
            setSteps(stepCount);
          });
        } else {
          Alert.alert(
            'Pedômetro Indisponível',
            'Seu dispositivo não suporta contagem de passos.'
          );
          return;
        }
      }

      // Iniciar GPS para DISTANCE
      if (trackingType === 'DISTANCE') {
        const hasPermission = await LocationService.requestPermissions();
        if (hasPermission) {
          await LocationService.startTracking();
        } else {
          Alert.alert(
            'Permissão Necessária',
            'É necessário permitir acesso à localização para rastrear distância.'
          );
          // Parar pedômetro se GPS falhou
          PedometerService.stopTracking();
          return;
        }
      }

      setIsTracking(true);
      const newStartTime = new Date();
      setStartTime(newStartTime);
      startTimeRef.current = newStartTime; // Atualizar ref
      accumulatedDurationRef.current = 0; // Resetar acumulado
      await saveSession();
    } catch (error) {
      console.error('Erro ao iniciar rastreamento:', error);
      Alert.alert('Erro', 'Não foi possível iniciar o rastreamento.');
      stopAllSensors();
    }
  };

  /**
   * Pausa o rastreamento
   * - Para sensores mas mantém estado
   * - Permite retomar posteriormente
   * - Salva a duração acumulada
   */
  const pause = (): void => {
    if (!isTracking) return;

    // Calcular e salvar a duração final neste momento
    if (startTime) {
      const elapsedSinceResume = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const finalDuration = accumulatedDurationRef.current + elapsedSinceResume;
      
      console.log('[TRACKER PAUSE] ==================');
      console.log(`  Tempo desde último resume: ${elapsedSinceResume}s`);
      console.log(`  Acumulado anterior: ${accumulatedDurationRef.current}s`);
      console.log(`  Duração final: ${finalDuration}s`);
      console.log('====================================');
      
      // Atualizar state E ref
      setDuration(finalDuration);
      setAccumulatedDuration(finalDuration);
      accumulatedDurationRef.current = finalDuration; // CRÍTICO: atualizar ref imediatamente
    }

    setIsTracking(false);
    setLastPauseTime(Date.now());
    stopAllSensors();
    
    // Salvar com pequeno delay para garantir que states foram atualizados
    setTimeout(() => saveSession(), 200);
  };

  /**
   * Retoma o rastreamento após pausa
   * - Reinicia sensores do ponto atual
   * - Mantém valores acumulados
   * - Reseta o startTime para agora (novo ciclo)
   */
  const resume = async (): Promise<void> => {
    try {
      if (accumulatedDurationRef.current === 0 && !startTime) {
        Alert.alert('Erro', 'Não há sessão para retomar.');
        return;
      }

      // Calcular tempo que ficou pausado (para estatísticas)
      if (lastPauseTime) {
        const pauseDuration = Math.floor((Date.now() - lastPauseTime) / 1000);
        setPausedTime(prev => prev + pauseDuration);
        setLastPauseTime(null);
      }

      console.log('[TRACKER RESUME] ==================');
      console.log(`  Duração a retomar: ${accumulatedDurationRef.current}s`);
      console.log(`  Nova startTime: agora`);
      console.log('====================================');

      // Resetar startTime para agora (novo ciclo)
      // O timer vai somar accumulatedDuration + tempo desde agora
      const newStartTime = new Date();
      setStartTime(newStartTime);
      startTimeRef.current = newStartTime; // CRÍTICO: atualizar ref imediatamente
      setIsTracking(true);

      // Reiniciar pedômetro (mantém steps acumulados)
      if (trackingType === 'STEPS' || trackingType === 'DISTANCE') {
        const available = await PedometerService.isAvailable();
        if (available) {
          PedometerService.startTracking((stepCount) => {
            // Somar novos passos aos já existentes
            setSteps(prev => Math.max(prev, stepCount));
          });
        }
      }

      // Reiniciar GPS (continua da última posição)
      if (trackingType === 'DISTANCE') {
        const hasPermission = await LocationService.requestPermissions();
        if (hasPermission) {
          await LocationService.startTracking();
        }
      }

      await saveSession();
    } catch (error) {
      console.error('Erro ao retomar rastreamento:', error);
      Alert.alert('Erro', 'Não foi possível retomar o rastreamento.');
    }
  };

  /**
   * Finaliza o rastreamento e salva no backend
   * - Para todos os sensores
   * - Registra atividade via API
   * - Atualiza progresso do desafio
   * - Chama onComplete se sucesso
   * - Remove sessão salva
   */
  const finish = async (): Promise<void> => {
    try {
      setSaving(true);

      // Obter dados finais
      let finalDistance = distance;
      if (trackingType === 'DISTANCE' && LocationService.isTracking()) {
        const session = LocationService.stopTracking();
        finalDistance = session.distance;
      }

      // Parar todos os sensores
      stopAllSensors();

      if (!startTime) {
        Alert.alert('Erro', 'Dados de início não encontrados.');
        return;
      }

      const endTime = new Date();

      // Registrar atividade no backend
      await activityService.trackActivity({
        challengeId,
        activityType: getActivityType(trackingType),
        steps: trackingType === 'STEPS' ? steps : undefined,
        distance: trackingType === 'DISTANCE' ? finalDistance : undefined,
        duration,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      // Atualizar progresso do desafio
      await activityService.updateChallengeProgress(challengeId, {
        steps: trackingType === 'STEPS' ? steps : undefined,
        distance: trackingType === 'DISTANCE' ? finalDistance : undefined,
        duration: trackingType === 'DURATION' ? duration : undefined,
      });

      // Remover sessão salva
      await clearSession();

      Alert.alert(
        'Atividade Registrada! 🎉',
        'Parabéns! Sua atividade foi salva com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetState();
              onComplete();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Erro ao salvar atividade:', error);
      Alert.alert(
        'Erro ao Salvar',
        error.response?.data?.error || 'Não foi possível registrar a atividade.'
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cancela o rastreamento atual
   * - Exibe confirmação se estiver rastreando
   * - Para sensores e reseta estado
   * - Remove sessão salva
   */
  const cancel = (): void => {
    if (isTracking || isPaused) {
      Alert.alert(
        'Cancelar Rastreamento',
        'Deseja realmente cancelar? O progresso será perdido.',
        [
          { text: 'Continuar', style: 'cancel' },
          {
            text: 'Cancelar',
            style: 'destructive',
            onPress: async () => {
              stopAllSensors();
              resetState();
              await clearSession();
            },
          },
        ]
      );
    } else {
      resetState();
      clearSession();
    }
  };

  /**
   * Reseta todo o estado (sem confirmação)
   * - Útil para cleanup ou reset forçado
   * - Remove sessão salva
   */
  const reset = (): void => {
    stopAllSensors();
    resetState();
    clearSession();
  };

  // ==========================================
  // RETURN
  // ==========================================
  return {
    state: {
      isTracking,
      isPaused,
      startTime,
      duration,
      steps,
      distance,
      saving,
      pausedTime,
      lastPauseTime,
    },
    computed: {
      currentValue,
      progress,
      displayValue,
      targetDisplay,
      canFinish,
    },
    actions: {
      start,
      pause,
      resume,
      finish,
      cancel,
      reset,
    },
  };
}
