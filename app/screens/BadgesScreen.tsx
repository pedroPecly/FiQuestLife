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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    RefreshControl,
    SectionList,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleHeader } from '../../components/layout';
import { BadgeCard, BadgeDetailModal } from '../../components/ui';
import { useAlert } from '../../hooks/useAlert';
import type { BadgesProgressResponse, BadgeWithProgress } from '../../services/badge';
import { CATEGORY_ICONS, CATEGORY_LABELS, getBadgesProgress, RARITY_COLORS } from '../../services/badge';
import { styles } from '../styles/badges.styles';

// ==========================================
// CACHE
// ==========================================

const CACHE_KEY = '@badges_cache_v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

interface BadgesCache {
  data: BadgesProgressResponse;
  timestamp: number;
}

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
  // COMPUTED
  // ==========================================
  const progressPercent = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progressPercent]);

  const nearestBadge = useMemo(() => {
    const unearned = badges.filter(
      (b) => !b.earned && b.progress && b.progress.percentage > 0
    );
    if (unearned.length === 0) return null;
    return unearned.reduce((prev, curr) =>
      (curr.progress?.percentage ?? 0) > (prev.progress?.percentage ?? 0) ? curr : prev
    );
  }, [badges]);

  // Seções agrupadas por categoria (para SectionList)
  const sections = useMemo(() => {
    const CATEGORY_ORDER = ['ACHIEVEMENT', 'CONSISTENCY', 'MASTERY', 'SPECIAL'] as const;
    return CATEGORY_ORDER
      .map((cat) => {
        const items = filteredBadges.filter((b) => b.category === cat);
        if (items.length === 0) return null;
        const rows: BadgeWithProgress[][] = [];
        for (let i = 0; i < items.length; i += 2) {
          rows.push(items.slice(i, i + 2));
        }
        return { title: cat as string, data: rows };
      })
      .filter((s): s is { title: string; data: BadgeWithProgress[][] } => s !== null);
  }, [filteredBadges]);

  // ==========================================
  // LOAD DATA
  // ==========================================

  const applyResponse = (response: BadgesProgressResponse, currentFilter: FilterType) => {
    setBadges(response.badges);
    setEarnedCount(response.earned);
    setLockedCount(response.locked);
    setTotalCount(response.total);
    applyFilter(currentFilter, response.badges);
  };

  const saveCache = async (response: BadgesProgressResponse) => {
    try {
      const entry: BadgesCache = { data: response, timestamp: Date.now() };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {}
  };

  const loadBadges = async (forceRefresh = false) => {
    try {
      // Tenta usar cache se não for um refresh forçado
      if (!forceRefresh) {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached: BadgesCache = JSON.parse(raw);
          if (Date.now() - cached.timestamp < CACHE_TTL) {
            applyResponse(cached.data, filter);
            setLoading(false);
            // Refresh silencioso em background
            getBadgesProgress()
              .then((fresh) => { applyResponse(fresh, filter); saveCache(fresh); })
              .catch(() => {});
            return;
          }
        }
      }

      setLoading(true);
      const response = await getBadgesProgress();
      applyResponse(response, filter);
      await saveCache(response);
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
    await loadBadges(true); // ignora cache no pull-to-refresh
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
        <SimpleHeader title="Conquistas" />
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

      {/* Header com botão voltar */}
      <SimpleHeader title="Conquistas" />

      {/* Barra de progresso global */}
      <View style={styles.progressCard}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>
            {earnedCount}/{totalCount} troféus desbloqueados
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progressPercent)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Badge mais próxima de conquistar */}
      {nearestBadge && (
        <TouchableOpacity
          style={styles.nearestCard}
          onPress={() => openBadgeDetails(nearestBadge)}
          activeOpacity={0.8}
        >
          <Text style={styles.nearestHeader}>🎯 Mais próxima de conquistar</Text>
          <View style={styles.nearestRow}>
            <View
              style={[
                styles.nearestIconBox,
                { backgroundColor: RARITY_COLORS[nearestBadge.rarity] },
              ]}
            >
              <Text style={styles.nearestIconEmoji}>
                {CATEGORY_ICONS[nearestBadge.category]}
              </Text>
            </View>
            <View style={styles.nearestInfo}>
              <Text style={styles.nearestName} numberOfLines={1}>
                {nearestBadge.name}
              </Text>
              <View style={styles.nearestProgressRow}>
                <View style={styles.nearestBarTrack}>
                  <View
                    style={[
                      styles.nearestBarFill,
                      {
                        width: `${nearestBadge.progress?.percentage ?? 0}%`,
                        backgroundColor: RARITY_COLORS[nearestBadge.rarity],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.nearestProgressText}>
                  {nearestBadge.progress?.current}/{nearestBadge.progress?.required}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => applyFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'earned' && styles.filterButtonActive]}
          onPress={() => applyFilter('earned')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'earned' && styles.filterTextActive]}>
            Conquistados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'locked' && styles.filterButtonActive]}
          onPress={() => applyFilter('locked')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'locked' && styles.filterTextActive]}>
            Bloqueados
          </Text>
        </TouchableOpacity>
      </View>

      {/* Badges agrupados por categoria */}
      <SectionList
        sections={sections}
        keyExtractor={(row, index) => `row-${index}-${row.map((b) => b.id).join('-')}`}
        contentContainerStyle={styles.gridContent}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
          />
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderIcon}>
              {CATEGORY_ICONS[section.title as keyof typeof CATEGORY_ICONS]}
            </Text>
            <Text style={styles.sectionHeaderText}>
              {CATEGORY_LABELS[section.title as keyof typeof CATEGORY_LABELS]}
            </Text>
          </View>
        )}
        renderItem={({ item: row }) => (
          <View style={styles.badgeRow}>
            {row.map((badge) => (
              <View key={badge.id} style={styles.badgeCardWrapper}>
                <BadgeCard badge={badge} onPress={() => openBadgeDetails(badge)} />
              </View>
            ))}
            {row.length === 1 && <View style={styles.badgeCardWrapper} />}
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
