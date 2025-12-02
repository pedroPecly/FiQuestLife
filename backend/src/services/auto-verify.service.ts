/**
 * ============================================
 * AUTO-CHALLENGE VERIFICATION SERVICE
 * ============================================
 * 
 * Serviço para verificação automática de desafios sociais
 * Completa desafios automaticamente quando eventos específicos ocorrem
 * 
 * @created 1 de dezembro de 2025
 */

import { prisma } from '../lib/prisma.js';

/**
 * Verifica e completa automaticamente desafios do usuário
 * baseado em um evento específico
 */
export const verifyAndCompleteChallenge = async (
  userId: string,
  eventName: string
): Promise<void> => {
  try {
    // Validação de entrada
    if (!userId || typeof userId !== 'string') {
      console.error('[AUTO-VERIFY] userId inválido:', userId);
      return;
    }

    if (!eventName || typeof eventName !== 'string') {
      console.error('[AUTO-VERIFY] eventName inválido:', eventName);
      return;
    }

    console.log(`[AUTO-VERIFY] Verificando desafios para evento: ${eventName}, usuário: ${userId}`);

    // Busca desafios auto-verificáveis com esse evento
    const autoVerifiableChallenges = await prisma.challenge.findMany({
      where: {
        autoVerifiable: true,
        verificationEvent: eventName,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        xpReward: true,
        coinsReward: true,
      },
    });

    if (autoVerifiableChallenges.length === 0) {
      console.log(`[AUTO-VERIFY] Nenhum desafio encontrado para evento: ${eventName}`);
      return;
    }

    console.log(`[AUTO-VERIFY] Encontrados ${autoVerifiableChallenges.length} desafios auto-verificáveis`);

    // Para cada desafio, verifica se o usuário tem ele pendente hoje
    for (const challenge of autoVerifiableChallenges) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Busca UserChallenge pendente do usuário para esse desafio
      const userChallenge = await prisma.userChallenge.findFirst({
        where: {
          userId,
          challengeId: challenge.id,
          status: 'PENDING',
          assignedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (userChallenge) {
        // Usa transação para evitar race conditions
        await prisma.$transaction(async (tx) => {
          // Completa o desafio automaticamente
          await tx.userChallenge.update({
            where: { id: userChallenge.id },
            data: {
              status: 'COMPLETED',
              completedAt: new Date(),
              progress: 100,
            },
          });

          // Atualiza XP e moedas do usuário
          await tx.user.update({
            where: { id: userId },
            data: {
              xp: { increment: challenge.xpReward },
              coins: { increment: challenge.coinsReward },
            },
          });

          // Registra no histórico de recompensas
          if (challenge.xpReward > 0) {
            await tx.rewardHistory.create({
              data: {
                userId,
                type: 'XP',
                amount: challenge.xpReward,
                source: 'CHALLENGE_COMPLETION',
                sourceId: userChallenge.id, // ID do UserChallenge, não do Challenge
                description: `Desafio "${challenge.title}" completado automaticamente`,
              },
            });
          }

          if (challenge.coinsReward > 0) {
            await tx.rewardHistory.create({
              data: {
                userId,
                type: 'COINS',
                amount: challenge.coinsReward,
                source: 'CHALLENGE_COMPLETION',
                sourceId: userChallenge.id, // ID do UserChallenge, não do Challenge
                description: `Desafio "${challenge.title}" completado automaticamente`,
              },
            });
          }
        });

        console.log(`[AUTO-VERIFY] ✅ Desafio "${challenge.title}" completado automaticamente!`);
        console.log(`[AUTO-VERIFY] +${challenge.xpReward} XP, +${challenge.coinsReward} moedas`);
      }
    }
  } catch (error) {
    console.error('[AUTO-VERIFY] Erro ao verificar desafios:', error);
  }
};

/**
 * Verifica e desbloqueia badges baseadas em contadores de eventos
 */
export const checkAndAwardBadges = async (
  userId: string,
  eventName: string
): Promise<void> => {
  try {
    // Validação de entrada
    if (!userId || typeof userId !== 'string') {
      console.error('[BADGE-CHECK] userId inválido:', userId);
      return;
    }

    if (!eventName || typeof eventName !== 'string') {
      console.error('[BADGE-CHECK] eventName inválido:', eventName);
      return;
    }

    console.log(`[BADGE-CHECK] Verificando badges para evento: ${eventName}, usuário: ${userId}`);

    // Busca badges relacionadas a este evento
    const eligibleBadges = await prisma.badge.findMany({
      where: {
        event: eventName,
        isActive: true,
      },
      orderBy: {
        requiredCount: 'asc', // Ordem crescente para verificar do menor pro maior
      },
    });

    if (eligibleBadges.length === 0) {
      console.log(`[BADGE-CHECK] Nenhuma badge encontrada para evento: ${eventName}`);
      return;
    }

    console.log(`[BADGE-CHECK] Encontradas ${eligibleBadges.length} badges elegíveis`);

    // Conta quantas vezes o evento já ocorreu (baseado no tipo de evento)
    let eventCount = 0;

    switch (eventName) {
      case 'CHALLENGE_INVITE_SENT':
        eventCount = await prisma.challengeInvitation.count({
          where: { fromUserId: userId },
        });
        break;

      case 'CHALLENGE_INVITE_ACCEPTED':
        eventCount = await prisma.challengeInvitation.count({
          where: {
            toUserId: userId,
            status: 'ACCEPTED',
          },
        });
        break;

      case 'POST_LIKED':
        eventCount = await prisma.activityLike.count({
          where: { userId },
        });
        break;

      case 'POST_COMMENTED':
        eventCount = await prisma.activityComment.count({
          where: { userId },
        });
        break;

      case 'FRIENDSHIP_CREATED':
        const friendshipsInitiated = await prisma.friendship.count({
          where: { userId },
        });
        const friendshipsReceived = await prisma.friendship.count({
          where: { friendId: userId },
        });
        eventCount = friendshipsInitiated + friendshipsReceived;
        break;

      case 'BADGE_EARNED':
        eventCount = await prisma.userBadge.count({
          where: { userId },
        });
        break;

      case 'DAILY_CHALLENGES_COMPLETED':
        // Verifica se completou pelo menos 3 desafios hoje
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const completedToday = await prisma.userChallenge.count({
          where: {
            userId,
            status: 'COMPLETED',
            completedAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });

        eventCount = completedToday >= 3 ? completedToday : 0;
        break;

      default:
        console.log(`[BADGE-CHECK] Evento não reconhecido: ${eventName}`);
        return;
    }

    console.log(`[BADGE-CHECK] Contagem do evento "${eventName}": ${eventCount}`);

    // Verifica quais badges o usuário já tem
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });

    const userBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

    // Para cada badge, verifica se o usuário atingiu o requisito
    for (const badge of eligibleBadges) {
      // Pula se já tem a badge
      if (userBadgeIds.has(badge.id)) {
        continue;
      }

      // Verifica se atingiu o requisito
      if (eventCount >= (badge.requiredCount || 0)) {
        try {
          // Operação crítica: apenas badge + update de user (RÁPIDA)
          await prisma.$transaction(async (tx) => {
            // Double-check: evita race condition
            const exists = await tx.userBadge.findUnique({
              where: {
                userId_badgeId: { userId, badgeId: badge.id },
              },
            });

            if (exists) {
              console.log(`[BADGE-CHECK] Badge já existe (race condition evitada): ${badge.name}`);
              return;
            }

            // 1. Concede a badge
            await tx.userBadge.create({
              data: { userId, badgeId: badge.id },
            });

            // 2. Atualiza XP e moedas (incremento atômico)
            if (badge.xpReward > 0 || badge.coinsReward > 0) {
              await tx.user.update({
                where: { id: userId },
                data: {
                  xp: { increment: badge.xpReward },
                  coins: { increment: badge.coinsReward },
                },
              });
            }
          });

          // Registros de auditoria FORA da transação (não-críticos)
          // Se falharem, não afetam a concessão da badge
          try {
            await prisma.rewardHistory.create({
              data: {
                userId,
                type: 'BADGE',
                amount: 1,
                source: 'BADGE_EARNED',
                sourceId: badge.id,
                description: `Badge "${badge.name}" desbloqueada`,
              },
            });

            if (badge.xpReward > 0) {
              await prisma.rewardHistory.create({
                data: {
                  userId,
                  type: 'XP',
                  amount: badge.xpReward,
                  source: 'BADGE_EARNED',
                  sourceId: badge.id,
                  description: `Recompensa por badge "${badge.name}"`,
                },
              });
            }

            if (badge.coinsReward > 0) {
              await prisma.rewardHistory.create({
                data: {
                  userId,
                  type: 'COINS',
                  amount: badge.coinsReward,
                  source: 'BADGE_EARNED',
                  sourceId: badge.id,
                  description: `Recompensa por badge "${badge.name}"`,
                },
              });
            }
          } catch (auditError: any) {
            // Auditoria falhou mas badge foi concedida - apenas loga
            console.error(`[BADGE-CHECK] Erro na auditoria (badge concedida):`, auditError.message);
          }

          console.log(`[BADGE-CHECK] 🏆 Badge "${badge.name}" desbloqueada!`);
          console.log(`[BADGE-CHECK] +${badge.xpReward} XP, +${badge.coinsReward} moedas`);

          // Dispara evento recursivo para badges de badges (assíncrono, não bloqueia)
          if (eventName !== 'BADGE_EARNED') {
            // Fire-and-forget: não aguarda para não aumentar latência
            checkAndAwardBadges(userId, 'BADGE_EARNED').catch((err) =>
              console.error('[BADGE-CHECK] Erro no evento recursivo:', err.message)
            );
          }
        } catch (error: any) {
          // Falha crítica na concessão da badge
          console.error(`[BADGE-CHECK] Erro ao conceder badge "${badge.name}":`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('[BADGE-CHECK] Erro ao verificar badges:', error);
  }
};

/**
 * Função helper que combina verificação de desafios e badges
 */
export const handleSocialEvent = async (
  userId: string,
  eventName: string
): Promise<void> => {
  await Promise.all([
    verifyAndCompleteChallenge(userId, eventName),
    checkAndAwardBadges(userId, eventName),
  ]);
};
