/**
 * ============================================
 * SELECT FRIEND MODAL - Modal de Seleção de Amigos
 * ============================================
 * 
 * Modal para selecionar um amigo para desafiar
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getFriendsAlreadyChallengedToday } from '../../services/challengeInvitation';
import { friendService } from '../../services/friend';
import { Avatar } from './Avatar';

interface Friend {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
}

interface SelectFriendModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFriend: (friendId: string, friendName: string) => void;
}

export function SelectFriendModal({ visible, onClose, onSelectFriend }: SelectFriendModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alreadyChallengedIds, setAlreadyChallengedIds] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      loadFriends();
    } else {
      setSearchQuery('');
    }
  }, [visible]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    } else {
      setFilteredFriends(friends);
    }
  }, [searchQuery, friends]);

  const loadFriends = async () => {
    setLoading(true);
    try {
      const [friendsList, challengedIds] = await Promise.all([
        friendService.getFriendsList(),
        getFriendsAlreadyChallengedToday(),
      ]);
      
      setFriends(friendsList);
      setFilteredFriends(friendsList);
      setAlreadyChallengedIds(challengedIds);
    } catch (error) {
      console.error('Erro ao carregar amigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFriend = (friend: Friend) => {
    onSelectFriend(friend.id, friend.name);
    onClose();
  };

  const renderFriendItem = ({ item }: { item: Friend }) => {
    const alreadyChallenged = alreadyChallengedIds.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.friendItem,
          alreadyChallenged && styles.friendItemDisabled,
        ]}
        onPress={() => !alreadyChallenged && handleSelectFriend(item)}
        disabled={alreadyChallenged}
      >
        <Avatar
          imageUrl={item.avatarUrl}
          initials={item.name.substring(0, 2)}
          size={50}
        />
        <View style={styles.friendInfo}>
          <Text style={[
            styles.friendName,
            alreadyChallenged && styles.textDisabled,
          ]}>
            {item.name}
          </Text>
          <Text style={[
            styles.friendUsername,
            alreadyChallenged && styles.textDisabled,
          ]}>
            @{item.username}
          </Text>
        </View>
        
        {alreadyChallenged ? (
          <View style={styles.challengedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#999" />
            <Text style={styles.challengedBadgeText}>Já desafiado</Text>
          </View>
        ) : (
          <View style={styles.friendLevel}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.levelText}>Nível {item.level}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Desafiar Amigo</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar amigo..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Friends List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#20B2AA" />
            </View>
          ) : filteredFriends.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhum amigo encontrado' : 'Você ainda não tem amigos'}
              </Text>
              {!searchQuery && (
                <Text style={styles.emptySubtext}>
                  Adicione amigos para desafiá-los!
                </Text>
              )}
            </View>
          ) : (
            <FlatList
              data={filteredFriends}
              renderItem={renderFriendItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginTop: 8,
  },
  friendItemDisabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.6,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 14,
    color: '#666',
  },
  textDisabled: {
    color: '#999',
  },
  friendLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  challengedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  challengedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
  },
});
