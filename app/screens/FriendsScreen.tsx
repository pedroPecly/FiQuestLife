import { Header } from '@/components/layout';
import {
    FriendCard,
    FriendRequestCard,
    LoadingScreen,
    UserSearchCard,
} from '@/components/ui';
import type { Friend, FriendRequest, UserSearchResult } from '@/services/friend';
import { friendService } from '@/services/friend';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { showAlert, showDialog } from '../../utils/dialog';

type TabType = 'friends' | 'requests' | 'search';

export default function FriendsScreen() {
  const params = useLocalSearchParams();
  const initialTab = (params.tab as TabType) || 'search';
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Friends tab
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsCount, setFriendsCount] = useState(0);

  // Requests tab
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [requestsSubTab, setRequestsSubTab] = useState<'received' | 'sent'>('received');

  // Search tab
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  // Load initial data
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadFriends(), loadRequests(), loadStats()]);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      showAlert('Erro', error.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const data = await friendService.getFriendsList();
      setFriends(data);
    } catch (error: any) {
      console.error('Erro ao carregar amigos:', error);
    }
  };

  const loadRequests = async () => {
    try {
      const [pending, sent] = await Promise.all([
        friendService.getPendingRequests(),
        friendService.getSentRequests(),
      ]);
      
      setPendingRequests(pending);
      setSentRequests(sent);
    } catch (error: any) {
      console.error('Erro ao carregar solicitações:', error);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await friendService.getFriendStats();
      setFriendsCount(stats.friendsCount);
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Search function
  const performSearch = async () => {
    if (searchQuery.trim().length < 2) {
      showAlert('Atenção', 'Digite pelo menos 2 caracteres para buscar');
      return;
    }

    try {
      setSearching(true);
      const results = await friendService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      showAlert('Erro', error.message || 'Erro ao buscar usuários');
    } finally {
      setSearching(false);
    }
  };

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
    // Limpa os resultados se o campo for esvaziado
    if (text.trim().length === 0) {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Actions
  const handleSendRequest = async (userId: string) => {
    try {
      await friendService.sendFriendRequest(userId);
      showAlert('Sucesso', 'Solicitação de amizade enviada!');
      // Reload search to update status
      if (searchQuery.trim().length >= 2) {
        await performSearch();
      }
      await loadRequests();
    } catch (error: any) {
      showAlert('Erro', error.message || 'Erro ao enviar solicitação');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await friendService.acceptFriendRequest(requestId);
      showAlert('Sucesso', 'Solicitação aceita!');
      await loadData();
    } catch (error: any) {
      showAlert('Erro', error.message || 'Erro ao aceitar solicitação');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      showAlert('Sucesso', 'Solicitação rejeitada');
      await loadData();
    } catch (error: any) {
      showAlert('Erro', error.message || 'Erro ao rejeitar solicitação');
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await friendService.cancelFriendRequest(requestId);
      showAlert('Sucesso', 'Solicitação cancelada');
      await loadData();
    } catch (error: any) {
      showAlert('Erro', error.message || 'Erro ao cancelar solicitação');
    }
  };

  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    showDialog({
      title: 'Confirmar',
      message: `Tem certeza que deseja remover ${friendName} dos seus amigos?`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await friendService.removeFriend(friendId);
          showAlert('Sucesso', 'Amigo removido');
          await loadData();
        } catch (error: any) {
          showAlert('Erro', error.message || 'Erro ao remover amigo');
        }
      },
    });
  };

  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'search' && styles.tabActive]}
        onPress={() => setActiveTab('search')}
      >
        <MaterialCommunityIcons
          name="account-search"
          size={20}
          color={activeTab === 'search' ? '#007AFF' : '#8E8E93'}
        />
        <Text style={[styles.tabText, activeTab === 'search' && styles.tabTextActive]}>
          Buscar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
        onPress={() => setActiveTab('requests')}
      >
        <MaterialCommunityIcons
          name="account-clock"
          size={20}
          color={activeTab === 'requests' ? '#007AFF' : '#8E8E93'}
        />
        <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
          Solicitações
        </Text>
        {pendingRequests.length > 0 && (
          <View style={styles.badgeAlert}>
            <Text style={styles.badgeText}>{pendingRequests.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
        onPress={() => setActiveTab('friends')}
      >
        <MaterialCommunityIcons
          name="account-group"
          size={20}
          color={activeTab === 'friends' ? '#007AFF' : '#8E8E93'}
        />
        <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>
          Amigos
        </Text>
        {friendsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{friendsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  // Render Friends List
  const renderFriendsList = () => (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FriendCard
          friend={item}
          onPress={() => {
            // TODO: Navigate to friend profile
            console.log('Open friend profile:', item.id);
          }}
          onRemove={() => handleRemoveFriend(item.id, item.name)}
        />
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-group-outline" size={80} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>Nenhum amigo ainda</Text>
          <Text style={styles.emptyText}>
            Busque usuários na aba "Buscar" para adicionar seus primeiros amigos!
          </Text>
        </View>
      }
    />
  );

  // Render Requests List
  const renderRequestsList = () => {
    const currentRequests = requestsSubTab === 'received' ? pendingRequests : sentRequests;

    return (
      <>
        <View style={styles.subTabs}>
          <TouchableOpacity
            style={[styles.subTab, requestsSubTab === 'received' && styles.subTabActive]}
            onPress={() => setRequestsSubTab('received')}
          >
            <Text
              style={[styles.subTabText, requestsSubTab === 'received' && styles.subTabTextActive]}
            >
              Recebidas ({pendingRequests.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, requestsSubTab === 'sent' && styles.subTabActive]}
            onPress={() => setRequestsSubTab('sent')}
          >
            <Text style={[styles.subTabText, requestsSubTab === 'sent' && styles.subTabTextActive]}>
              Enviadas ({sentRequests.length})
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={currentRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FriendRequestCard
              request={item}
              type={requestsSubTab}
              onAccept={() => handleAcceptRequest(item.id)}
              onReject={() => handleRejectRequest(item.id)}
              onCancel={() => handleCancelRequest(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="email-outline" size={80} color="#C7C7CC" />
              <Text style={styles.emptyTitle}>
                {requestsSubTab === 'received' ? 'Nenhuma solicitação' : 'Nenhuma pendente'}
              </Text>
              <Text style={styles.emptyText}>
                {requestsSubTab === 'received'
                  ? 'Você não tem solicitações de amizade no momento'
                  : 'Você não enviou nenhuma solicitação'}
              </Text>
            </View>
          }
        />
      </>
    );
  };

  // Render Search
  const renderSearch = () => (
    <>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por @username ou nome"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={performSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSearch}
          >
            <MaterialCommunityIcons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={performSearch}
          disabled={searching || searchQuery.trim().length < 2}
        >
          {searching ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={searchQuery.trim().length < 2 ? '#C7C7CC' : '#007AFF'}
            />
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserSearchCard
            user={item}
            onAddFriend={() => handleSendRequest(item.id)}
            onPress={() => {
              // TODO: Navigate to user profile
              console.log('Open user profile:', item.id);
            }}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          searchQuery.length >= 2 && !searching && searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-search" size={80} color="#C7C7CC" />
              <Text style={styles.emptyTitle}>Nenhum usuário encontrado</Text>
              <Text style={styles.emptyText}>Tente buscar por outro username ou nome</Text>
            </View>
          ) : searchQuery.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-search-outline" size={80} color="#C7C7CC" />
              <Text style={styles.emptyTitle}>Buscar Usuários</Text>
              <Text style={styles.emptyText}>
                Digite um username ou nome e clique em buscar
              </Text>
            </View>
          ) : null
        }
      />
    </>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Amigos"
        subtitle="Conecte-se com outros aventureiros! 👥"
        showNotifications={false}
      />
      {renderTabs()}
      <View style={styles.content}>
        {activeTab === 'search' && renderSearch()}
        {activeTab === 'requests' && renderRequestsList()}
        {activeTab === 'friends' && renderFriendsList()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#E3F2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#007AFF',
  },
  badge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeAlert: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },
  subTabActive: {
    backgroundColor: '#007AFF',
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  searchButton: {
    marginLeft: 8,
    padding: 4,
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
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
