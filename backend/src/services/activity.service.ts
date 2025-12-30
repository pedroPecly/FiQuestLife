/**
 * ============================================
 * ACTIVITY SERVICE
 * ============================================
 * 
 * Serviço para rastreamento de atividades físicas.
 * Gerencia tracking de passos, distância e duração.
 * 
 * @created 30/12/2025
 */

import { prisma } from '../lib/prisma.js';

/**
 * Registra uma atividade física completa
 */
export const trackActivity = async (data: {
  userId: string;
  challengeId?: string;
  activityType: string;
  steps?: number;
  distance?: number;
  duration: number;
  startTime: Date;
  endTime: Date;
  routeData?: any;
}) => {
  return await prisma.activityTracking.create({
    data: {
      userId: data.userId,
      challengeId: data.challengeId,
      activityType: data.activityType,
      steps: data.steps,
      distance: data.distance,
      duration: data.duration,
      startTime: data.startTime,
      endTime: data.endTime,
      routeData: data.routeData,
    },
  });
};

/**
 * Atualiza progresso de um desafio baseado em tracking
 */
export const updateChallengeProgress = async (
  userChallengeId: string,
  steps?: number,
  distance?: number,
  duration?: number
) => {
  const userChallenge = await prisma.userChallenge.findUnique({
    where: { id: userChallengeId },
    include: { challenge: true },
  });

  if (!userChallenge) {
    throw new Error('Desafio não encontrado');
  }

  const { challenge } = userChallenge;

  // Calcular progresso baseado no tipo de tracking
  let progress = userChallenge.progress;
  let isComplete = false;

  if (challenge.trackingType === 'STEPS' && steps !== undefined) {
    progress = steps;
    isComplete = steps >= (challenge.targetValue || 0);
  } else if (challenge.trackingType === 'DISTANCE' && distance !== undefined) {
    progress = Math.round(distance);
    isComplete = distance >= (challenge.targetValue || 0);
  } else if (challenge.trackingType === 'DURATION' && duration !== undefined) {
    progress = duration;
    isComplete = duration >= (challenge.targetValue || 0);
  }

  // Atualizar desafio
  const updated = await prisma.userChallenge.update({
    where: { id: userChallengeId },
    data: {
      progress,
      steps,
      distance,
      duration,
      status: isComplete ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: isComplete ? new Date() : null,
    },
    include: { 
      challenge: true,
      user: true,
    },
  });

  return { updated, isComplete };
};

/**
 * Obtém atividades do dia do usuário
 */
export const getDailyActivity = async (userId: string, date?: Date) => {
  const targetDate = date || new Date();
  targetDate.setHours(0, 0, 0, 0);
  
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  return await prisma.activityTracking.findMany({
    where: {
      userId,
      startTime: {
        gte: targetDate,
        lt: nextDay,
      },
    },
    orderBy: { startTime: 'desc' },
  });
};

/**
 * Obtém total de passos/distância do dia
 */
export const getDailyStats = async (userId: string, date?: Date) => {
  const activities = await getDailyActivity(userId, date);

  const stats = activities.reduce(
    (acc, activity) => ({
      totalSteps: acc.totalSteps + (activity.steps || 0),
      totalDistance: acc.totalDistance + (activity.distance || 0),
      totalDuration: acc.totalDuration + activity.duration,
      activitiesCount: acc.activitiesCount + 1,
    }),
    { 
      totalSteps: 0, 
      totalDistance: 0, 
      totalDuration: 0, 
      activitiesCount: 0 
    } as {
      totalSteps: number;
      totalDistance: number;
      totalDuration: number;
      activitiesCount: number;
    }
  );

  return stats;
};

/**
 * Obtém histórico de atividades do usuário
 */
export const getActivityHistory = async (
  userId: string,
  limit: number = 30,
  offset: number = 0
) => {
  return await prisma.activityTracking.findMany({
    where: { userId },
    orderBy: { startTime: 'desc' },
    take: limit,
    skip: offset,
  });
};

/**
 * Verifica e completa desafios baseado em atividade
 * Chamado após registrar uma atividade
 */
export const checkAndCompleteActivityChallenges = async (
  userId: string,
  steps?: number,
  distance?: number,
  duration?: number
) => {
  // Buscar desafios ativos do usuário que usam tracking
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeChallenges = await prisma.userChallenge.findMany({
    where: {
      userId,
      status: {
        in: ['PENDING', 'IN_PROGRESS'],
      },
      assignedAt: { gte: today },
      challenge: {
        trackingType: {
          not: null,
        },
      },
    },
    include: { challenge: true },
  });

  const completedChallenges = [];

  // Atualizar progresso de cada desafio
  for (const userChallenge of activeChallenges) {
    const { challenge } = userChallenge;

    let shouldUpdate = false;
    let newProgress = userChallenge.progress;
    let newSteps = userChallenge.steps || 0;
    let newDistance = userChallenge.distance || 0;
    let newDuration = userChallenge.duration || 0;

    // Acumular valores baseado no tipo de tracking
    if (challenge.trackingType === 'STEPS' && steps !== undefined) {
      newSteps += steps;
      newProgress = newSteps;
      shouldUpdate = true;
    }

    if (challenge.trackingType === 'DISTANCE' && distance !== undefined) {
      newDistance += distance;
      newProgress = Math.round(newDistance);
      shouldUpdate = true;
    }

    if (challenge.trackingType === 'DURATION' && duration !== undefined) {
      newDuration += duration;
      newProgress = newDuration;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      const isComplete = newProgress >= (challenge.targetValue || 0);

      const updated = await prisma.userChallenge.update({
        where: { id: userChallenge.id },
        data: {
          progress: newProgress,
          steps: newSteps,
          distance: newDistance,
          duration: newDuration,
          status: isComplete ? 'COMPLETED' : 'IN_PROGRESS',
          completedAt: isComplete ? new Date() : null,
        },
        include: { challenge: true, user: true },
      });

      if (isComplete) {
        completedChallenges.push(updated);
      }
    }
  }

  return completedChallenges;
};
