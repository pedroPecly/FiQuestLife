/**
 * ============================================
 * USER ACTIVITY SERVICE
 * ============================================
 * 
 * Busca atividades do próprio usuário
 */

import { prisma } from '../lib/prisma.js';

/**
 * Retorna atividades do próprio usuário (Aba "Meus Posts")
 * Versão profissional usando Prisma e reward_history como fonte única
 */
export async function getUserOwnActivity(userId: string, limit: number = 20, offset: number = 0) {
  try {
    console.log('[USER ACTIVITY SERVICE] Iniciando busca - userId:', userId);

    // Buscar atividades do reward_history
    const allActivities = await prisma.rewardHistory.findMany({
      where: {
        userId,
        source: {
          in: [
            'CHALLENGE_COMPLETION',
            'BADGE_ACHIEVEMENT',
            'LEVEL_PROGRESSION',
          ],
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
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

    // Agrupar por sourceId (unificar XP + Moedas de uma mesma tarefa)
    const groupedMap = new Map<string, any>();
    
    for (const activity of allActivities) {
      const key = activity.sourceId || activity.id;
      
      if (!groupedMap.has(key)) {
        // Primeira entrada para esta atividade
        groupedMap.set(key, {
          id: activity.id, // Usar primeiro ID encontrado
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
        });
      } else {
        // Somar XP ou Moedas à entrada existente
        const existing = groupedMap.get(key);
        if (activity.type === 'XP') {
          existing.xpAmount += activity.amount;
        } else if (activity.type === 'COINS') {
          existing.coinsAmount += activity.amount;
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
          metadata = '';
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

      return {
        id: activity.id,
        type,
        userId: activity.userId,
        username: activity.username,
        name: activity.name,
        avatarUrl: activity.avatarUrl,
        description: activity.description,
        metadata,
        createdAt: activity.createdAt.toISOString(),
        xpReward: activity.xpAmount, // XP total (somado)
        coinsReward: activity.coinsAmount, // Moedas total (somado)
      };
    });

    return mappedActivities;
  } catch (error) {
    console.error('[USER ACTIVITY SERVICE] Erro na função getUserOwnActivity:', error);
    throw error;
  }
}
