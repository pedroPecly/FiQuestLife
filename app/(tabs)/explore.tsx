/**
 * ============================================
 * FEED SCREEN
 * ============================================
 * 
 * Feed social com atividades dos amigos
 * 
 * @created 2 de novembro de 2025
 */

import { Header } from '@/components/layout/Header';
import { FeedActivityCard, LoadingScreen } from '@/components/ui';
import { FeedActivity, feedService } from '@/services/feed';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Recarrega feed quando a tela é focada
  useFocusEffect(
    useCallback(() => {
      loadFeed(true);
    }, [])
  );

  // Load initial feed
  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (!initialLoad) {
        setLoading(true);
      }

      const newOffset = isRefresh ? 0 : offset;
      const data = await feedService.getFriendActivity(20, newOffset);
      
      if (isRefresh) {
        setActivities(data);
        setOffset(20);
      } else {
        setActivities(prev => [...prev, ...data]);
        setOffset(prev => prev + 20);
      }

      setHasMore(data.length === 20);
    } catch (error: any) {
      console.error('Erro ao carregar feed:', error);
      // Se for erro de servidor, para de tentar
      if (error.response?.status === 500) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setInitialLoad(false);
    }
  };

  // Load more on scroll
  const loadMore = () => {
    if (!loading && !refreshing && hasMore && !initialLoad) {
      loadFeed();
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(() => {
    loadFeed(true);
  }, []);

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="people-outline" size={64} color="#8E8E93" />
      <Text style={styles.emptyTitle}>Nenhuma atividade ainda</Text>
      <Text style={styles.emptySubtitle}>
        Adicione amigos para ver suas conquistas aqui! 🎉
      </Text>
    </View>
  );

  // Loading footer
  const renderFooter = () => {
    if (!loading || initialLoad) return null;
    return (
      <View style={styles.footerLoading}>
        <Text style={styles.footerText}>Carregando...</Text>
      </View>
    );
  };

  if (initialLoad) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Feed"
        subtitle="Veja o que seus amigos estão fazendo! 🚀"
        showNotifications={false}
      />

      <FlatList
        data={activities}
        keyExtractor={(item, index) => `${item.userId}-${item.type}-${index}`}
        renderItem={({ item }) => <FeedActivityCard activity={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Fundo padrão do sistema
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});


