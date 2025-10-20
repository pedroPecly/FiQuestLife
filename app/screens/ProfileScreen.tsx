// app/screens/ProfileScreen.tsx

import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import { Header } from '../../components/layout/Header';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { InfoRow } from '../../components/ui/InfoRow';
import { StatBox } from '../../components/ui/StatBox';
import { Tag } from '../../components/ui/Tag';
import { useAlert } from '../../hooks/useAlert';
import { authService } from '../../services/api';
import { authStorage } from '../../services/auth';
import type { User } from '../../types/user';
import { styles } from '../styles/profile.styles';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { alert } = useAlert();

  // Recarrega dados quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  useEffect(() => {
    loadUserData();
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
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.loadingText}>Erro ao carregar dados</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="FiQuestLife"
          subtitle="Bem-vindo à sua jornada! 🎯"
        />

        <Card>
          <Tag
            icon="shield-star"
            text="Perfil do Aventureiro"
          />

          <Text style={styles.cardTitle}>
            {user.username || user.name || 'Aventureiro'}
          </Text>
          <Text style={styles.cardSubtitle}>
            Membro desde {getFormattedDate(user.createdAt)}
          </Text>

          <View style={styles.avatarContainer}>
            <Avatar initials={getInitials()} />
          </View>

          <View style={styles.infoContainer}>
            <InfoRow
              icon="account-outline"
              label="Nome Completo"
              value={user.name || 'Não informado'}
            />

            <InfoRow
              icon="at"
              label="Nome de Usuário"
              value={`@${user.username || 'Não informado'}`}
            />

            <InfoRow
              icon="email-outline"
              label="Email"
              value={user.email || 'Não informado'}
            />

            <InfoRow
              icon="calendar-outline"
              label="Data de Nascimento"
              value={user.birthDate ? getFormattedDate(user.birthDate) : 'Não informado'}
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
              label="Moedas"
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
