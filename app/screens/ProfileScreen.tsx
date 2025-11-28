// app/screens/ProfileScreen.tsx

import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../../components/layout/Header';
import { Avatar, BadgeItem, Card, InfoRow, StatBox } from '../../components/ui';
import { useAlert } from '../../hooks/useAlert';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import { getUserBadges } from '../../services/badge';
import type { User } from '../../types/user';
import { styles } from '../styles/profile.styles';

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentBadges, setRecentBadges] = useState<any[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const { alert } = useAlert();

  // Recarrega dados quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadUserData();
      loadRecentBadges();
    }, [])
  );

  useEffect(() => {
    loadUserData();
    loadRecentBadges();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Busca token armazenado
      const token = await authStorage.getToken();
      
      if (!token) {
        // Se não tem token, volta pro login
        router.replace('/');
        return;
      }

      // Busca dados do usuário no backend
      // Token é injetado automaticamente pelo interceptor
      const result = await authService.getMe();
      
      if (result.success) {
        setUser(result.data); // result.data já é o objeto user após a correção no api.ts
      } else {
        alert.error('Erro de Autenticação', 'Não foi possível carregar seus dados. Você foi desconectado.');
        // Força logout se não conseguir carregar dados
        await authStorage.logout();
        router.replace('/');
      }
    } catch (error) {
      alert.error('Erro', 'Erro ao carregar dados do usuário. Você foi desconectado.');
      // Força logout em caso de erro
      await authStorage.logout();
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  // Carrega badges mais recentes do usuário
  const loadRecentBadges = async () => {
    try {
      setLoadingBadges(true);
      
      // Verifica se ainda está logado antes de carregar
      const token = await authStorage.getToken();
      if (!token) return;
      
      const badges = await getUserBadges();
      
      // Pega os 5 badges mais recentes (já vêm ordenados por earnedAt desc)
      const recent = badges.slice(0, 5);
      setRecentBadges(recent);
    } catch (error) {
      console.error('Erro ao carregar badges:', error);
      // Não mostra alert para não incomodar o usuário
    } finally {
      setLoadingBadges(false);
    }
  };

  // Função para pegar iniciais do nome ou email
  const getInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return user?.email.substring(0, 2).toUpperCase() || 'US';
  };

  // Formata a data de criação
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch (error) {
      return 'Data não disponível';
    }
  };

  // Calcula dias desde o cadastro
  const getDaysSinceCreation = () => {
    if (!user || !user.createdAt) return 0;
    
    try {
      const created = new Date(user.createdAt);
      const now = new Date();
      
      if (isNaN(created.getTime())) {
        return 0;
      }
      
      const diffTime = Math.abs(now.getTime() - created.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.loadingText}>Erro ao carregar dados</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <Header
        title="FiQuestLife"
        subtitle="Bem-vindo à sua jornada! 🎯"
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { justifyContent: 'flex-start' }]}
        showsVerticalScrollIndicator={false}
      >

        {/* CARD DE PERFIL */}
        <Card style={styles.profileCard}>
          {/*<Tag
            icon="shield-star"
            text="Perfil do Aventureiro"
          />*/}

          <Text style={styles.cardTitle}>
            {"@" + user.username || user.name || 'Aventureiro'}
          </Text>
          <Text style={styles.cardSubtitle}>
            Membro desde {getFormattedDate(user.createdAt)}
          </Text>

          <View style={styles.avatarContainer}>
            <Avatar 
              initials={getInitials()}
              imageUrl={user.avatarUrl}
              size={80}
            />
          </View>

          <View style={styles.infoContainer}>
            <InfoRow
              icon="account-outline"
              label="Nome Completo"
              value={user.name || 'Não informado'}
            />
          </View>

          <View style={styles.statsContainer}>
            <StatBox
              icon="fire"
              value={user.currentStreak || 0}
              label="Sequência"
              iconColor="#FF6347"
            />

            <StatBox
              icon="trophy"
              value={user.level || 1}
              label="Level"
              iconColor="#FFD700"
            />

            <StatBox
              icon="star"
              value={user.xp || 0}
              label="XP"
              iconColor="#20B2AA"
            />
          </View>

          <View style={styles.statsContainer}>
            <StatBox
              icon="cash"
              value={user.coins || 0}
              label="FiCoins"
              iconColor="#FFD700"
            />

            <StatBox
              icon="fire-circle"
              value={user.longestStreak || 0}
              label="Recorde"
              iconColor="#FF4500"
            />

            <StatBox
              icon="calendar-check"
              value={getDaysSinceCreation()}
              label="Dias"
            />
          </View>
        </Card>

        {/* SEÇÃO DE BADGES EM DESTAQUE */}
        <Card style={styles.badgesCard}>
          <View style={styles.badgesSectionHeader}>
            <Text style={styles.badgesSectionTitle}>🏆 Conquistas Recentes</Text>
            <Text style={styles.badgesSectionSubtitle}>
              Suas últimas conquistas desbloqueadas
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/badges')}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllButtonText}>Ver Todos</Text>
          </TouchableOpacity>

          {loadingBadges ? (
            <View style={styles.badgesLoadingContainer}>
              <ActivityIndicator size="small" color="#20B2AA" />
            </View>
          ) : recentBadges.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgesScrollContainer}
            >
              {recentBadges.map((userBadge) => (
                <BadgeItem
                  key={userBadge.id}
                  icon={userBadge.badge.icon}
                  name={userBadge.badge.name}
                  earnedAt={userBadge.earnedAt}
                  rarity={userBadge.badge.rarity}
                  variant="mini"
                  onPress={() => router.push('/(tabs)/badges')}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.noBadgesContainer}>
              <Text style={styles.noBadgesIcon}>🔒</Text>
              <Text style={styles.noBadgesText}>Nenhuma conquista conquistada ainda</Text>
              <Text style={styles.noBadgesSubtext}>
                Complete desafios para desbloquear conquistas!
              </Text>
            </View>
          )}
        </Card>

        {/* BOTÃO: HISTÓRICO DE RECOMPENSAS */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push('/history' as any)}
          accessible={true}
          accessibilityLabel="Ver histórico de recompensas"
          accessibilityRole="button"
          accessibilityHint="Abre a tela com todo o histórico de XP, moedas e conquistas ganhas"
        >
          <View style={styles.historyButtonContent}>
            <View style={styles.historyButtonIcon}>
              <Text style={styles.historyButtonEmoji}>📜</Text>
            </View>
            <View style={styles.historyButtonText}>
              <Text style={styles.historyButtonTitle}>Histórico de Recompensas</Text>
              <Text style={styles.historyButtonSubtitle}>
                Veja todas as recompensas que você ganhou
              </Text>
            </View>
          </View>
          <Text style={styles.historyButtonArrow}>›</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
