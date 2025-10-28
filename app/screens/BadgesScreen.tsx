/**
 * ============================================
 * BADGES SCREEN - GALERIA DE CONQUISTAS
 * ============================================
 * 
 * Tela para visualizar todos os badges:
 * - Grid 2 colunas
 * - Filtros: Todos / Conquistados / Bloqueados
 * - Modal de detalhes ao tocar
 * - Pull-to-refresh
 * - Contador de progresso
 * 
 * @created 27 de outubro de 2025
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BadgeCard, BadgeDetailModal } from '../../components/ui';
import { useAlert } from '../../hooks/useAlert';
import type { BadgeWithProgress } from '../../services/badge';
import { getBadgesProgress } from '../../services/badge';
import { styles } from '../styles/badges.styles';

// ==========================================
// TIPOS
// ==========================================

type FilterType = 'all' | 'earned' | 'locked';

// ==========================================
// COMPONENTE
// ==========================================

export const BadgesScreen = () => {
  // ==========================================
  // STATE
  // ==========================================
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<BadgeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeWithProgress | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Contadores
  const [earnedCount, setEarnedCount] = useState(0);
  const [lockedCount, setLockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const { alert } = useAlert();

  // ==========================================
  // LOAD DATA
  // ==========================================
  const loadBadges = async () => {
    try {
      setLoading(true);
      const response = await getBadgesProgress();

      setBadges(response.badges);
      setEarnedCount(response.earned);
      setLockedCount(response.locked);
      setTotalCount(response.total);

      // Aplica filtro atual
      applyFilter('all', response.badges);
    } catch (error: any) {
      console.error('❌ Erro ao carregar conquistas:', error);
      alert.error('Erro', error.message || 'Não foi possível carregar as conquistas.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REFRESH
  // ==========================================
  const onRefresh = async () => {
    setRefreshing(true);
    await loadBadges();
    setRefreshing(false);
  };

  // ==========================================
  // FILTROS
  // ==========================================
  const applyFilter = (filterType: FilterType, badgesList = badges) => {
    setFilter(filterType);

    if (filterType === 'all') {
      setFilteredBadges(badgesList);
    } else if (filterType === 'earned') {
      setFilteredBadges(badgesList.filter((b) => b.earned));
    } else if (filterType === 'locked') {
      setFilteredBadges(badgesList.filter((b) => !b.earned));
    }
  };

  // ==========================================
  // MODAL
  // ==========================================
  const openBadgeDetails = (badge: BadgeWithProgress) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  const closeBadgeDetails = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedBadge(null), 300);
  };

  // ==========================================
  // LIFECYCLE
  // ==========================================
  useFocusEffect(
    useCallback(() => {
      loadBadges();
    }, [])
  );

  // ==========================================
  // RENDER LOADING
  // ==========================================
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Carregando conquistas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // RENDER MAIN
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Conquistas</Text>
        <Text style={styles.headerSubtitle}>
          {earnedCount}/{totalCount} conquistas desbloqueadas
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => applyFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todos ({totalCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'earned' && styles.filterButtonActive]}
          onPress={() => applyFilter('earned')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'earned' && styles.filterTextActive]}>
            Conquistados ({earnedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'locked' && styles.filterButtonActive]}
          onPress={() => applyFilter('locked')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'locked' && styles.filterTextActive]}>
            Bloqueados ({lockedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Badges Grid */}
      <FlatList
        data={filteredBadges}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.badgeCardWrapper}>
            <BadgeCard badge={item} onPress={() => openBadgeDetails(item)} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Nenhuma conquista encontrada</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'earned'
                ? 'Complete desafios para conquistar conquistas!'
                : filter === 'locked'
                ? 'Todas as conquistas foram conquistadas! 🎉'
                : 'Puxe para baixo para atualizar'}
            </Text>
          </View>
        }
      />

      {/* Modal de Detalhes */}
      <BadgeDetailModal
        badge={selectedBadge}
        visible={modalVisible}
        onClose={closeBadgeDetails}
      />
    </SafeAreaView>
  );
};
