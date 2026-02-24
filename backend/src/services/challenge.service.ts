/**
 * ============================================
 * CHALLENGE SERVICE - Serviço de Desafios
 * ============================================
 * 
 * Lógica de negócio para gerenciamento de desafios:
 * - Atribuir desafios diários
 * - Completar desafios
 * - Atualizar stats do usuário
 * - Gerenciar streaks
 * - Verificar e conceder badges
 * 
 * @created 20 de outubro de 2025
 */

import type { ChallengeCategory } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { levelFromXP } from '../utils/progressionUtils.js';
import {
    notifyBadgeEarned,
    notifyLevelUp,
    notifyStreakMilestone,
} from './notification.service.js';

/**
 * Atribui 5 desafios aleatórios para o dia atual
 * Não duplica se já foram atribuídos hoje
 */
export const assignDailyChallenges = async (userId: string) => {
  // Verifica se já foram atribuídos hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingChallenges = await prisma.userChallenge.count({
    where: {
      userId,
      assignedAt: {
        gte: today,
      },
    },
  });

  // Se já existem desafios de hoje, não atribui novos
  if (existingChallenges > 0) {
    return getUserDailyChallenges(userId);
  }

  // Busca 5 desafios aleatórios ativos
  const allChallenges = await prisma.challenge.findMany({
    where: { isActive: true },
  });

  // Embaralha e pega 5
  const shuffled = allChallenges.sort(() => 0.5 - Math.random());
  const selectedChallenges = shuffled.slice(0, 5);

  // Cria registros em UserChallenge
  // Desafios com tracking automático (STEPS/DISTANCE) entram direto como IN_PROGRESS
  // pois não exigem ação manual do usuário para iniciar
  const AUTO_TRACKING_TYPES = new Set(['STEPS', 'DISTANCE', 'DURATION']);

  const userChallenges = await Promise.all(
    selectedChallenges.map((challenge) =>
      prisma.userChallenge.create({
        data: {
          userId,
          challengeId: challenge.id,
          status: challenge.trackingType && AUTO_TRACKING_TYPES.has(challenge.trackingType)
            ? 'IN_PROGRESS'   // auto-rastreado pelo sistema de saúde
            : 'PENDING',      // requer ação manual do usuário
          assignedAt: new Date(),
          progress: 0,
        },
        include: {
          challenge: true,
          challengeInvitation: {
            include: {
              fromUser: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      })
    )
  );

  return userChallenges;
};

/**
 * Busca desafios diários do usuário (atribuídos hoje)
 */
export const getUserDailyChallenges = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const challenges = await prisma.userChallenge.findMany({
    where: {
      userId,
      assignedAt: {
        gte: today,
      },
    },
    include: {
      challenge: true,
      challengeInvitation: {
        include: {
          fromUser: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
    orderBy: [
      { status: 'asc' }, // PENDING primeiro
      { challenge: { difficulty: 'asc' } }, // EASY primeiro
    ],
  });

  return challenges;
};

/**
 * Completa um desafio e dá recompensas
 * Retorna stats atualizadas, levelUp, e novos badges
 */
export const completeChallenge = async (
  userId: string,
  userChallengeId: string,
  photoUrl?: string,
  caption?: string
) => {
  // Busca o UserChallenge
  const userChallenge = await prisma.userChallenge.findUnique({
    where: { id: userChallengeId },
    include: { challenge: true },
  });

  if (!userChallenge) {
    throw new Error('Desafio não encontrado');
  }

  if (userChallenge.userId !== userId) {
    throw new Error('Este desafio não pertence a você');
  }

  if (userChallenge.status === 'COMPLETED') {
    throw new Error('Desafio já completado');
  }

  // Verificar se o desafio requer foto
  if (userChallenge.challenge.requiresPhoto && !photoUrl) {
    throw new Error('Este desafio requer uma foto para ser completado');
  }

  // Atualiza status do desafio
  const updatedChallenge = await prisma.userChallenge.update({
    where: { id: userChallengeId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      progress: 100,
      photoUrl,
      caption,
    },
    include: {
      challenge: true,
    },
  });

  // Atualiza stats do usuário (XP e coins)
  const { leveledUp, newLevel, notification } = await updateUserStats(
    userId,
    userChallenge.challenge.xpReward,
    userChallenge.challenge.coinsReward
  );

  // Atualiza streak
  await checkAndUpdateStreak(userId);

  // Verifica e concede badges
  const newBadges = await checkAndAwardBadges(userId);

  // Registra recompensas no histórico
  await prisma.rewardHistory.create({
    data: {
      userId,
      type: 'XP',
      amount: userChallenge.challenge.xpReward,
      source: 'CHALLENGE_COMPLETION',
      sourceId: userChallengeId,
      description: `Completou: ${userChallenge.challenge.title}`,
    },
  });

  await prisma.rewardHistory.create({
    data: {
      userId,
      type: 'COINS',
      amount: userChallenge.challenge.coinsReward,
      source: 'CHALLENGE_COMPLETION',
      sourceId: userChallengeId,
      description: `Completou: ${userChallenge.challenge.title}`,
    },
  });

  // REMOVIDO: Notificação de desafio completado (usuário não quer receber)
  // As notificações para desafios completados foram desativadas a pedido do usuário

  // ✅ VERIFICA DESAFIOS AUTO-COMPLETÁVEIS (ex: "Complete 3 desafios hoje")
  // Importar dinamicamente para evitar dependência circular
  try {
    const { verifyAndCompleteChallenge } = await import('./auto-verify.service.js');
    // Fire-and-forget: não aguarda para não aumentar latência
    verifyAndCompleteChallenge(userId, 'DAILY_CHALLENGES_COMPLETED').catch((err) =>
      console.error('[CHALLENGE] Erro ao verificar desafios auto-completáveis:', err)
    );
  } catch (error) {
    console.error('[CHALLENGE] Erro ao importar auto-verify.service:', error);
  }

  // Busca stats atualizadas
  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      coins: true,
      level: true,
      currentStreak: true,
      longestStreak: true,
    },
  });

  return {
    userChallenge: updatedChallenge,
    stats: updatedUser,
    leveledUp,
    newLevel,
    newBadges,
    notification, // Retorna notificação de level up (se houver)
  };
};

/**
 * Atualiza XP e coins do usuário e calcula level
 * Retorna se subiu de nível
 */
export const updateUserStats = async (userId: string, xp: number, coins: number) => {
  // Busca usuário atual
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, coins: true, level: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const currentLevel = user.level;
  const newXP = user.xp + xp;
  const newCoins = user.coins + coins;

  // Calcula novo nível com fórmula quadrática: xpParaNivel(n) = 50*(n-1)*(n+5)
  // Gap entre níveis: 100n + 250 XP (cresce linearmente)
  //
  // PROTEÇÃO DE MIGRAÇÃO: usuários que progrediram com a fórmula antiga (1000 XP/nível)
  // nunca perdem o nível já conquistado. O Math.max garante que o nível só sobe.
  // Contexto: a fórmula nova e a antiga se cruzam no nível 15 — abaixo disso a nova
  // é mais generosa (boost gratuito), acima disso exigiria mais XP (regressão inaceitável).
  const newLevel = Math.max(currentLevel, levelFromXP(newXP));
  const leveledUp = newLevel > currentLevel;

  // Atualiza usuário
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      coins: newCoins,
      level: newLevel,
    },
  });

  // Preparar dados de notificação (para retornar ao frontend)
  let notification = null;

  // Se subiu de nível, registra no histórico
  if (leveledUp) {
    await prisma.rewardHistory.create({
      data: {
        userId,
        type: 'XP',
        amount: newLevel,
        source: 'LEVEL_PROGRESSION',
        description: `Subiu para o nível ${newLevel}!`,
      },
    });

    // Criar notificação (push + dados para retornar)
    try {
      notification = await notifyLevelUp(userId, newLevel);
    } catch (error) {
      console.error('[CHALLENGE SERVICE] Erro ao criar notificação de level up:', error);
    }
  }

  return { leveledUp, newLevel, notification };
};

