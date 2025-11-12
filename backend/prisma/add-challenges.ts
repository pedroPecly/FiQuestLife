/**
 * ============================================
 * ADD NEW CHALLENGES - Adiciona novos desafios SEM remover existentes
 * ============================================
 *
 * Use este script para adicionar novos desafios ao banco sem afetar os existentes.
 * Ideal para produção e desenvolvimento incremental.
 *
 * @created 31 de outubro de 2025
 */

import type {
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeFrequency,
} from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addNewChallenges() {
  console.log('➕ Adicionando novos desafios...');

  const newChallenges: Array<{
    title: string;
    description: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;
    xpReward: number;
    coinsReward: number;
    frequency: ChallengeFrequency;
  }> = [
    // ============================================
    // 🆕 SEUS NOVOS DESAFIOS AQUI
    // ============================================

    // Exemplo: Novos desafios de produtividade
    {
      title: 'Planejamento semanal',
      description: 'Dedique 30 minutos para planejar suas tarefas da semana',
      category: 'PRODUCTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'WEEKLY',
    },

    // Exemplo: Novos desafios de criatividade
    {
      title: 'Desenho livre',
      description: 'Crie um desenho ou ilustração por 20 minutos',
      category: 'PRODUCTIVITY', // Categoria ajustada após remoção de MINDFULNESS
      difficulty: 'EASY',
      xpReward: 60,
      coinsReward: 12,
      frequency: 'DAILY',
    },

    // Adicione quantos desafios quiser aqui...
    // {
    //   title: 'Seu novo desafio',
    //   description: 'Descrição detalhada',
    //   category: 'PHYSICAL_ACTIVITY',
    //   difficulty: 'EASY',
    //   xpReward: 50,
    //   coinsReward: 10,
    //   frequency: 'DAILY',
    // },
  ];

  let addedCount = 0;
  let skippedCount = 0;

  for (const challengeData of newChallenges) {
    // Verifica se desafio já existe (pelo título)
    const existing = await prisma.challenge.findFirst({
      where: { title: challengeData.title },
    });

    if (existing) {
      console.log(`⏭️  Pulando "${challengeData.title}" - já existe`);
      skippedCount++;
      continue;
    }

    // Cria novo desafio
    await prisma.challenge.create({
      data: challengeData,
    });

    console.log(`✅ Adicionado: "${challengeData.title}"`);
    addedCount++;
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   ➕ Novos desafios: ${addedCount}`);
  console.log(`   ⏭️  Já existiam: ${skippedCount}`);
  console.log(`   📈 Total no banco: ${await prisma.challenge.count()}`);
}

async function main() {
  try {
    await addNewChallenges();
    console.log('\n🎉 Concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();