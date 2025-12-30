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
import { useEffect, useState } from 'react';
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
  // STATE
  // ==========================================
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [saving, setSaving] = useState(false);

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
  // TIMER EFFECT
  // ==========================================
  useEffect(() => {
    let interval: number | null = null;

    if (isTracking && startTime) {
      interval = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setDuration(elapsed);

        // Atualizar distância periodicamente se estiver rastreando GPS
        if (trackingType === 'DISTANCE' && LocationService.isTracking()) {
          const currentDistance = LocationService.getDistance();
          setDistance(currentDistance);
        }
      }, 1000);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isTracking, startTime, trackingType]);

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
      setStartTime(new Date());
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
   */
  const pause = (): void => {
    setIsTracking(false);
    stopAllSensors();
  };

  /**
   * Retoma o rastreamento após pausa
   * - Reinicia sensores do ponto atual
   * - Mantém valores acumulados
   */
  const resume = async (): Promise<void> => {
    try {
      setIsTracking(true);

      // Reiniciar pedômetro
      if (trackingType === 'STEPS' || trackingType === 'DISTANCE') {
        PedometerService.startTracking((stepCount) => {
          setSteps(stepCount);
        });
      }

      // Reiniciar GPS
      if (trackingType === 'DISTANCE') {
        await LocationService.startTracking();
      }
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
            onPress: () => {
              stopAllSensors();
              resetState();
            },
          },
        ]
      );
    } else {
      resetState();
    }
  };

  /**
   * Reseta todo o estado (sem confirmação)
   * - Útil para cleanup ou reset forçado
   */
  const reset = (): void => {
    stopAllSensors();
    resetState();
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
