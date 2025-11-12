/**
 * ============================================
 * USER PROFILE SCREEN
 * ============================================
 * 
 * Tela para visualizar perfil de outros usuários
 * 
 * @created 2 de novembro de 2025
 */

import { SimpleHeader } from '@/components/layout';
import { Avatar, BadgeItem, Button, Card, EmptyState, InfoRow, StatBox } from '@/components/ui';
import { authService } from '@/services/api';
import { friendService } from '@/services/friend';
import { UserProfile, userProfileService } from '@/services/userProfile';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mutualFriendsCount, setMutualFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  /**
   * Carrega ID do usuário atualmente logado
   * Usado para verificar se está visualizando o próprio perfil
   */
  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadProfile();
      loadMutualFriends();
    }
  }, [userId]);

  /**
   * Busca dados do usuário atualmente logado
   */
  const loadCurrentUser = async () => {
    try {
      const result = await authService.getMe();
      if (result.success && result.data) {
        setCurrentUserId(result.data.id);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário atual:', error);
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userProfileService.getUserProfile(userId!);
      setProfile(data);
      setIsPrivate(false);
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.isPrivate) {
        setIsPrivate(true);
      } else {
        console.error('Erro ao carregar perfil:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMutualFriends = async () => {
    try {
      const friends = await userProfileService.getMutualFriends(userId!);
      setMutualFriendsCount(friends.length);
    } catch (error) {
      console.error('Erro ao carregar amigos em comum:', error);
    }
  };

  const handleAddFriend = async () => {
    try {
      setActionLoading(true);
      await friendService.sendFriendRequest(userId!);
      // Reload profile to update relationship status
      await loadProfile();
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      setActionLoading(true);
      await friendService.removeFriend(userId!);
      await loadProfile();
    } catch (error) {
      console.error('Erro ao remover amigo:', error);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Renderiza botão de ação apropriado baseado no relacionamento
   * - Se é o próprio perfil: não mostra botão
   * - Se é amigo: mostra "Remover Amigo"
   * - Se tem solicitação pendente: mostra status apropriado
   * - Caso contrário: mostra "Adicionar Amigo"
   */
  const renderActionButton = () => {
    if (!profile) return null;

    // Se está visualizando o próprio perfil, não mostra botão de ação
    if (currentUserId && userId === currentUserId) {
      return null;
    }

    const { relationship } = profile;

    if (relationship.isFriend) {
      return (
        <Button
          title="Remover Amigo"
          onPress={handleRemoveFriend}
          variant="outline"
          loading={actionLoading}
        />
      );
    }

    if (relationship.hasPendingRequest) {
      const text = relationship.requestDirection === 'SENT' 
        ? 'Solicitação Enviada' 
        : 'Responder Solicitação';
      
      return (
        <Button
          title={text}
          onPress={() => {
            if (relationship.requestDirection === 'RECEIVED') {
              router.push('/friends');
            }
          }}
          variant="outline"
          disabled={relationship.requestDirection === 'SENT'}
        />
      );
    }

    return (
      <Button
        title="Adicionar Amigo"
        onPress={handleAddFriend}
        loading={actionLoading}
      />
    );
  };

  // Private profile state
  if (isPrivate) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" />
        <SimpleHeader title="Perfil Privado" />
        
        <View style={styles.privateContainer}>
          <MaterialCommunityIcons name="lock-outline" size={80} color="#8E8E93" />
          <Text style={styles.privateTitle}>Perfil Privado</Text>
          <Text style={styles.privateSubtitle}>
            Este usuário tem um perfil privado.{'\n'}
            Adicione como amigo para ver mais informações.
          </Text>
          <View style={styles.actionButtonContainer}>
            <Button
              title="Adicionar Amigo"
              onPress={handleAddFriend}
              loading={actionLoading}
            />
          </View>
        </View>
      </View>
    );
  }

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" />
        <SimpleHeader title="Perfil" />
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#20B2AA" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </View>
    );
  }

  // No profile found
  if (!profile) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" />
        <SimpleHeader title="Perfil" />
        
        <EmptyState
          icon="person-outline"
          title="Usuário não encontrado"
          description="Não foi possível carregar este perfil."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <SimpleHeader title="Perfil" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* CARD DE PERFIL */}
        <Card style={styles.profileCard}>
          <Text style={styles.cardTitle}>
            {"@" + profile.user.username}
          </Text>
          <Text style={styles.cardSubtitle}>
            Membro desde {new Date(profile.user.memberSince).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>

          <View style={styles.avatarContainer}>
            <Avatar 
              initials={profile.user.username.substring(0, 2).toUpperCase()}
              imageUrl={profile.user.avatarUrl || undefined}
              size={80}
            />
          </View>

          <View style={styles.infoContainer}>
            <InfoRow
              icon="account-outline"
              label="Nome Completo"
              value={profile.user.name || 'Não informado'}
            />
            
            {/* Mutual Friends */}
            {mutualFriendsCount > 0 && (
              <InfoRow
                icon="account-group"
                label="Amigos em Comum"
                value={`${mutualFriendsCount} amigo${mutualFriendsCount > 1 ? 's' : ''}`}
              />
            )}
            
            {/* Bio */}
            {profile.user.bio && (
              <InfoRow
                icon="information-outline"
                label="Bio"
                value={profile.user.bio}
              />
            )}
          </View>

          <View style={styles.statsContainer}>
            <StatBox
              icon="fire"
              value={profile.user.currentStreak || 0}
              label="Sequência"
              iconColor="#FF6347"
            />

            <StatBox
              icon="trophy"
              value={profile.user.level || 1}
              label="Level"
              iconColor="#FFD700"
            />

            <StatBox
              icon="star"
              value={profile.user.xp || 0}
              label="XP"
              iconColor="#20B2AA"
            />
          </View>

          <View style={styles.statsContainer}>
            <StatBox
              icon="flag-checkered"
              value={profile.stats.completedChallenges}
              label="Desafios"
              iconColor="#4CAF50"
            />

            <StatBox
              icon="trophy-award"
              value={profile.stats.badgesCount}
              label="Conquistas"
              iconColor="#9C27B0"
            />

            <StatBox
              icon="account-group"
              value={profile.stats.friendsCount}
              label="Amigos"
              iconColor="#007AFF"
            />
          </View>

          {/* Action Button */}
          <View style={styles.actionButtonContainer}>
            {renderActionButton()}
          </View>
        </Card>

        {/* SEÇÃO DE BADGES EM DESTAQUE */}
        {profile.badges.length > 0 && (
          <Card style={styles.badgesCard}>
            <View style={styles.badgesSectionHeader}>
              <Text style={styles.badgesSectionTitle}>🏆 Conquistas Recentes</Text>
              <Text style={styles.badgesSectionSubtitle}>
                Últimas conquistas desbloqueadas
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgesScrollContainer}
            >
              {profile.badges.map((badge) => (
                <BadgeItem
                  key={badge.id}
                  name={badge.name}
                  earnedAt={badge.earnedAt}
                  rarity={badge.rarity as any}
                  variant="mini"
                  onPress={() => {}}
                />
              ))}
            </ScrollView>
          </Card>
        )}

        {/* DESAFIOS RECENTES */}
        {profile.recentChallenges.length > 0 && (
          <Card style={styles.challengesCard}>
            <View style={styles.badgesSectionHeader}>
              <Text style={styles.badgesSectionTitle}>⚡ Desafios Recentes</Text>
              <Text style={styles.badgesSectionSubtitle}>
                Desafios completados recentemente
              </Text>
            </View>

            {profile.recentChallenges.map((challenge) => (
              <View key={challenge.id} style={styles.challengeItem}>
                <View style={styles.challengeContent}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeCategory}>
                    {challenge.category.replace('_', ' ')} • {challenge.difficulty}
                  </Text>
                </View>
                <View style={styles.xpBadge}>
                  <MaterialCommunityIcons name="star" size={14} color="#FFD60A" />
                  <Text style={styles.xpText}>+{challenge.xpReward}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  privateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  privateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 24,
    marginBottom: 12,
  },
  privateSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  
  // PROFILE CARD
  profileCard: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F4F4F',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 15,
  },
  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  actionButtonContainer: {
    width: '100%',
    marginTop: 10,
  },

  // BADGES CARD
  badgesCard: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  badgesSectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgesSectionSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  badgesScrollContainer: {
    paddingVertical: 8,
    gap: 12,
  },

  // CHALLENGES CARD
  challengesCard: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 8,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  challengeCategory: {
    fontSize: 13,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD60A20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD60A40',
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD60A',
    marginLeft: 4,
  },
});
