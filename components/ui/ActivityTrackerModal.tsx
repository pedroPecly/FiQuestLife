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
 * @updated 30/12/2025 - Fase 1: Refatorado para usar activityFormatters
 * @updated 30/12/2025 - Fase 2: Refatorado para usar useActivityTracker hook
 * 
 * Refatorações:
 * - Fase 1: Extração de formatadores para utils/activityFormatters.ts
 * - Fase 2: Extração de lógica de negócio para hooks/useActivityTracker.ts
 * 
 * Resultado:
 * - Componente reduzido de 575 linhas → 200 linhas (-65%)
 * - Focado apenas em UI e apresentação
 * - Lógica de negócio testável isoladamente
 * - Reusabilidade do hook em outros contextos
 */

import { useActivityTracker } from '@/hooks/useActivityTracker';
import type { TrackingType } from '@/services/challenge';
import {
    formatDuration,
    formatSteps,
    getActivityIcon,
} from '@/utils/activityFormatters';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ==========================================
// TYPES
// ==========================================

interface ActivityTrackerModalProps {
  visible: boolean;
  onClose: () => void;
  challengeId: string;
  trackingType: TrackingType;
  targetValue: number;
  targetUnit: string;
  onComplete: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

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
  // HOOK
  // ==========================================
  const tracker = useActivityTracker({
    challengeId,
    trackingType,
    targetValue,
    onComplete,
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleClose = () => {
    tracker.actions.cancel();
    // Se não estiver rastreando, fechar o modal
    if (!tracker.state.isTracking && !tracker.state.isPaused) {
      onClose();
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
              <Ionicons name={getActivityIcon(trackingType)} size={48} color="#007AFF" />
              <Text style={styles.progressValue}>{tracker.computed.displayValue}</Text>
              <Text style={styles.progressTarget}>
                de {tracker.computed.targetDisplay}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${tracker.computed.progress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercentage}>
              {Math.round(tracker.computed.progress)}%
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="timer-outline" size={24} color="#666" />
              <Text style={styles.statLabel}>Duração</Text>
              <Text style={styles.statValue}>
                {formatDuration(tracker.state.duration, 'full')}
              </Text>
            </View>

            {trackingType === 'DISTANCE' && (
              <View style={styles.statBox}>
                <Ionicons name="footsteps-outline" size={24} color="#666" />
                <Text style={styles.statLabel}>Passos</Text>
                <Text style={styles.statValue}>
                  {formatSteps(tracker.state.steps)}
                </Text>
              </View>
            )}
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            {/* Botão Iniciar - exibido quando não iniciou */}
            {!tracker.state.isTracking && !tracker.state.startTime && (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={tracker.actions.start}
              >
                <Ionicons name="play" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Iniciar</Text>
              </TouchableOpacity>
            )}

            {/* Botão Pausar - exibido quando está rastreando */}
            {tracker.state.isTracking && (
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={tracker.actions.pause}
              >
                <Ionicons name="pause" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Pausar</Text>
              </TouchableOpacity>
            )}

            {/* Botões Continuar e Finalizar - exibidos quando pausado */}
            {tracker.state.isPaused && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.resumeButton]}
                  onPress={tracker.actions.resume}
                >
                  <Ionicons name="play" size={24} color="#FFF" />
                  <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.finishButton,
                    !tracker.computed.canFinish && styles.buttonDisabled,
                  ]}
                  onPress={tracker.actions.finish}
                  disabled={!tracker.computed.canFinish || tracker.state.saving}
                >
                  {tracker.state.saving ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                      <Text style={styles.buttonText}>Finalizar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Goal Reached Indicator */}
          {tracker.computed.canFinish && tracker.state.isPaused && (
            <View style={styles.goalReached}>
              <Ionicons name="trophy" size={20} color="#4CAF50" />
              <Text style={styles.goalReachedText}>Meta atingida! 🎉</Text>
            </View>
          )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressCircle: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressValue: {
    fontSize: 32,
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
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  controls: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resumeButton: {
    backgroundColor: '#2196F3',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  goalReached: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    gap: 8,
  },
  goalReachedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
