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

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BadgeCard } from '../../components/ui';
import { useAlert } from '../../hooks/useAlert';
import type { BadgeWithProgress } from '../../services/badge';
import {
    CATEGORY_ICONS,
    CATEGORY_LABELS,
    formatBadgeProgress,
    getBadgesProgress,
    getRarityEmoji,
    RARITY_COLORS,
    RARITY_LABELS,
    REQUIREMENT_TYPE_LABELS,
} from '../../services/badge';
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
      {selectedBadge && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeBadgeDetails}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={closeBadgeDetails}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={closeBadgeDetails}>
                  <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Badge Icon */}
                  <View
                    style={[
                      styles.modalIcon,
                      selectedBadge.earned && {
                        backgroundColor: RARITY_COLORS[selectedBadge.rarity],
                      },
                    ]}
                  >
                    {selectedBadge.earned ? (
                      <Text style={styles.modalIconEmoji}>
                        {CATEGORY_ICONS[selectedBadge.category]}
                      </Text>
                    ) : (
                      <MaterialCommunityIcons name="lock" size={60} color="#9CA3AF" />
                    )}
                  </View>

                  {/* Badge Name */}
                  <Text style={styles.modalTitle}>{selectedBadge.name}</Text>

                  {/* Rarity Badge */}
                  <View
                    style={[
                      styles.modalRarityBadge,
                      {
                        backgroundColor: selectedBadge.earned
                          ? RARITY_COLORS[selectedBadge.rarity]
                          : '#E5E7EB',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalRarityText,
                        !selectedBadge.earned && { color: '#6B7280' },
                      ]}
                    >
                      {getRarityEmoji(selectedBadge.rarity)}{' '}
                      {RARITY_LABELS[selectedBadge.rarity]}
                    </Text>
                  </View>

                  {/* Description */}
                  <Text style={styles.modalDescription}>{selectedBadge.description}</Text>

                  {/* Info Section */}
                  <View style={styles.modalInfoSection}>
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Categoria:</Text>
                      <Text style={styles.modalInfoValue}>
                        {CATEGORY_ICONS[selectedBadge.category]}{' '}
                        {CATEGORY_LABELS[selectedBadge.category]}
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Requisito:</Text>
                      <Text style={styles.modalInfoValue}>
                        {REQUIREMENT_TYPE_LABELS[selectedBadge.requirementType]}
                      </Text>
                    </View>
                  </View>

                  {/* Earned or Progress */}
                  {selectedBadge.earned && selectedBadge.earnedAt ? (
                    <View style={styles.modalEarnedContainer}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color="#10B981"
                      />
                      <Text style={styles.modalEarnedText}>
                        Conquistado em{' '}
                        {new Date(selectedBadge.earnedAt).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  ) : (
                    selectedBadge.progress && (
                      <View style={styles.modalProgressSection}>
                        <Text style={styles.modalProgressTitle}>Progresso</Text>
                        <Text style={styles.modalProgressText}>
                          {formatBadgeProgress(selectedBadge)}
                        </Text>

                        {/* Progress Bar */}
                        <View style={styles.modalProgressBarBackground}>
                          <View
                            style={[
                              styles.modalProgressBarFill,
                              {
                                width: `${selectedBadge.progress.percentage}%`,
                                backgroundColor: RARITY_COLORS[selectedBadge.rarity],
                              },
                            ]}
                          />
                        </View>

                        <Text style={styles.modalProgressHint}>
                          Complete mais {selectedBadge.progress.required - selectedBadge.progress.current}{' '}
                          para desbloquear!
                        </Text>
                      </View>
                    )
                  )}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};
