/**
 * ============================================
 * ADD NEW BADGES - Adiciona novos badges SEM remover existentes
 * ============================================
 *
 * Use este script para adicionar novos badges ao banco sem afetar os existentes.
 * Ideal para produção e desenvolvimento incremental.
 *
 * @created 31 de outubro de 2025
 */

import { BadgeCategory, BadgeRarity, BadgeRequirementType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addNewBadges() {
  console.log('🏅 Adicionando novos badges...');

  const newBadges: Array<{
    name: string;
    description: string;
    imageUrl: string;
    category: BadgeCategory;
    requirementType: BadgeRequirementType;
    requirementValue: number;
    rarity: BadgeRarity;
    order: number;
  }> = [
    // ============================================
    // 🆕 SEUS NOVOS BADGES AQUI
    // ============================================

    // Exemplo: Novos badges de produtividade
    {
      name: 'Mestre da Produtividade',
      description: 'Complete 25 desafios de produtividade',
      imageUrl: '/badges/productivity-master.png',
      category: BadgeCategory.ACHIEVEMENT,
      requirementType: BadgeRequirementType.CATEGORY_MASTER,
      requirementValue: 25,
      rarity: BadgeRarity.EPIC,
      order: 20,
    },

    // Exemplo: Badge especial de temporada
    {
      name: 'Criativo Iniciante',
      description: 'Complete seu primeiro desafio de criatividade',
      imageUrl: '/badges/creative-beginner.png',
      category: BadgeCategory.BEGINNER,
      requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
      requirementValue: 1,
      rarity: BadgeRarity.COMMON,
      order: 7,
    },

    // Adicione quantos badges quiser aqui...
    // {
    //   name: 'Nome do Badge',
    //   description: 'Descrição do que conquistou',
    //   imageUrl: '/badges/nome-do-arquivo.png',
    //   category: BadgeCategory.ACHIEVEMENT,
    //   requirementType: BadgeRequirementType.CHALLENGES_COMPLETED,
    //   requirementValue: 10,
    //   rarity: BadgeRarity.COMMON,
    //   order: 1,
    // },
  ];

  let addedCount = 0;
  let skippedCount = 0;

  for (const badgeData of newBadges) {
    // Verifica se badge já existe (pelo nome)
    const existing = await prisma.badge.findFirst({
      where: { name: badgeData.name },
    });

    if (existing) {
      console.log(`⏭️  Pulando "${badgeData.name}" - já existe`);
      skippedCount++;
      continue;
    }

    // Cria novo badge
    await prisma.badge.create({
      data: badgeData,
    });

    console.log(`✅ Adicionado: "${badgeData.name}"`);
    addedCount++;
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   ➕ Novos badges: ${addedCount}`);
  console.log(`   ⏭️  Já existiam: ${skippedCount}`);
  console.log(`   📈 Total no banco: ${await prisma.badge.count()}`);
}

async function main() {
  try {
    await addNewBadges();
    console.log('\n🎉 Concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();