/**
 * ============================================
 * SEED DE BADGES - POPULAÇÃO INICIAL DO BANCO
 * ============================================
 * 
 * Popula o banco de dados com badges iniciais organizados por categoria:
 * - BEGINNER: Badges para iniciantes (1, 5, 10, 25, 50 desafios)
 * - CONSISTENCY: Badges de streak (3, 7, 14, 30, 100 dias)
 * - MILESTONE: Badges de nível (5, 10, 20, 50)
 * - ACHIEVEMENT: Badges de categorias específicas
 * 
 * @created 17 de outubro de 2025
 */

import { BadgeCategory, BadgeRarity, BadgeRequirementType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de badges...\n');

  // ==========================================
  // LIMPEZA (Use com cuidado em produção!)
  // ==========================================
  console.log('🧹 Limpando badges existentes...');
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  console.log('✅ Limpeza concluída!\n');

  // ==========================================
  // BADGES DE BEGINNER (Progresso Inicial)
  // ==========================================
  console.log('🌱 Criando badges de BEGINNER...');
  await prisma.badge.createMany({
    data: [
      {
        name: 'Primeiro Passo',
        description: 'Complete seu primeiro desafio!',
        imageUrl: '/badges/first-step.png',
        category: BadgeCategory.BEGINNER,
        requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
        requirementValue: 1,
        rarity: BadgeRarity.COMMON,
        order: 1,
      },
      {
        name: 'Aprendiz',
        description: 'Complete 5 desafios',
        imageUrl: '/badges/apprentice.png',
        category: BadgeCategory.BEGINNER,
        requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
        requirementValue: 5,
        rarity: BadgeRarity.COMMON,
        order: 2,
      },
      {
        name: 'Aventureiro',
        description: 'Complete 10 desafios',
        imageUrl: '/badges/adventurer.png',
        category: BadgeCategory.BEGINNER,
        requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
        requirementValue: 10,
        rarity: BadgeRarity.COMMON,
        order: 3,
      },
      {
        name: 'Veterano',
        description: 'Complete 25 desafios',
        imageUrl: '/badges/veteran.png',
        category: BadgeCategory.BEGINNER,
        requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
        requirementValue: 25,
        rarity: BadgeRarity.RARE,
        order: 4,
      },
      {
        name: 'Mestre dos Desafios',
        description: 'Complete 50 desafios!',
        imageUrl: '/badges/challenge-master.png',
        category: BadgeCategory.BEGINNER,
        requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
        requirementValue: 50,
        rarity: BadgeRarity.EPIC,
        order: 5,
      },
      {
        name: 'Centurião',
        description: 'Complete 100 desafios! Impressionante!',
        imageUrl: '/badges/centurion.png',
        category: BadgeCategory.BEGINNER,
        requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
        requirementValue: 100,
        rarity: BadgeRarity.LEGENDARY,
        order: 6,
      },
    ],
  });
  console.log('✅ 6 badges de BEGINNER criados!\n');

  // ==========================================
  // BADGES DE CONSISTENCY (Streaks)
  // ==========================================
  console.log('🔥 Criando badges de CONSISTENCY...');
  await prisma.badge.createMany({
    data: [
      {
        name: 'Persistente',
        description: 'Mantenha um streak de 3 dias',
        imageUrl: '/badges/persistent.png',
        category: BadgeCategory.CONSISTENCY,
        requirementType: BadgeRequirementType.STREAK_DAYS,
        requirementValue: 3,
        rarity: BadgeRarity.COMMON,
        order: 10,
      },
      {
        name: 'Dedicado',
        description: 'Streak de 7 dias consecutivos!',
        imageUrl: '/badges/dedicated.png',
        category: BadgeCategory.CONSISTENCY,
        requirementType: BadgeRequirementType.STREAK_DAYS,
        requirementValue: 7,
        rarity: BadgeRarity.RARE,
        order: 11,
      },
      {
        name: 'Comprometido',
        description: 'Streak de 14 dias!',
        imageUrl: '/badges/committed.png',
        category: BadgeCategory.CONSISTENCY,
        requirementType: BadgeRequirementType.STREAK_DAYS,
        requirementValue: 14,
        rarity: BadgeRarity.RARE,
        order: 12,
      },
      {
        name: 'Inabalável',
        description: 'Streak de 30 dias! Incrível!',
        imageUrl: '/badges/unshakeable.png',
        category: BadgeCategory.CONSISTENCY,
        requirementType: BadgeRequirementType.STREAK_DAYS,
        requirementValue: 30,
        rarity: BadgeRarity.EPIC,
        order: 13,
      },
      {
        name: 'Guerreiro do Ano',
        description: 'Streak de 365 dias! Você é uma lenda viva!',
        imageUrl: '/badges/year-warrior.png',
        category: BadgeCategory.CONSISTENCY,
        requirementType: BadgeRequirementType.STREAK_DAYS,
        requirementValue: 365,
        rarity: BadgeRarity.LEGENDARY,
        order: 14,
      },
    ],
  });
  console.log('✅ 5 badges de CONSISTENCY criados!\n');

  // ==========================================
  // BADGES DE MILESTONE (Níveis)
  // ==========================================
  console.log('🎯 Criando badges de MILESTONE...');
  await prisma.badge.createMany({
    data: [
      {
        name: 'Nível 5',
        description: 'Alcance o nível 5',
        imageUrl: '/badges/level-5.png',
        category: BadgeCategory.MILESTONE,
        requirementType: BadgeRequirementType.LEVEL_REACHED,
        requirementValue: 5,
        rarity: BadgeRarity.RARE,
        order: 20,
      },
      {
        name: 'Nível 10',
        description: 'Alcance o nível 10',
        imageUrl: '/badges/level-10.png',
        category: BadgeCategory.MILESTONE,
        requirementType: BadgeRequirementType.LEVEL_REACHED,
        requirementValue: 10,
        rarity: BadgeRarity.RARE,
        order: 21,
      },
      {
        name: 'Nível 20',
        description: 'Alcance o nível 20!',
        imageUrl: '/badges/level-20.png',
        category: BadgeCategory.MILESTONE,
        requirementType: BadgeRequirementType.LEVEL_REACHED,
        requirementValue: 20,
        rarity: BadgeRarity.EPIC,
        order: 22,
      },
      {
        name: 'Nível 50',
        description: 'Nível 50! Você é incrível!',
        imageUrl: '/badges/level-50.png',
        category: BadgeCategory.MILESTONE,
        requirementType: BadgeRequirementType.LEVEL_REACHED,
        requirementValue: 50,
        rarity: BadgeRarity.EPIC,
        order: 23,
      },
      {
        name: 'Nível 100',
        description: 'Nível 100! O poder máximo!',
        imageUrl: '/badges/level-100.png',
        category: BadgeCategory.MILESTONE,
        requirementType: BadgeRequirementType.LEVEL_REACHED,
        requirementValue: 100,
        rarity: BadgeRarity.LEGENDARY,
        order: 24,
      },
    ],
  });
  console.log('✅ 5 badges de MILESTONE criados!\n');

  // ==========================================
  // BADGES DE ACHIEVEMENT (XP Total)
  // ==========================================
  console.log('💎 Criando badges de ACHIEVEMENT (XP)...');
  await prisma.badge.createMany({
    data: [
      {
        name: 'Colecionador de XP',
        description: 'Ganhe 1.000 XP no total',
        imageUrl: '/badges/xp-collector.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.XP_EARNED,
        requirementValue: 1000,
        rarity: BadgeRarity.RARE,
        order: 30,
      },
      {
        name: 'Mestre do XP',
        description: 'Ganhe 5.000 XP no total',
        imageUrl: '/badges/xp-master.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.XP_EARNED,
        requirementValue: 5000,
        rarity: BadgeRarity.EPIC,
        order: 31,
      },
      {
        name: 'Lenda do XP',
        description: 'Ganhe 10.000 XP no total!',
        imageUrl: '/badges/xp-legend.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.XP_EARNED,
        requirementValue: 10000,
        rarity: BadgeRarity.LEGENDARY,
        order: 32,
      },
    ],
  });
  console.log('✅ 3 badges de ACHIEVEMENT (XP) criados!\n');

  // ==========================================
  // BADGES DE ACHIEVEMENT (Categorias)
  // ==========================================
  console.log('🏆 Criando badges de ACHIEVEMENT (Categorias)...');
  await prisma.badge.createMany({
    data: [
      {
        name: 'Atleta',
        description: 'Complete 20 desafios de atividade física',
        imageUrl: '/badges/athlete.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.CATEGORY_MASTER,
        requirementValue: 20, // PHYSICAL_ACTIVITY
        rarity: BadgeRarity.RARE,
        order: 40,
      },
      {
        name: 'Nutricionista',
        description: 'Complete 15 desafios de nutrição',
        imageUrl: '/badges/nutritionist.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.CATEGORY_MASTER,
        requirementValue: 15, // NUTRITION
        rarity: BadgeRarity.RARE,
        order: 41,
      },
      {
        name: 'Hidratado',
        description: 'Complete 20 desafios de hidratação',
        imageUrl: '/badges/hydrated.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.CATEGORY_MASTER,
        requirementValue: 20, // HYDRATION
        rarity: BadgeRarity.RARE,
        order: 42,
      },
      {
        name: 'Mente Sã',
        description: 'Complete 15 desafios de saúde mental',
        imageUrl: '/badges/mental-health.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.CATEGORY_MASTER,
        requirementValue: 15, // MENTAL_HEALTH
        rarity: BadgeRarity.RARE,
        order: 43,
      },
      {
        name: 'Dorminhoco',
        description: 'Complete 15 desafios de sono',
        imageUrl: '/badges/sleeper.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.CATEGORY_MASTER,
        requirementValue: 15, // SLEEP
        rarity: BadgeRarity.RARE,
        order: 44,
      },
      {
        name: 'Social',
        description: 'Complete 10 desafios sociais',
        imageUrl: '/badges/social.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.CATEGORY_MASTER,
        requirementValue: 10, // SOCIAL
        rarity: BadgeRarity.RARE,
        order: 45,
      },
      {
        name: 'Produtivo',
        description: 'Complete 15 desafios de produtividade',
        imageUrl: '/badges/productive.png',
        category: BadgeCategory.ACHIEVEMENT,
        requirementType: BadgeRequirementType.CATEGORY_MASTER,
        requirementValue: 15, // PRODUCTIVITY
        rarity: BadgeRarity.RARE,
        order: 46,
      },
  // Badge Meditador removido: relacionado à Mindfulness
    ],
  });
  console.log('✅ 8 badges de ACHIEVEMENT (Categorias) criados!\n');

  // ==========================================
  // BADGES ESPECIAIS
  // ==========================================
  console.log('⭐ Criando badges ESPECIAIS...');
  await prisma.badge.createMany({
    data: [
      {
        name: 'Early Adopter',
        description: 'Um dos primeiros usuários do FiQuestLife!',
        imageUrl: '/badges/early-adopter.png',
        category: BadgeCategory.SPECIAL,
        requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
        requirementValue: 1,
        rarity: BadgeRarity.LEGENDARY,
        order: 100,
      },
      {
        name: 'Beta Tester',
        description: 'Ajudou a testar o app na versão beta',
        imageUrl: '/badges/beta-tester.png',
        category: BadgeCategory.SPECIAL,
        requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
        requirementValue: 1,
        rarity: BadgeRarity.LEGENDARY,
        order: 101,
      },
    ],
  });
  console.log('✅ 2 badges ESPECIAIS criados!\n');

  // ==========================================
  // RESUMO FINAL
  // ==========================================
  const totalBadges = await prisma.badge.count();
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ SEED CONCLUÍDO COM SUCESSO!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Total de badges criados: ${totalBadges}`);
  console.log('');
  console.log('Distribuição por categoria:');
  console.log('  🌱 BEGINNER: 6 badges');
  console.log('  🔥 CONSISTENCY: 5 badges');
  console.log('  🎯 MILESTONE: 5 badges');
  console.log('  🏆 ACHIEVEMENT: 11 badges');
  console.log('  ⭐ SPECIAL: 2 badges');
  console.log('');
  console.log('Distribuição por raridade:');
  console.log('  ⚪ COMMON: 8 badges');
  console.log('  🔵 RARE: 13 badges');
  console.log('  🟣 EPIC: 5 badges');
  console.log('  🟠 LEGENDARY: 3 badges');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
