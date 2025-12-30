/**
 * ============================================
 * ACTIVITY TRACKER MODAL
 * ============================================
 * 
 * Modal para rastreamento de atividades físicas em tempo real.
 * Integra pedômetro e GPS para desafios com trackingType.
 * 
 * Features:
 * - Contagem de passos em tempo real (Pedometer)
 * - Rastreamento de distância via GPS
 * - Timer de duração
 * - Progresso visual do desafio
 * - Sincronização automática com backend
 * 
 * @created 30/12/2025
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PedometerService from '@/services/pedometer';
import LocationService from '@/services/location';
import activityService from '@/services/activity';
import type { TrackingType } from '@/services/challenge';

interface ActivityTrackerModalProps {
  visible: boolean;
  onClose: () => void;
  challengeId: string;
  trackingType: TrackingType;
  targetValue: number;
  targetUnit: string;
  onComplete: () => void;
}

export function ActivityTrackerModal({
  visible,
  onClose,
  challengeId,
  trackingType,
  targetValue,
  targetUnit,
  onComplete,
}: ActivityTrackerModalProps) {
  // ==========================================
  // STATE
  // ==========================================
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0); // segundos
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0); // metros
  const [saving, setSaving] = useState(false);

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
  // HANDLERS
  // ==========================================
  const handleStart = async () => {
    try {
      // Iniciar pedômetro
      if (trackingType === 'STEPS' || trackingType === 'DISTANCE') {
        const available = await PedometerService.isAvailable();
        if (available) {
          PedometerService.startTracking((stepCount) => {
            setSteps(stepCount);
          });
        } else {
          Alert.alert(
            'Pedômetro Indisponível',
            'Seu dispositivo não suporta contagem de passos. Use entrada manual.'
          );
          return;
        }
      }

      // Iniciar GPS
      if (trackingType === 'DISTANCE') {
        const hasPermission = await LocationService.requestPermissions();
        if (hasPermission) {
          await LocationService.startTracking();
        } else {
          Alert.alert(
            'Permissão de Localização',
            'É necessário permitir acesso à localização para rastrear distância.'
          );
          return;
        }
      }

      setIsTracking(true);
      setStartTime(new Date());
    } catch (error) {
      console.error('Erro ao iniciar rastreamento:', error);
      Alert.alert('Erro', 'Não foi possível iniciar o rastreamento.');
    }
  };

  const handlePause = () => {
    setIsTracking(false);
    PedometerService.stopTracking();
    if (trackingType === 'DISTANCE') {
      LocationService.stopTracking();
    }
  };

  const handleResume = async () => {
    setIsTracking(true);
    // Continuar do ponto atual
    if (trackingType === 'STEPS' || trackingType === 'DISTANCE') {
      PedometerService.startTracking((stepCount) => {
        setSteps(stepCount);
      });
    }
    if (trackingType === 'DISTANCE') {
      await LocationService.startTracking();
    }
  };

  const handleFinish = async () => {
    try {
      setSaving(true);

      // Obter dados finais de distância se GPS estiver ativo
      let finalDistance = distance;
      if (trackingType === 'DISTANCE' && LocationService.isTracking()) {
        const session = LocationService.stopTracking();
        finalDistance = session.distance;
      } else if (trackingType === 'DISTANCE') {
        LocationService.stopTracking();
      }

      // Parar serviços
      PedometerService.stopTracking();

      if (!startTime) {
        Alert.alert('Erro', 'Dados de início não encontrados.');
        return;
      }

      const endTime = new Date();

      // Registrar atividade no backend
      const response = await activityService.trackActivity({
        challengeId,
        activityType: getActivityType(trackingType),
        steps: trackingType === 'STEPS' ? steps : undefined,
        distance: trackingType === 'DISTANCE' ? distance : undefined,
        duration,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      // Atualizar progresso do desafio
      await activityService.updateChallengeProgress(challengeId, {
        steps: trackingType === 'STEPS' ? steps : undefined,
        distance: trackingType === 'DISTANCE' ? distance : undefined,
        duration: trackingType === 'DURATION' ? duration : undefined,
      });

      Alert.alert(
        'Atividade Registrada! 🎉',
        `Parabéns! Sua atividade foi salva com sucesso.`,
        [
          {
            text: 'OK',
            onPress: () => {
              onComplete();
              handleClose();
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

  const handleClose = () => {
    if (isTracking) {
      Alert.alert(
        'Rastreamento Ativo',
        'Deseja realmente cancelar? O progresso será perdido.',
        [
          { text: 'Continuar Rastreando', style: 'cancel' },
          {
            text: 'Cancelar',
            style: 'destructive',
            onPress: () => {
              PedometerService.stopTracking();
              if (trackingType === 'DISTANCE') {
                LocationService.stopTracking();
              }
              resetState();
              onClose();
            },
          },
        ]
      );
    } else {
      resetState();
      onClose();
    }
  };

  const resetState = () => {
    setIsTracking(false);
    setStartTime(null);
    setDuration(0);
    setSteps(0);
    setDistance(0);
  };

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
      default:
        return 'OTHER';
    }
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };

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

  const getProgressPercentage = (): number => {
    const current = getCurrentValue();
    return Math.min((current / targetValue) * 100, 100);
  };

  const getDisplayValue = (): string => {
    switch (trackingType) {
      case 'STEPS':
        return `${steps.toLocaleString()} passos`;
      case 'DISTANCE':
        return formatDistance(distance);
      case 'DURATION':
        return formatDuration(duration);
      default:
        return '0';
    }
  };

  const getTargetDisplay = (): string => {
    switch (trackingType) {
      case 'STEPS':
        return `${targetValue.toLocaleString()} passos`;
      case 'DISTANCE':
        return formatDistance(targetValue);
      case 'DURATION':
        return formatDuration(targetValue);
      default:
        return `${targetValue}`;
    }
  };

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (trackingType) {
      case 'STEPS':
        return 'footsteps';
      case 'DISTANCE':
        return 'navigate';
      case 'DURATION':
        return 'timer';
      default:
        return 'fitness';
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
            <Text style={styles.title}>Rastreamento</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Progress Circle */}
          <View style={styles.progressSection}>
            <View style={styles.progressCircle}>
              <Ionicons name={getIcon()} size={48} color="#007AFF" />
              <Text style={styles.progressValue}>{getDisplayValue()}</Text>
              <Text style={styles.progressTarget}>de {getTargetDisplay()}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${getProgressPercentage()}%` }]} />
            </View>
            <Text style={styles.progressPercentage}>{Math.round(getProgressPercentage())}%</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="timer-outline" size={24} color="#666" />
              <Text style={styles.statLabel}>Duração</Text>
              <Text style={styles.statValue}>{formatDuration(duration)}</Text>
            </View>

            {trackingType === 'DISTANCE' && (
              <View style={styles.statBox}>
                <Ionicons name="footsteps-outline" size={24} color="#666" />
                <Text style={styles.statLabel}>Passos</Text>
                <Text style={styles.statValue}>{steps.toLocaleString()}</Text>
              </View>
            )}
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            {!isTracking && !startTime && (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={handleStart}
              >
                <Ionicons name="play" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Iniciar</Text>
              </TouchableOpacity>
            )}

            {isTracking && (
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={handlePause}
              >
                <Ionicons name="pause" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Pausar</Text>
              </TouchableOpacity>
            )}

            {!isTracking && startTime && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.resumeButton]}
                  onPress={handleResume}
                >
                  <Ionicons name="play" size={24} color="#FFF" />
                  <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.finishButton]}
                  onPress={handleFinish}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={24} color="#FFF" />
                      <Text style={styles.buttonText}>Finalizar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    minHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F4F4F',
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginTop: 8,
  },
  progressTarget: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F4F4F',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    flex: 1,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resumeButton: {
    backgroundColor: '#007AFF',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
