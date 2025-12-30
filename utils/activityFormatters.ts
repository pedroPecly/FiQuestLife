/**
 * ============================================
 * ACTIVITY FORMATTERS
 * ============================================
 * 
 * Funções utilitárias para formatação de valores
 * relacionados a atividades físicas (passos, distância, duração).
 * 
 * Centraliza toda a lógica de formatação para evitar duplicação
 * entre componentes (ActivityTrackerModal, StepCounterWidget, etc).
 * 
 * @created 30/12/2025
 */

import type { TrackingType } from '@/services/challenge';
import type { Ionicons } from '@expo/vector-icons';

// ==========================================
// FORMATAÇÃO DE VALORES
// ==========================================

/**
 * Formata número de passos com separador de milhares
 * @param steps - Número de passos
 * @returns String formatada (ex: "1.234")
 */
export function formatSteps(steps: number): string {
  return steps.toLocaleString('pt-BR');
}

/**
 * Formata distância em metros para exibição amigável
 * @param meters - Distância em metros
 * @param decimals - Número de casas decimais para km (padrão: 2)
 * @returns String formatada (ex: "1,23 km" ou "450 m")
 */
export function formatDistance(meters: number, decimals: number = 2): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(decimals)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Formata duração em segundos para formato de tempo
 * @param seconds - Duração em segundos
 * @param format - Formato desejado ('full' | 'short' | 'compact')
 *                 - 'full': "1:23:45" (horas:minutos:segundos)
 *                 - 'short': "23:45" (minutos:segundos) ou "1h 23m" se > 1h
 *                 - 'compact': "23m" ou "1h 23m"
 * @returns String formatada
 */
export function formatDuration(
  seconds: number,
  format: 'full' | 'short' | 'compact' = 'full'
): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (format === 'full') {
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (format === 'short') {
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  if (format === 'compact') {
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  }

  return `${seconds}s`;
}

/**
 * Formata valor de altitude em metros
 * @param meters - Altitude em metros
 * @returns String formatada (ex: "123 m")
 */
export function formatAltitude(meters: number): string {
  return `${Math.round(meters)} m`;
}

// ==========================================
// FORMATAÇÃO CONTEXTUAL (BASEADA EM TIPO)
// ==========================================

/**
 * Formata valor baseado no tipo de rastreamento
 * @param value - Valor numérico bruto
 * @param trackingType - Tipo de atividade
 * @param options - Opções de formatação
 * @returns String formatada de acordo com o tipo
 */
export function formatActivityValue(
  value: number,
  trackingType: TrackingType,
  options: {
    includeUnit?: boolean;
    durationFormat?: 'full' | 'short' | 'compact';
    distanceDecimals?: number;
  } = {}
): string {
  const {
    includeUnit = false,
    durationFormat = 'compact',
    distanceDecimals = 1,
  } = options;

  switch (trackingType) {
    case 'STEPS':
      return includeUnit
        ? `${formatSteps(value)} passos`
        : formatSteps(value);

    case 'DISTANCE':
      return formatDistance(value, distanceDecimals);

    case 'DURATION':
      return formatDuration(value, durationFormat);

    case 'ALTITUDE':
      return formatAltitude(value);

    case 'MANUAL':
    default:
      return `${value}`;
  }
}

/**
 * Formata valor completo com unidade para exibição
 * @param value - Valor numérico
 * @param trackingType - Tipo de atividade
 * @returns String com valor e unidade (ex: "1.234 passos", "5,2 km", "23m")
 */
export function formatActivityValueWithUnit(
  value: number,
  trackingType: TrackingType
): string {
  return formatActivityValue(value, trackingType, { includeUnit: true });
}

// ==========================================
// ÍCONES
// ==========================================

/**
 * Retorna o nome do ícone do Ionicons baseado no tipo de rastreamento
 * @param trackingType - Tipo de atividade
 * @returns Nome do ícone do Ionicons
 */
export function getActivityIcon(trackingType: TrackingType): keyof typeof Ionicons.glyphMap {
  switch (trackingType) {
    case 'STEPS':
      return 'footsteps';
    case 'DISTANCE':
      return 'navigate';
    case 'DURATION':
      return 'timer';
    case 'ALTITUDE':
      return 'trending-up';
    case 'MANUAL':
    default:
      return 'fitness';
  }
}

// ==========================================
// CORES
// ==========================================

/**
 * Retorna cor baseada na porcentagem de progresso
 * @param percentage - Porcentagem de progresso (0-100)
 * @returns Código de cor hexadecimal
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return '#4CAF50'; // Verde (completo)
  if (percentage >= 75) return '#8BC34A';  // Verde claro
  if (percentage >= 50) return '#FF9800';  // Laranja
  if (percentage >= 25) return '#FFC107';  // Amarelo
  return '#007AFF';                        // Azul (início)
}

// ==========================================
// CÁLCULOS
// ==========================================

/**
 * Calcula porcentagem de progresso com limite máximo de 100%
 * @param current - Valor atual
 * @param target - Valor alvo
 * @returns Porcentagem (0-100)
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
}

/**
 * Verifica se a meta foi atingida
 * @param current - Valor atual
 * @param target - Valor alvo
 * @returns true se atingiu ou ultrapassou a meta
 */
export function isGoalReached(current: number, target: number): boolean {
  return current >= target;
}

// ==========================================
// CONVERSÕES
// ==========================================

/**
 * Converte metros para quilômetros
 * @param meters - Distância em metros
 * @returns Distância em quilômetros
 */
export function metersToKilometers(meters: number): number {
  return meters / 1000;
}

/**
 * Converte quilômetros para metros
 * @param kilometers - Distância em quilômetros
 * @returns Distância em metros
 */
export function kilometersToMeters(kilometers: number): number {
  return kilometers * 1000;
}

/**
 * Converte segundos para minutos
 * @param seconds - Tempo em segundos
 * @returns Tempo em minutos (arredondado)
 */
export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

/**
 * Converte minutos para segundos
 * @param minutes - Tempo em minutos
 * @returns Tempo em segundos
 */
export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}
