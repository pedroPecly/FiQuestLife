/**
 * ============================================
 * EXPLORE SCREEN - FEED + LEADERBOARD
 * ============================================
 * 
 * Tela com tabs:
 * - Feed: Atividades dos amigos
 * - Ranking: Leaderboard de amigos e global
 * 
 * @updated 4 de novembro de 2025
 */

import { Header } from '@/components/layout/Header';
import { FeedActivityCard, LeaderboardCard, LoadingScreen, TabBar } from '@/components/ui';
import type { Tab } from '@/components/ui/TabBar';
import { FeedActivity, feedService } from '@/services/feed';
import { feedInteractionsService } from '@/services/feedInteractions';
import { LeaderboardEntry, LeaderboardType, leaderboardService } from '@/services/leaderboard';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'feed' | 'myPosts' | 'ranking'>('feed');
  
  // Feed state
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedRefreshing, setFeedRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // My Posts state
  const [myPosts, setMyPosts] = useState<FeedActivity[]>([]);
  const [myPostsLoading, setMyPostsLoading] = useState(false);
  const [myPostsRefreshing, setMyPostsRefreshing] = useState(false);
  const [myPostsOffset, setMyPostsOffset] = useState(0);
  const [myPostsHasMore, setMyPostsHasMore] = useState(true);
  const [myPostsInitialLoad, setMyPostsInitialLoad] = useState(true);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardRefreshing, setLeaderboardRefreshing] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('xp');
  const [leaderboardScope, setLeaderboardScope] = useState<'friends' | 'global'>('friends');

  // Recarrega quando a tela é focada
  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'feed') {
        loadFeed(true);
      } else if (activeTab === 'myPosts') {
        loadMyPosts(true);
      } else {
        loadLeaderboard(true);
      }
    }, [activeTab])
  );

  // Load initial feed
  const loadFeed = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setFeedRefreshing(true);
      } else if (!initialLoad) {
        setFeedLoading(true);
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
      if (error.response?.status === 500) {
        setHasMore(false);
      }
    } finally {
      setFeedLoading(false);
      setFeedRefreshing(false);
      setInitialLoad(false);
    }
  };

  // Load my posts
  const loadMyPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setMyPostsRefreshing(true);
      } else if (!myPostsInitialLoad) {
        setMyPostsLoading(true);
      }

      const newOffset = isRefresh ? 0 : myPostsOffset;
      const data = await feedService.getMyActivity(20, newOffset);
      
      if (isRefresh) {
        setMyPosts(data);
        setMyPostsOffset(20);
      } else {
        setMyPosts(prev => [...prev, ...data]);
        setMyPostsOffset(prev => prev + 20);
      }

      setMyPostsHasMore(data.length === 20);
    } catch (error: any) {
      console.error('Erro ao carregar meus posts:', error);
      if (error.response?.status === 500) {
        setMyPostsHasMore(false);
      }
    } finally {
      setMyPostsLoading(false);
      setMyPostsRefreshing(false);
      setMyPostsInitialLoad(false);
    }
  };

  const loadLeaderboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setLeaderboardRefreshing(true);
      } else {
        setLeaderboardLoading(true);
      }

      const result = leaderboardScope === 'friends'
        ? await leaderboardService.getFriendsLeaderboard(leaderboardType, 50)
        : await leaderboardService.getGlobalLeaderboard(leaderboardType, 100);

      if (result && result.leaderboard) {
        setLeaderboard(result.leaderboard);
      }
    } catch (error: any) {
      console.error('Erro ao carregar leaderboard:', error);
    } finally {
      setLeaderboardLoading(false);
      setLeaderboardRefreshing(false);
    }
  };

  // Load more on scroll (feed/myPosts only)
  const loadMore = () => {
    if (activeTab === 'feed' && !feedLoading && !feedRefreshing && hasMore && !initialLoad) {
      loadFeed();
    } else if (activeTab === 'myPosts' && !myPostsLoading && !myPostsRefreshing && myPostsHasMore && !myPostsInitialLoad) {
      loadMyPosts();
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(() => {
    if (activeTab === 'feed') {
      loadFeed(true);
    } else if (activeTab === 'myPosts') {
      loadMyPosts(true);
    } else {
      loadLeaderboard(true);
    }
  }, [activeTab, leaderboardType, leaderboardScope]);

  // Change leaderboard filter
  const changeLeaderboardFilter = (type: LeaderboardType, scope: 'friends' | 'global') => {
    setLeaderboardType(type);
    setLeaderboardScope(scope);
    loadLeaderboard(true);
  };

  // Atualizar stats após interação (like/comment)
  const refreshStats = async () => {
    try {
      const currentActivities = activeTab === 'feed' ? activities : myPosts;
      const activityIds = currentActivities.map(a => a.id).filter(Boolean) as string[];
      
      if (activityIds.length === 0) return;

      console.log('[EXPLORE] Atualizando stats para', activityIds.length, 'atividades');
      const result = await feedInteractionsService.getActivityStats(activityIds);
      
      if (result.success && result.data) {
        console.log('[EXPLORE] Stats recebidos:', result.data);
        
        // Atualizar contadores no estado
        if (activeTab === 'feed') {
          setActivities(prev => prev.map(item => ({
            ...item,
            likesCount: result.data[item.id]?.likesCount ?? item.likesCount,
            commentsCount: result.data[item.id]?.commentsCount ?? item.commentsCount,
            isLikedByUser: result.data[item.id]?.isLikedByUser ?? item.isLikedByUser,
          })));
        } else if (activeTab === 'myPosts') {
          setMyPosts(prev => prev.map(item => ({
            ...item,
            likesCount: result.data[item.id]?.likesCount ?? item.likesCount,
            commentsCount: result.data[item.id]?.commentsCount ?? item.commentsCount,
            isLikedByUser: result.data[item.id]?.isLikedByUser ?? item.isLikedByUser,
          })));
        }
      }
    } catch (error) {
      console.error('[EXPLORE] Erro ao atualizar stats:', error);
    }
  };

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
    if (!feedLoading || initialLoad) return null;
    return (
      <View style={styles.footerLoading}>
        <Text style={styles.footerText}>Carregando...</Text>
      </View>
    );
  };

  if (initialLoad) {
    return <LoadingScreen />;
  }

  const tabs: Tab[] = [
    { id: 'feed', label: 'Amigos', icon: 'account-group' },
    { id: 'myPosts', label: 'Meus Posts', icon: 'account' },
    { id: 'ranking', label: 'Ranking', icon: 'trophy' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <Header
        title="Explorar"
        subtitle={
          activeTab === 'feed' 
            ? 'Veja as conquistas dos seus amigos! 🚀' 
            : activeTab === 'myPosts'
            ? 'Suas conquistas e interações! 🎯'
            : 'Veja quem está no topo! 🏆'
        }
        showNotifications={false}
      />

      {/* Tabs com visual de card */}
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'feed' | 'myPosts' | 'ranking')}
        variant="card"
      />

      {/* Filtros do Leaderboard */}
      {activeTab === 'ranking' && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, leaderboardScope === 'friends' && styles.activeFilter]}
              onPress={() => changeLeaderboardFilter(leaderboardType, 'friends')}
            >
              <Text style={[styles.filterText, leaderboardScope === 'friends' && styles.activeFilterText]}>
                Amigos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, leaderboardScope === 'global' && styles.activeFilter]}
              onPress={() => changeLeaderboardFilter(leaderboardType, 'global')}
            >
              <Text style={[styles.filterText, leaderboardScope === 'global' && styles.activeFilterText]}>
                Global
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, leaderboardType === 'xp' && styles.activeFilter]}
              onPress={() => changeLeaderboardFilter('xp', leaderboardScope)}
            >
              <Text style={[styles.filterText, leaderboardType === 'xp' && styles.activeFilterText]}>
                XP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, leaderboardType === 'streak' && styles.activeFilter]}
              onPress={() => changeLeaderboardFilter('streak', leaderboardScope)}
            >
              <Text style={[styles.filterText, leaderboardType === 'streak' && styles.activeFilterText]}>
                Streak
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, leaderboardType === 'challenges' && styles.activeFilter]}
              onPress={() => changeLeaderboardFilter('challenges', leaderboardScope)}
            >
              <Text style={[styles.filterText, leaderboardType === 'challenges' && styles.activeFilterText]}>
                Desafios
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      {activeTab === 'feed' ? (
        <FlatList
          data={activities}
          keyExtractor={(item, index) => `${item.id || item.userId}-${item.type}-${index}`}
          renderItem={({ item }) => <FeedActivityCard activity={item} onInteraction={refreshStats} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={feedRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
        />
      ) : activeTab === 'myPosts' ? (
        <FlatList
          data={myPosts}
          keyExtractor={(item, index) => `${item.id || item.userId}-${item.type}-${index}`}
          renderItem={({ item }) => <FeedActivityCard activity={item} onInteraction={refreshStats} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={myPostsRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="emoji-events" size={64} color="#8E8E93" />
              <Text style={styles.emptyTitle}>Nenhuma conquista ainda</Text>
              <Text style={styles.emptySubtitle}>
                Complete desafios para aparecer aqui! 💪
              </Text>
            </View>
          }
          ListFooterComponent={
            myPostsLoading && !myPostsInitialLoad ? (
              <View style={styles.footerLoading}>
                <Text style={styles.footerText}>Carregando...</Text>
              </View>
            ) : null
          }
        />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            const stat = leaderboardType === 'xp' ? item.xp
              : leaderboardType === 'streak' ? item.currentStreak
              : item.challengesCompleted;
            
            return (
              <LeaderboardCard
                position={index + 1}
                user={item}
                stat={stat}
                statType={leaderboardType === 'challenges' ? 'xp' : leaderboardType}
                isCurrentUser={item.isCurrentUser}
              />
            );
          }}
          contentContainerStyle={styles.leaderboardContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={leaderboardRefreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="trophy-outline" size={64} color="#CCC" />
              <Text style={styles.emptyTitle}>Nenhum resultado</Text>
              <Text style={styles.emptySubtitle}>
                {leaderboardScope === 'friends'
                  ? 'Adicione amigos para ver o ranking!'
                  : 'Nenhum usuário encontrado'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  filtersContainer: {
    backgroundColor: '#FFF',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#20B2AA',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#FFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  leaderboardContent: {
    padding: 16,
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


