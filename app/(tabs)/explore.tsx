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
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    InteractionManager,
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
  const params = useLocalSearchParams();
  const feedListRef = useRef<FlatList>(null);
  const myPostsListRef = useRef<FlatList>(null);
  
  const [activeTab, setActiveTab] = useState<'feed' | 'myPosts' | 'ranking'>('feed');
  const [highlightedActivityId, setHighlightedActivityId] = useState<string | null>(null);
  const [openCommentsForActivityId, setOpenCommentsForActivityId] = useState<string | null>(null);
  
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

  /**
   * Lifecycle: Limpar estados de loading quando o componente é montado
   * Previne bug de loading congelado após navegação
   */
  useEffect(() => {
    setFeedLoading(false);
    setFeedRefreshing(false);
    setMyPostsLoading(false);
    setMyPostsRefreshing(false);
  }, []);

  /**
   * Lifecycle: Recarrega dados quando a tela ganha foco
   * Garante que dados estão atualizados após navegação
   */
  useFocusEffect(
    useCallback(() => {
      // Resetar estados de loading que podem ter ficado travados após navegação
      setFeedLoading(false);
      setFeedRefreshing(false);
      setMyPostsLoading(false);
      setMyPostsRefreshing(false);

      const task = InteractionManager.runAfterInteractions(() => {
        if (activeTab === 'feed') {
          loadFeed(true);
        } else if (activeTab === 'myPosts') {
          loadMyPosts(true);
        } else {
          loadLeaderboard(true);
        }
      });
      return () => task.cancel();
    }, [activeTab])
  );

  // Processa parâmetros de navegação (highlight de atividades)
  useEffect(() => {
    if (params.highlightActivityId && params.tab) {
      const targetTab = params.tab as 'feed' | 'myPosts';
      const activityId = params.highlightActivityId as string;
      const shouldOpenComments = params.openComments === 'true';

      // Define o ID para highlight ANTES de mudar de tab
      setHighlightedActivityId(activityId);

      // Define se deve abrir comentários
      if (shouldOpenComments) {
        setOpenCommentsForActivityId(activityId);
      }

      // Muda para a tab correta (isso vai disparar o useFocusEffect que carrega os dados)
      setActiveTab(targetTab);

      // Remove o highlight após 3 segundos
      const highlightTimer = setTimeout(() => {
        setHighlightedActivityId(null);
        setOpenCommentsForActivityId(null);
      }, 3000);

      return () => clearTimeout(highlightTimer);
    }
  }, [params.highlightActivityId, params.tab, params.openComments, params.timestamp]);

  // Faz scroll quando os dados estão carregados e existe um highlight
  useEffect(() => {
    if (!highlightedActivityId) return;

    const targetList = activeTab === 'feed' ? activities : myPosts;
    const isLoading = activeTab === 'feed' ? feedLoading : myPostsLoading;
    const listRef = activeTab === 'feed' ? feedListRef : myPostsListRef;

    // Aguarda os dados serem carregados
    if (isLoading || targetList.length === 0) {
      return;
    }

    // Encontra o índice da atividade
    const index = targetList.findIndex(a => a.id === highlightedActivityId);

    if (index === -1) {
      return;
    }

    // Aguarda todas as interações e animações terminarem antes de tentar scroll
    const handle = InteractionManager.runAfterInteractions(() => {
      const currentListRef = activeTab === 'feed' ? feedListRef : myPostsListRef;
      
      if (currentListRef.current) {
        if (activeTab === 'feed' || activeTab === 'myPosts') {
          // Delay adicional para garantir layout
          setTimeout(() => {
            scrollToActivity(highlightedActivityId, activeTab);
          }, 200);
        }
      } else {
        console.warn('[EXPLORE] ⚠️ Ref não disponível após interações, tentando com retry...');
        
        // Fallback: tenta com retry
        let attempts = 0;
        const maxAttempts = 15;
        
        const checkAndScroll = () => {
          attempts++;
          const retryListRef = activeTab === 'feed' ? feedListRef : myPostsListRef;
          
          console.log(`[EXPLORE] Retry ${attempts}/${maxAttempts} - Tab: ${activeTab}, Ref: ${!!retryListRef.current}`);
          
          if (retryListRef.current) {
            console.log(`[EXPLORE] ✅ Ref disponível no retry ${attempts}! Executando scroll`);
            if (activeTab === 'feed' || activeTab === 'myPosts') {
              scrollToActivity(highlightedActivityId, activeTab);
            }
          } else if (attempts < maxAttempts) {
            setTimeout(checkAndScroll, 150);
          } else {
            console.error(`[EXPLORE] ❌ Ref não disponível após ${attempts} tentativas`);
            console.error(`[EXPLORE] Debug - activeTab: ${activeTab}, items: ${targetList.length}`);
          }
        };
        
        setTimeout(checkAndScroll, 200);
      }
    });

    return () => handle.cancel();
  }, [highlightedActivityId, activeTab, activities, myPosts, feedLoading, myPostsLoading]);

  // Função para fazer scroll até uma atividade específica
  const scrollToActivity = (activityId: string, tab: 'feed' | 'myPosts') => {
    const list = tab === 'feed' ? activities : myPosts;
    const listRef = tab === 'feed' ? feedListRef : myPostsListRef;
    const index = list.findIndex(a => a.id === activityId);
    
    if (index === -1) {
      return;
    }

    if (!listRef.current) {
      return;
    }
    
    try {
      // Tenta scrollToIndex primeiro (método preferido)
      listRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.3, // Posiciona um pouco acima do centro para melhor visibilidade
      });
    } catch (error) {
      // Fallback: tenta scroll manual por offset
      try {
        listRef.current.scrollToOffset({
          offset: index * 250, // Altura aproximada de um card
          animated: true,
        });
      } catch (fallbackError) {
        // Silently fail
      }
    }
  };

  // Load initial feed
  const loadFeed = async (isRefresh = false) => {
    try {
      console.log('[FEED] 🔄 Iniciando loadFeed - isRefresh:', isRefresh, 'offset:', offset);
      
      if (isRefresh) {
        setFeedRefreshing(true);
      } else if (!initialLoad) {
        setFeedLoading(true);
      }

      const newOffset = isRefresh ? 0 : offset;
      console.log('[FEED] 📡 Chamando getFriendActivity com offset:', newOffset);
      
      const data = await feedService.getFriendActivity(20, newOffset);
      
      console.log('[FEED] ✅ Dados recebidos:', data.length, 'atividades');
      console.log('[FEED] 📸 Atividades com foto:', data.filter(a => a.photoUrl).length);
      
      // Log da primeira atividade para debug
      if (data.length > 0) {
        console.log('[FEED] 📝 Primeira atividade:', {
          id: data[0].id,
          type: data[0].type,
          hasPhoto: !!data[0].photoUrl,
          photoUrl: data[0].photoUrl?.substring(0, 50),
          caption: data[0].caption,
        });
      }
      
      if (isRefresh) {
        setActivities(data);
        setOffset(20);
      } else {
        setActivities(prev => [...prev, ...data]);
        setOffset(prev => prev + 20);
      }

      setHasMore(data.length === 20);
    } catch (error: any) {
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
      if (error.response?.status === 500) {
        setMyPostsHasMore(false);
      }
    } finally {
      setMyPostsLoading(false);
      setMyPostsRefreshing(false);
      setMyPostsInitialLoad(false);
      setInitialLoad(false); // Garante que o loading screen seja removido
    }
  };

  const loadLeaderboard = async (isRefresh = false, type?: LeaderboardType, scope?: 'friends' | 'global') => {
    try {
      if (isRefresh) {
        setLeaderboardRefreshing(true);
      } else {
        setLeaderboardLoading(true);
      }

      // Usa os parâmetros passados ou os valores do estado
      const effectiveType = type ?? leaderboardType;
      const effectiveScope = scope ?? leaderboardScope;

      console.log('[LEADERBOARD] Carregando com:', { effectiveType, effectiveScope });

      const result = effectiveScope === 'friends'
        ? await leaderboardService.getFriendsLeaderboard(effectiveType, 50)
        : await leaderboardService.getGlobalLeaderboard(effectiveType, 100);

      if (result && result.leaderboard) {
        console.log('[LEADERBOARD] Dados recebidos:', result.leaderboard.length, 'usuários');
        setLeaderboard(result.leaderboard);
      }
    } catch (error: any) {
      // Silently fail
    } finally {
      setLeaderboardLoading(false);
      setLeaderboardRefreshing(false);
      setInitialLoad(false); // Garante que o loading screen seja removido
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
    console.log('[LEADERBOARD] Mudando filtro para:', { type, scope });
    setLeaderboardType(type);
    setLeaderboardScope(scope);
    // Passa os novos valores diretamente para evitar usar estado desatualizado
    loadLeaderboard(true, type, scope);
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

  /**
   * Renderiza footer de loading na lista
   * Mostra "Carregando..." durante scroll infinito
   * Não mostra durante: carregamento inicial, refresh (RefreshControl já mostra indicador)
   */
  const renderFooter = () => {
    const isLoading = activeTab === 'feed' ? feedLoading : myPostsLoading;
    const isRefreshing = activeTab === 'feed' ? feedRefreshing : myPostsRefreshing;
    
    console.log('[EXPLORE] renderFooter - Tab:', activeTab, 'Loading:', isLoading, 'Refreshing:', isRefreshing, 'InitialLoad:', initialLoad);
    
    // Não mostra durante o carregamento inicial ou durante refresh (RefreshControl já mostra)
    if (!isLoading || initialLoad || isRefreshing) return null;
    
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
        showNotifications={true}
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
            <TouchableOpacity
              style={[styles.filterButton, leaderboardType === 'distance' && styles.activeFilter]}
              onPress={() => changeLeaderboardFilter('distance', leaderboardScope)}
            >
              <Text style={[styles.filterText, leaderboardType === 'distance' && styles.activeFilterText]}>
                KM
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      {activeTab === 'feed' ? (
        <FlatList
          ref={feedListRef}
          data={activities}
          keyExtractor={(item, index) => `${item.id || item.userId}-${item.type}-${index}`}
          renderItem={({ item }) => (
            <FeedActivityCard 
              activity={item} 
              onInteraction={refreshStats}
              isHighlighted={highlightedActivityId === item.id}
              openCommentsOnMount={openCommentsForActivityId === item.id}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={feedRefreshing} onRefresh={onRefresh} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          onScrollToIndexFailed={(info) => {
            console.warn('[EXPLORE] Falha ao scroll para índice:', info);
            // Tenta scroll para offset em vez de index
            feedListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
        />
      ) : activeTab === 'myPosts' ? (
        <FlatList
          ref={myPostsListRef}
          data={myPosts}
          keyExtractor={(item, index) => `${item.id || item.userId}-${item.type}-${index}`}
          renderItem={({ item }) => (
            <FeedActivityCard 
              activity={item} 
              onInteraction={refreshStats}
              isHighlighted={highlightedActivityId === item.id}
              openCommentsOnMount={openCommentsForActivityId === item.id}
            />
          )}
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
            myPostsLoading && !myPostsInitialLoad && !myPostsRefreshing ? (
              <View style={styles.footerLoading}>
                <Text style={styles.footerText}>Carregando...</Text>
              </View>
            ) : null
          }
          onScrollToIndexFailed={(info) => {
            console.warn('[EXPLORE] Falha ao scroll para índice (myPosts):', info);
            myPostsListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
        />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => `${item.id}-${leaderboardType}-${leaderboardScope}`}
          extraData={leaderboardType}
          renderItem={({ item, index }) => {
            const stat = leaderboardType === 'xp' ? item.xp
              : leaderboardType === 'streak' ? item.currentStreak
              : leaderboardType === 'distance' ? (item.totalDistance || 0)
              : item.challengesCompleted;
            
            return (
              <LeaderboardCard
                position={index + 1}
                user={item}
                stat={stat}
                statType={leaderboardType as 'xp' | 'streak' | 'challenges' | 'distance'}
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


