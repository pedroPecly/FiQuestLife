import { Header } from '@/components/layout';
import { Avatar, Button, LoadingScreen, StatBox } from '@/components/ui';
import type { Friend } from '@/services/friend';
import { friendService } from '@/services/friend';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import removido: dialog legacy

export default function FriendProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const friendId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [friend, setFriend] = useState<Friend | null>(null);
  const [mutualFriends, setMutualFriends] = useState<Friend[]>([]);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    loadFriendData();
  }, [friendId]);

  const loadFriendData = async () => {
    try {
      setLoading(true);
      // Buscar dados do amigo da lista de amigos
      const friendsList = await friendService.getFriendsList();
      const friendData = friendsList.find((f) => f.id === friendId);


      if (!friendData) {
        Alert.alert('Erro', 'Amigo não encontrado.');
        router.back();
        return;
      }

      setFriend(friendData);

      // Buscar amigos em comum
      const mutual = await friendService.getMutualFriends(friendId);
      setMutualFriends(mutual);
    } catch (error: any) {
      console.error('Erro ao carregar perfil do amigo:', error);
      Alert.alert('Erro', 'Erro ao carregar perfil do amigo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!friend) return;
    try {
      setRemoving(true);
      await friendService.removeFriend(friend.id);
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao remover amigo.');
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!friend) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header title="Perfil" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Amigo não encontrado</Text>
        </View>
      </View>
    );
  }

  // Gera iniciais do nome
  const initials = friend.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Formata data de amizade
  const friendshipDate = new Date(friend.friendshipDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Perfil do Amigo" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar initials={initials} imageUrl={friend.avatarUrl} size={100} />

          <Text style={styles.name}>{friend.name}</Text>
          <Text style={styles.username}>@{friend.username}</Text>

          <View style={styles.friendshipInfo}>
            <MaterialCommunityIcons name="account-heart" size={16} color="#007AFF" />
            <Text style={styles.friendshipText}>Amigos desde {friendshipDate}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatBox
            icon="trophy"
            label="Nível"
            value={friend.level.toString()}
            iconColor="#FF9500"
          />
          <StatBox
            icon="star"
            label="XP"
            value={friend.xp.toString()}
            iconColor="#FFD60A"
          />
          <StatBox
            icon="fire"
            label="Streak"
            value={`${friend.currentStreak} dias`}
            iconColor="#FF3B30"
          />
          <StatBox
            icon="currency-usd"
            label="FiCoins"
            value={friend.coins.toString()}
            iconColor="#34C759"
          />
        </View>

        {/* Mutual Friends */}
        {mutualFriends.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-group" size={24} color="#007AFF" />
              <Text style={styles.sectionTitle}>
                Amigos em comum ({mutualFriends.length})
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mutualList}>
              {mutualFriends.map((mutual) => {
                const mutualInitials = mutual.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .substring(0, 2);

                return (
                  <TouchableOpacity
                    key={mutual.id}
                    style={styles.mutualCard}
                    onPress={() => {
                      // Navigate to mutual friend profile
                      router.push(`/screens/FriendProfileScreen?id=${mutual.id}` as any);
                    }}
                  >
                    <Avatar initials={mutualInitials} imageUrl={mutual.avatarUrl} size={60} />
                    <Text style={styles.mutualName} numberOfLines={1}>
                      {mutual.name.split(' ')[0]}
                    </Text>
                    <Text style={styles.mutualUsername} numberOfLines={1}>
                      @{mutual.username}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Ver Ranking Conjunto"
            variant="primary"
            icon="chart-line"
            onPress={() => {
              // TODO: Navigate to joint ranking
              // alert removido
            }}
            style={styles.actionButton}
          />

          <Button
            title={removing ? 'Removendo...' : 'Remover Amigo'}
            variant="danger"
            icon="account-remove"
            onPress={handleRemoveFriend}
            disabled={removing}
            style={styles.actionButton}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
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
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 16,
  },
  username: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  friendshipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FF',
    borderRadius: 20,
  },
  friendshipText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap', // Mantém stats na mesma linha
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    minWidth: 80,
    flexShrink: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  mutualList: {
    paddingHorizontal: 20,
  },
  mutualCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  mutualName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 8,
    textAlign: 'center',
  },
  mutualUsername: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});
