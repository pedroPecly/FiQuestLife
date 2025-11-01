import { Header } from '@/components/layout';
import { ActivityFeedItem, LoadingScreen } from '@/components/ui';
import type { FriendActivity } from '@/services/friend';
import { friendService } from '@/services/friend';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { showAlert } from '../../utils/dialog';

type FilterType = 'all' | 'challenges' | 'badges' | 'rewards';

export default function ActivityFeedScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 20;

  useFocusEffect(
    useCallback(() => {
      loadActivities(true);
    }, [activeFilter])
  );

  const loadActivities = async (reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
      }

      const currentOffset = reset ? 0 : offset;
      const data = await friendService.getFriendActivity(LIMIT, currentOffset);

      // Filtrar por tipo se necessário
      const filtered = filterActivities(data);

      if (reset) {
        setActivities(filtered);
      } else {
        setActivities((prev) => [...prev, ...filtered]);
      }

      setHasMore(data.length === LIMIT);
      setOffset(currentOffset + data.length);
    } catch (error: any) {
      console.error('Erro ao carregar atividades:', error);
      showAlert('Erro', error.message || 'Erro ao carregar atividades');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const filterActivities = (data: FriendActivity[]): FriendActivity[] => {
    switch (activeFilter) {
      case 'challenges':
        return data.filter((a) => a.type === 'CHALLENGE_COMPLETED');
      case 'badges':
        return data.filter((a) => a.type === 'BADGE_EARNED');
      case 'rewards':
        return data.filter((a) => a.type === 'REWARD');
      default:
        return data;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities(true);
  };

  const onEndReached = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadActivities(false);
    }
  };

  const renderFilter = (
    filter: FilterType,
    label: string,
    icon: 'view-dashboard' | 'trophy' | 'medal' | 'gift'
  ) => (
    <TouchableOpacity
      style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
      onPress={() => setActiveFilter(filter)}
    >
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={activeFilter === filter ? '#FFFFFF' : '#8E8E93'}
      />
      <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filters}>
      {renderFilter('all', 'Todos', 'view-dashboard')}
      {renderFilter('challenges', 'Desafios', 'trophy')}
      {renderFilter('badges', 'Badges', 'medal')}
      {renderFilter('rewards', 'Recompensas', 'gift')}
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>Carregando mais...</Text>
      </View>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Feed de Atividades" />

      {renderFilters()}

      <FlatList
        data={activities}
        keyExtractor={(item, index) => `${item.userId}-${item.createdAt}-${index}`}
        renderItem={({ item }) => <ActivityFeedItem activity={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="information-outline" size={80} color="#C7C7CC" />
            <Text style={styles.emptyTitle}>Nenhuma atividade</Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'all'
                ? 'Seus amigos ainda não têm atividades recentes. Adicione mais amigos para ver suas conquistas!'
                : 'Nenhuma atividade deste tipo no momento'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
});
