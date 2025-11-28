/**
 * ============================================
 * REWARD HISTORY SCREEN - Tela de Histórico de Recompensas
 * ============================================
 *
 * Exibe todo o histórico de recompensas ganhas pelo usuário:
 * - Estatísticas resumidas no topo
 * - Filtros por tipo (Todos, XP, Coins, Badges)
 * - Lista com paginação
 * - Pull-to-refresh
 * - Estados: loading, vazio, erro
 *
 * @created 01 de novembro de 2025
 */

import { styles } from '@/app/styles/reward-history.styles';
import { SimpleHeader } from '@/components/layout';
import { LoadingScreen } from '@/components/ui';
import { RewardCard } from '@/components/ui/RewardCard';
import type { RewardItem, RewardStats, RewardType } from '@/services/reward';
import { getRewardHistory, getRewardStats } from '@/services/reward';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterType = 'ALL' | RewardType;

export default function RewardHistoryScreen() {
  // ==========================================
  // ESTADOS
  // ==========================================
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<RewardStats | null>(null);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  // Animação para slide horizontal da lista
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ==========================================
  // CARREGAMENTO DE DADOS
  // ==========================================

  const loadStats = async () => {
    try {
      const statsData = await getRewardStats();
      setStats(statsData);
      setError(null); // Limpa erro se carregar com sucesso
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setError('Não foi possível carregar as estatísticas.');
    }
  };

  const loadRewards = async (refresh = false) => {
    try {
      const currentOffset = refresh ? 0 : offset;

      const filters: any = {
        limit: 20,
        offset: currentOffset,
      };

      if (selectedFilter !== 'ALL') {
        filters.type = selectedFilter;
      }

      const response = await getRewardHistory(filters);

      if (refresh) {
        setRewards(response.data);
        setOffset(20);
      } else {
        setRewards((prev) => [...prev, ...response.data]);
        setOffset((prev) => prev + 20);
      }

      setHasMore(response.pagination.hasMore);
      setError(null); // Limpa erro se carregar com sucesso
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setError('Não foi possível carregar o histórico de recompensas.');
    }
  };

  const loadAll = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    await Promise.all([loadStats(), loadRewards(refresh)]);

    setLoading(false);
    setRefreshing(false);
  };

  // Carrega dados ao entrar na tela (mas não quando o filtro muda)
  useFocusEffect(
    useCallback(() => {
      // Reseta a animação ao recarregar
      slideAnim.setValue(0);
      loadAll();
    }, []) // Removido selectedFilter da dependência
  );

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleRefresh = () => {
    setOffset(0);
    loadAll(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadRewards(false).finally(() => setLoadingMore(false));
    }
  };

  const handleFilterChange = async (filter: FilterType) => {
    if (filter === selectedFilter) return;

    // Determina a direção do slide baseado na ordem dos filtros
    const filters: FilterType[] = ['ALL', 'XP', 'COINS', 'BADGE'];
    const currentIndex = filters.indexOf(selectedFilter);
    const newIndex = filters.indexOf(filter);
    const direction = newIndex > currentIndex ? 1 : -1; // 1 = direita, -1 = esquerda

    // Animação de slide para fora
    Animated.timing(slideAnim, {
      toValue: direction * -300, // Slide para esquerda ou direita
      duration: 200,
      useNativeDriver: true,
    }).start(async () => {
      // Muda o filtro ANTES de carregar os dados
      setSelectedFilter(filter);
      setOffset(0);
      
      // Aguarda um ciclo para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Carrega os novos dados com o filtro atualizado
      const currentFilters: any = {
        limit: 20,
        offset: 0,
      };

      if (filter !== 'ALL') {
        currentFilters.type = filter;
      }

      const response = await getRewardHistory(currentFilters);
      
      setRewards(response.data);
      setHasMore(response.pagination.hasMore);
      
      // Posiciona do lado oposto
      slideAnim.setValue(direction * 300);
      
      // Animação de slide para dentro (com dados já carregados)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // ==========================================
  // FUNÇÕES AUXILIARES
  // ==========================================

  /**
   * Retorna conteúdo personalizado para estado vazio baseado no filtro
   */
  const getEmptyStateContent = () => {
    switch (selectedFilter) {
      case 'XP':
        return {
          icon: '⭐',
          title: 'Nenhum XP ganho ainda',
          text: 'Complete desafios e conquiste objetivos para ganhar experiência!',
        };
      case 'COINS':
        return {
          icon: '💰',
          title: 'Nenhuma FiCoin ganha ainda',
          text: 'Ganhe FiCoins completando desafios e alcançando marcos importantes!',
        };
      case 'BADGE':
        return {
          icon: '🏆',
          title: 'Nenhuma conquista desbloqueada',
          text: 'Desbloqueie conquistas completando desafios especiais e metas!',
        };
      default:
        return {
          icon: '📭',
          title: 'Nenhuma recompensa ainda',
          text: 'Complete desafios para ganhar XP, moedas e conquistas!',
        };
    }
  };

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================

  if (loading) {
    return <LoadingScreen />;
  }

  const emptyState = getEmptyStateContent();

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SIMPLES */}
      <SimpleHeader title="Histórico" />


      {/* ESTADO DE ERRO */}
      {error && !refreshing && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              loadAll();
            }}
            accessible={true}
            accessibilityLabel="Tentar novamente"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>🔄 Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Estatísticas Resumidas */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{stats.totalXP.toLocaleString('pt-BR')}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>{stats.totalCoins.toLocaleString('pt-BR')}</Text>
              <Text style={styles.statLabel}>FiCoins</Text>
            </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>{stats.totalBadges}</Text>
            <Text style={styles.statLabel}>Conquistas</Text>
          </View>
        </View>
      )}

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'ALL' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('ALL')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedFilter === 'ALL' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'XP' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('XP')}
          activeOpacity={0.7}
        >
          <Text style={styles.filterIcon}>⭐</Text>
          <Text style={[styles.filterText, selectedFilter === 'XP' && styles.filterTextActive]}>
            XP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'COINS' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('COINS')}
          activeOpacity={0.7}
        >
          <Text style={styles.filterIcon}>💰</Text>
          <Text style={[styles.filterText, selectedFilter === 'COINS' && styles.filterTextActive]}>
            FiCoins
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'BADGE' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('BADGE')}
          activeOpacity={0.7}
        >
          <Text style={styles.filterIcon}>🏆</Text>
          <Text style={[styles.filterText, selectedFilter === 'BADGE' && styles.filterTextActive]}>
            Conquistas
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Lista de Recompensas com Animação */}
      <Animated.View 
        style={{ 
          flex: 1, 
          transform: [{ translateX: slideAnim }] 
        }}
      >
        <FlatList
          data={rewards}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <RewardCard reward={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#20B2AA"
              colors={['#20B2AA']}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          windowSize={10}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <View 
              style={styles.emptyContainer}
              accessible={true}
              accessibilityLabel={emptyState.title}
            >
              <Text style={styles.emptyIcon}>{emptyState.icon}</Text>
              <Text style={styles.emptyTitle}>{emptyState.title}</Text>
              <Text style={styles.emptyText}>{emptyState.text}</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color="#20B2AA" />
              </View>
            ) : null
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
}
