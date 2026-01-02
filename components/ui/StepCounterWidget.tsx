/**
 * ============================================
 * STEP COUNTER WIDGET
 * ============================================
 * 
 * Widget compacto para exibir progresso de atividades
 * em tempo real no card de desafio.
 * 
 * Features:
 * - Progresso visual com barra
 * - Ícone baseado no tipo de rastreamento
 * - Valores formatados (passos, distância, tempo)
 * - Animação suave
 * 
 * @created 30/12/2025
 * @updated 30/12/2025 - Refatorado para usar activityFormatters
 */

import type { TrackingType } from '@/services/challenge';
import {
    calculateProgress,
    formatActivityValue,
    getActivityIcon,
    getProgressColor,
} from '@/utils/activityFormatters';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StepCounterWidgetProps {
  trackingType: TrackingType;
  currentValue: number;
  targetValue: number;
  targetUnit: string;
}

export function StepCounterWidget({
  trackingType,
  currentValue,
  targetValue,
  targetUnit,
}: StepCounterWidgetProps) {
  // ==========================================
  // COMPUTED VALUES
  // ==========================================
  const progress = calculateProgress(currentValue, targetValue);
  const color = getProgressColor(progress);
  const icon = getActivityIcon(trackingType);

  // Para DURATION, formatar com minutos:segundos em tempo real
  const formatValue = (value: number) => {
    if (trackingType === 'DURATION') {
      return formatActivityValue(value, trackingType, { durationFormat: 'short' });
    }
    return formatActivityValue(value, trackingType);
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.label}>Progresso</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color }]}>
          {Math.round(progress)}%
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.currentValue}>
          {formatValue(currentValue)}
        </Text>
        <Text style={styles.separator}>/</Text>
        <Text style={styles.targetValue}>
          {formatValue(targetValue)}
        </Text>
      </View>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F4F4F',
  },
  separator: {
    fontSize: 14,
    color: '#999',
  },
  targetValue: {
    fontSize: 14,
    color: '#666',
  },
});