/**
 * Verifica e atualiza streak do usuário
 * Incrementa se ativo ontem, reseta se quebrou
 */
export const checkAndUpdateStreak = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveDate: true, currentStreak: true, longestStreak: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  
  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
  }

  let newStreak = user.currentStreak;

  if (!lastActive) {
    // Primeira atividade
    newStreak = 1;
  } else {
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Já contabilizado hoje, não altera
      return;
    } else if (daysDiff === 1) {
      // Dia consecutivo, incrementa
      newStreak = user.currentStreak + 1;
    } else {
      // Quebrou streak
      newStreak = 1;
    }
  }

  // Atualiza longestStreak se necessário
  const newLongestStreak = Math.max(newStreak, user.longestStreak);

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
    },
  });

  // Criar notificação de streak milestone
  try {
    await notifyStreakMilestone(userId, newStreak);
  } catch (error) {
    console.error('[CHALLENGE SERVICE] Erro ao criar notificação de streak:', error);
  }
};

/**
 * Verifica requisitos e concede badges automaticamente
 * Retorna array de novos badges conquistados
 */
export const checkAndAwardBadges = async (userId: string) => {
  // Busca todos os badges disponíveis
  const allBadges = await prisma.badge.findMany({
    where: { isActive: true },
  });

  // Busca badges já conquistados
  const earnedBadgeIds = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  });

  const earnedIds = new Set(earnedBadgeIds.map((ub) => ub.badgeId));

  // Busca dados do usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      level: true,
      currentStreak: true,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const newBadges = [];

  // Verifica cada badge não conquistado
  for (const badge of allBadges) {
    if (earnedIds.has(badge.id)) {
      continue; // Já conquistado
    }

    let shouldAward = false;

    switch (badge.requirementType) {
      case 'CHALLENGES_COMPLETED': {
        const totalCompleted = await prisma.userChallenge.count({
          where: { userId, status: 'COMPLETED' },
        });
        shouldAward = totalCompleted >= badge.requirementValue;
        break;
      }

      case 'STREAK_DAYS': {
        shouldAward = user.currentStreak >= badge.requirementValue;
        break;
      }

      case 'LEVEL_REACHED': {
        shouldAward = user.level >= badge.requirementValue;
        break;
      }

      case 'XP_EARNED': {
        shouldAward = user.xp >= badge.requirementValue;
        break;
      }

      case 'CATEGORY_MASTER': {
        // Mapa de badges para categorias
        const categoryMap: Record<string, ChallengeCategory> = {
          'Atleta': 'PHYSICAL_ACTIVITY',
          'Nutricionista': 'NUTRITION',
          'Hidratado': 'HYDRATION',
          'Mente Sã': 'MENTAL_HEALTH',
          'Dorminhoco': 'SLEEP',
          'Social': 'SOCIAL',
          'Produtivo': 'PRODUCTIVITY',
          // 'Meditador': 'MINDFULNESS',
        };

        const category = categoryMap[badge.name];
        if (category) {
          const categoryCount = await prisma.userChallenge.count({
            where: {
              userId,
              status: 'COMPLETED',
              challenge: { category },
            },
          });
          shouldAward = categoryCount >= badge.requirementValue;
        }
        break;
      }
    }

    // Se requisito atendido, concede o badge
    if (shouldAward) {
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
          earnedAt: new Date(),
        },
      });

      // Registra no histórico
      await prisma.rewardHistory.create({
        data: {
          userId,
          type: 'BADGE',
          amount: 1,
          source: 'BADGE_ACHIEVEMENT',
          sourceId: badge.id,
          description: `Conquistou badge: ${badge.name}`,
        },
      });

      // Criar notificação
      try {
        await notifyBadgeEarned(userId, badge.name, badge.rarity);
      } catch (error) {
        console.error('[CHALLENGE SERVICE] Erro ao criar notificação de badge:', error);
      }

      newBadges.push(badge);
    }
  }

  return newBadges;
};

