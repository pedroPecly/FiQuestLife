/**
 * ============================================
 * DAILY PROGRESS WIDGET
 * ============================================
 * 
 * Widget compacto que exibe o progresso de atividades do dia atual.
 * Mostra passos e distância percorrida, sincronizados automaticamente.
 * 
 * @created 30/12/2025
 */

import ActivitySyncService, { type DailyProgress } from '@/services/activitySync';
import { formatDistance, formatSteps } from '@/utils/activityFormatters';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DailyProgressWidgetProps {
  onPress?: () => void;
  autoRefresh?: boolean; // Auto-refresh a cada 30s
}

export function DailyProgressWidget({ onPress, autoRefresh = false }: DailyProgressWidgetProps) {
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Função memoizada para evitar re-criação
  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await ActivitySyncService.getCurrentProgress();
      setProgress(data);
    } catch (err) {
      console.error('[DAILY PROGRESS] Erro ao carregar progresso:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar ao montar
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Auto-refresh opcional a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadProgress();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh, loadProgress]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#20B2AA" />
        <Text style={styles.loadingText}>Carregando progresso...</Text>
      </View>
    );
  }

  if (error || !progress) {
    return null; // Não mostrar nada se der erro
  }

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="footsteps" size={20} color="#20B2AA" />
          <Text style={styles.title}>Hoje</Text>
        </View>
        <Text style={styles.date}>{formatDate(progress.date)}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <View style={styles.iconContainer}>
            <Ionicons name="walk" size={24} color="#20B2AA" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.value}>{formatSteps(progress.steps)}</Text>
            <Text style={styles.label}>passos</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <View style={styles.iconContainer}>
            <Ionicons name="navigate" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.value, { color: '#FF6B6B' }]}>
              {formatDistance(progress.distance)}
            </Text>
            <Text style={styles.label}>distância</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
        <Text style={styles.lastSync}>
          Sincronizado {getTimeSince(progress.lastSync)}
        </Text>
      </View>

      {onPress && (
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Toque para detalhes</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </View>
      )}
    </Container>
  );
}

/**
 * Formata data YYYY-MM-DD para formato amigável
 */
function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split('T')[0];
  if (dateStr === today) {
    return 'Hoje';
  }

  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

/**
 * Retorna tempo decorrido desde a última sincronização
 */
function getTimeSince(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 5) return 'agora';
  if (seconds < 60) return 'há alguns segundos';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;

  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: '#20B2AA',
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 6,
  },
  lastSync: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  tapHintText: {
    fontSize: 12,
    color: '#999',
  },
});
