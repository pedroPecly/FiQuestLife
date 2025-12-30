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
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TrackingType } from '@/services/challenge';

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
  // HELPERS
  // ==========================================
  const getProgressPercentage = (): number => {
    return Math.min((currentValue / targetValue) * 100, 100);
  };

  const formatValue = (value: number): string => {
    switch (trackingType) {
      case 'STEPS':
        return `${value.toLocaleString()}`;
      case 'DISTANCE':
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)} km`;
        }
        return `${Math.round(value)} m`;
      case 'DURATION':
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
      default:
        return `${value}`;
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
      case 'ALTITUDE':
        return 'trending-up';
      default:
        return 'fitness';
    }
  };

  const getColor = (): string => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return '#4CAF50';
    if (percentage >= 50) return '#FF9800';
    return '#007AFF';
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={getIcon()} size={20} color={getColor()} />
        <Text style={styles.label}>Progresso</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${getProgressPercentage()}%`,
                backgroundColor: getColor(),
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: getColor() }]}>
          {Math.round(getProgressPercentage())}%
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.currentValue}>{formatValue(currentValue)}</Text>
        <Text style={styles.separator}>/</Text>
        <Text style={styles.targetValue}>{formatValue(targetValue)}</Text>
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
    padding: 12,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
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
    marginBottom: 8,
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