/**
 * ============================================
 * ATUALIZA PROGRESSO DE DESAFIO COM TRACKING
 * ============================================
 *
 * Atualiza o progresso de um desafio de atividade física
 * (passos, distância) sem completá-lo.
 * Transiciona automaticamente de PENDING para IN_PROGRESS.
 *
 * @param userId          - ID do usuário
 * @param userChallengeId - ID do UserChallenge (não do Challenge)
 * @param currentValue    - Valor atual (passos em int, metros em float)
 * @param trackingData    - Dados brutos de sensor para persistência
 */
export const updateChallengeProgress = async (
  userId: string,
  userChallengeId: string,
  currentValue: number,
  trackingData?: { steps?: number; distance?: number; timestamp?: number }
) => {
  const userChallenge = await prisma.userChallenge.findUnique({
    where: { id: userChallengeId },
    include: { challenge: true },
  });

  if (!userChallenge) throw new Error('Desafio não encontrado');
  if (userChallenge.userId !== userId) throw new Error('Este desafio não pertence a você');

  // Já completado → ignorar silenciosamente
  if (userChallenge.status === 'COMPLETED') {
    return { skipped: true, reason: 'already_completed' };
  }

  const targetValue = userChallenge.challenge.targetValue ?? 0;
  // Limitar em 99 aqui; 100 só ao completar via completeChallenge
  const progressPct = targetValue > 0
    ? Math.min(Math.round((currentValue / targetValue) * 100), 99)
    : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    progress: progressPct,
    status: 'IN_PROGRESS' as const, // auto-transição de PENDING → IN_PROGRESS
  };

  const trackingType = userChallenge.challenge.trackingType;
  if (trackingType === 'STEPS') {
    updateData.steps = Math.round(currentValue);
  } else if (trackingType === 'DISTANCE') {
    updateData.distance = currentValue; // mantido em metros (igual ao targetValue)
  } else if (trackingType === 'DURATION') {
    updateData.duration = Math.round(currentValue);
  }

  if (trackingData) {
    updateData.activityData = trackingData;
  }

  await prisma.userChallenge.update({
    where: { id: userChallengeId },
    data: updateData,
  });

  console.log(
    `[CHALLENGE SERVICE] 📈 Progresso atualizado: userChallenge=${userChallengeId}, ${progressPct}% (${currentValue}/${targetValue})`
  );

  return { updated: true, progress: progressPct };
};

// ============================================

/**
 * Busca histórico de desafios completados
 */
export const getChallengeHistory = async (userId: string, limit: number = 50) => {
  const history = await prisma.userChallenge.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    include: {
      challenge: true,
    },
    orderBy: {
      completedAt: 'desc',
    },
    take: limit,
  });

  return history;
};

/**
 * Busca todos os desafios disponíveis (admin/debug)
 */
export const getAllChallenges = async () => {
  const challenges = await prisma.challenge.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { difficulty: 'asc' }],
  });

  return challenges;
};
