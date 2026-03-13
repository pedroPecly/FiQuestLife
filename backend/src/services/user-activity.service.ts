/**
 * ============================================
 * USER ACTIVITY SERVICE
 * ============================================
 * 
 * Busca atividades do próprio usuário
 */

import { prisma } from '../lib/prisma.js';

// Constantes
const ACTIVITY_TIME_WINDOW_DAYS = 30;
const VALID_ACTIVITY_SOURCES = [
  'CHALLENGE_COMPLETION',
  'BADGE_ACHIEVEMENT',
  'LEVEL_PROGRESSION',
];

/**
 * Retorna atividades do próprio usuário (Aba "Meus Posts")
 * 
 * @param userId - ID do usuário
 * @param limit - Número máximo de atividades a retornar (padrão: 20)
 * @param offset - Número de atividades a pular para paginação (padrão: 0)
 * @returns Array de atividades formatadas para o feed
 */
export async function getUserOwnActivity(userId: string, limit: number = 20, offset: number = 0) {
  try {
    console.log('[USER ACTIVITY SERVICE] Iniciando busca - userId:', userId);

    // Buscar atividades do reward_history
    const allActivities = await prisma.rewardHistory.findMany({
      where: {
        userId,
        source: {
          in: VALID_ACTIVITY_SOURCES,
        },
        createdAt: {
          gte: new Date(Date.now() - ACTIVITY_TIME_WINDOW_DAYS * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            level: true,
            currentStreak: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('[USER ACTIVITY SERVICE] Atividades brutas encontradas:', allActivities.length);

    // Buscar UserChallenges para atividades de CHALLENGE_COMPLETION
    const challengeCompletionIds = allActivities
      .filter(a => a.source === 'CHALLENGE_COMPLETION' && a.sourceId)
      .map(a => a.sourceId as string);

    console.log('[USER ACTIVITY SERVICE] 🔍 IDs de desafios para buscar:', challengeCompletionIds.length);

    const userChallenges = challengeCompletionIds.length > 0
      ? await prisma.userChallenge.findMany({
        where: {
          id: { in: challengeCompletionIds },
        },
        select: {
          id: true,
          photoUrl: true,
          caption: true,
          challenge: {
            select: {
              category: true,
            },
          },
        },
      })
      : [];

    console.log('[USER ACTIVITY SERVICE] 📦 UserChallenges encontrados:', userChallenges.length);
    console.log('[USER ACTIVITY SERVICE] 📸 UserChallenges com foto:', userChallenges.filter(uc => uc.photoUrl).length);

    // Buscar convites de desafios para as atividades de CHALLENGE_COMPLETION
    const invitations = challengeCompletionIds.length > 0
      ? await prisma.challengeInvitation.findMany({
        where: {
          userChallengeId: { in: challengeCompletionIds },
          status: 'ACCEPTED',
        },
        select: {
          userChallengeId: true,
          fromUser: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      })
      : [];

    console.log('[USER ACTIVITY SERVICE] 🎯 Convites encontrados:', invitations.length);

    // Criar mapa de convites para acesso rápido
    const invitationMap = new Map(
      invitations.map(inv => [inv.userChallengeId, inv])
    );

    // Criar mapa de UserChallenges para acesso rápido
    const userChallengeMap = new Map(
      userChallenges.map(uc => [uc.id, uc])
    );

    // Tipo para a atividade agrupada
    interface GroupedActivity {
      id: string;
      source: string;
      sourceId: string | null;
      userId: string;
      username: string;
      name: string;
      avatarUrl: string | null;
      level: number;
      currentStreak: number;
      description: string | null;
      createdAt: Date;
      xpAmount: number;
      coinsAmount: number;
      photoUrl: string | null;
      caption: string | null;
      category: string | null;
    }

    // Agrupar por sourceId (unificar XP + Moedas de uma mesma tarefa)
    const groupedMap = new Map<string, GroupedActivity>();

    for (const activity of allActivities) {
      const key = activity.sourceId || activity.id;
      const userChallenge = activity.sourceId ? userChallengeMap.get(activity.sourceId) : null;

      if (!groupedMap.has(key)) {
        // Primeira entrada para esta atividade
        groupedMap.set(key, {
          id: activity.id,
          source: activity.source,
          sourceId: activity.sourceId,
          userId: activity.user.id,
          username: activity.user.username,
          name: activity.user.name,
          avatarUrl: activity.user.avatarUrl,
          level: activity.user.level,
          currentStreak: activity.user.currentStreak,
          description: activity.description,
          createdAt: activity.createdAt,
          xpAmount: activity.type === 'XP' ? activity.amount : 0,
          coinsAmount: activity.type === 'COINS' ? activity.amount : 0,
          // Dados do desafio (se houver)
          photoUrl: userChallenge?.photoUrl || null,
          caption: userChallenge?.caption || null,
          category: userChallenge?.challenge?.category || null,
        });
      } else {
        // Somar XP ou Moedas à entrada existente
        const existing = groupedMap.get(key)!;
        if (activity.type === 'XP') {
          existing.xpAmount += activity.amount;
        } else if (activity.type === 'COINS') {
          existing.coinsAmount += activity.amount;
        }
        // Preservar photoUrl e caption se ainda não estiverem definidos
        if (!existing.photoUrl && userChallenge?.photoUrl) {
          existing.photoUrl = userChallenge.photoUrl;
        }
        if (!existing.caption && userChallenge?.caption) {
          existing.caption = userChallenge.caption;
        }
        if (!existing.category && userChallenge?.challenge?.category) {
          existing.category = userChallenge.challenge.category;
        }
      }
    }

    // Converter Map para array e ordenar por data
    const groupedActivities = Array.from(groupedMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    console.log('[USER ACTIVITY SERVICE] Query executada com sucesso. Atividades:', groupedActivities.length);

    // Mapear para formato do feed
    const mappedActivities = groupedActivities.map((activity) => {
      let type = '';
      let metadata = '';

      switch (activity.source) {
        case 'CHALLENGE_COMPLETION':
          type = 'CHALLENGE_COMPLETED';
          metadata = activity.category || '';
          break;
        case 'BADGE_ACHIEVEMENT':
          type = 'BADGE_EARNED';
          metadata = '';
          break;
        case 'LEVEL_PROGRESSION':
          type = 'LEVEL_UP';
          metadata = String(activity.level);
          break;
        default:
          if (activity.source.includes('streak')) {
            type = 'STREAK_MILESTONE';
            metadata = String(activity.currentStreak);
          }
      }

      const result = {
        id: activity.id,
        type,
        userId: activity.userId,
        username: activity.username,
        name: activity.name,
        avatarUrl: activity.avatarUrl,
        description: activity.description,
        metadata,
        photoUrl: activity.photoUrl,
        caption: activity.caption,
        createdAt: activity.createdAt.toISOString(),
        xpReward: activity.xpAmount, // XP total (somado)
        coinsReward: activity.coinsAmount, // Moedas total (somado)
        invitedBy: null as any,
      };

      // Adicionar informação de convite se existir
      if (activity.source === 'CHALLENGE_COMPLETION' && activity.sourceId) {
        const invitation = invitationMap.get(activity.sourceId);
        if (invitation?.fromUser) {
          result.invitedBy = {
            id: invitation.fromUser.id,
            name: invitation.fromUser.name,
            username: invitation.fromUser.username,
            avatarUrl: invitation.fromUser.avatarUrl,
          };
        }
      }

      // Log detalhado para debug
      if (activity.photoUrl) {
        console.log('[USER ACTIVITY SERVICE] 📸 Atividade COM FOTO:', {
          id: result.id,
          photoUrl: result.photoUrl?.substring(0, 50),
          caption: result.caption,
        });
      }

      return result;
    });

    return mappedActivities;
  } catch (error) {
    console.error('[USER ACTIVITY SERVICE] Erro na função getUserOwnActivity:', error);
    throw error;
  }
}
