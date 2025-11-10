import { ChallengeCard, LoadingScreen } from '@/components/ui';
import { useAlert } from '@/hooks/useAlert';
import { authService } from '@/services/api';
import challengeService, { CompleteChallengeResponse, UserChallenge } from '@/services/challenge';
import {
  cancelStreakReminder,
} from '@/services/notifications';
import type { User } from '@/types/user';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles/challenges.styles';

export default function ChallengesScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const { alert } = useAlert();

  // Carregar usuário e desafios
  const loadData = async () => {
    try {
      // Token é injetado automaticamente pelo interceptor do axios
      const [userResponse, challengesData] = await Promise.all([
        authService.getMe(),
        challengeService.getDailyChallenges(),
      ]);

      if (userResponse.success) {
        setUser(userResponse.data);
      }
      setChallenges(challengesData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      alert.error('Erro', error.response?.data?.error || 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Recarrega dados quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  // Completar desafio
  const handleCompleteChallenge = async (userChallengeId: string) => {
    setCompletingId(userChallengeId);

    try {
      const response: CompleteChallengeResponse = await challengeService.completeChallenge(
        userChallengeId
      );

      // Atualizar desafio na lista local
      const updatedChallenges = challenges.map((item) =>
        item.id === userChallengeId ? { ...item, status: 'COMPLETED' as const } : item
      );
      setChallenges(updatedChallenges);

      // Verifica se completou TODOS os desafios diários
      const allCompleted = updatedChallenges.every((c) => c.status === 'COMPLETED');
      
      if (allCompleted) {
        // Cancela lembrete de streak (completou todos os desafios!)
        await cancelStreakReminder();
        console.log('🎉 Todos os desafios completados! Lembrete de streak cancelado.');
      }

      // Atualizar stats do usuário local
      if (user) {
        setUser({
          ...user,
          xp: response.stats.xp,
          coins: response.stats.coins,
          level: response.stats.level,
          currentStreak: response.stats.currentStreak,
        });
      }

      // Construir mensagem de sucesso
      let successMessage = `+${response.userChallenge.challenge.xpReward} XP\n+${response.userChallenge.challenge.coinsReward} coins!`;

      console.log('📊 Response completa:', JSON.stringify(response, null, 2));
      console.log('🎯 leveledUp:', response.leveledUp, '| newLevel:', response.newLevel);

      // Notificação de level up removida - backend já gerencia
      if (response.leveledUp && response.newLevel) {
        console.log('🎉 Level up! Novo nível:', response.newLevel);
        successMessage += `\n\n🎉 Parabéns! Você subiu para o nível ${response.newLevel}!`;
      }

      // Notificação de badges removida - backend já gerencia
      if (response.newBadges && response.newBadges.length > 0) {
        const badgeNames = response.newBadges.map((b) => b.name).join(', ');
        successMessage += `\n\n🏆 Novas conquistas: ${badgeNames}`;
      }

      // Mostrar feedback de sucesso
      alert.success('Desafio Concluído! 🎉', successMessage);
    } catch (error: any) {
      console.error('Erro ao completar desafio:', error);
      alert.error('Erro', error.response?.data?.error || 'Não foi possível completar o desafio');
    } finally {
      setCompletingId(null);
    }
  };

  // Calcular progresso
  const completedCount = challenges.filter((c) => c.status === 'COMPLETED').length;
  const totalCount = challenges.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header com saudação e stats */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user?.name || 'Usuário'}! 👋</Text>

          <View style={styles.statsRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Nível {user?.level || 1}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{user?.xp || 0}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>{user?.coins || 0}</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{user?.currentStreak || 0}</Text>
            </View>
          </View>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progresso de Hoje</Text>
            <Text style={styles.progressPercentage}>{percentage}%</Text>
          </View>

          <Text style={styles.progressSubtitle}>
            {completedCount}/{totalCount} desafios concluídos
          </Text>

          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
          </View>

          {completedCount === totalCount && totalCount > 0 && (
            <Text style={styles.allCompletedText}>
              🎉 Todos os desafios concluídos hoje!
            </Text>
          )}
        </View>

        {/* Lista de desafios */}
        <View style={styles.challengesSection}>
          <Text style={styles.sectionTitle}>Seus Desafios</Text>

          {challenges.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>Nenhum desafio disponível</Text>
              <Text style={styles.emptySubtitle}>Puxe para baixo para atualizar</Text>
            </View>
          ) : (
            challenges.map((userChallenge) => (
              <ChallengeCard
                key={userChallenge.id}
                userChallenge={userChallenge}
                onComplete={handleCompleteChallenge}
                isCompleting={completingId === userChallenge.id}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
