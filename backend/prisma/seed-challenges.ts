/**
 * ============================================
 * SEED DE DESAFIOS - 58 Desafios
 * ============================================
 * 
 * Popula o banco com desafios variados em 8 categorias:
 * - PHYSICAL_ACTIVITY (Atividade Física) - 11 desafios
 * - NUTRITION (Nutrição) - 9 desafios
 * - HYDRATION (Hidratação) - 5 desafios
 * - MENTAL_HEALTH (Saúde Mental) - 4 desafios
 * - SLEEP (Sono) - 5 desafios
 * - SOCIAL (Social) - 5 desafios
 * - PRODUCTIVITY (Produtividade) - 8 desafios
 * - MINDFULNESS (Mindfulness) - 4 desafios
 * 
 * @created 20 de outubro de 2025
 * @updated 2 de novembro de 2025
 */

import type {
    ChallengeCategory,
    ChallengeDifficulty,
    ChallengeFrequency,
} from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedChallenges() {
  console.log('🌱 Iniciando seed de desafios...');

  // Limpa desafios existentes (cuidado em produção!)
  await prisma.challenge.deleteMany({});
  console.log('🗑️  Desafios anteriores removidos');

  const challenges: Array<{
    title: string;
    description: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;
    xpReward: number;
    coinsReward: number;
    frequency: ChallengeFrequency;
  }> = [
    // ============================================
    // 💪 PHYSICAL_ACTIVITY (11 desafios)
    // ============================================
    {
      title: 'Caminhada de 30 minutos',
      description: 'Faça uma caminhada ao ar livre por pelo menos 30 minutos',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'EASY',
      xpReward: 50,
      coinsReward: 10,
      frequency: 'DAILY',
    },
    {
      title: '10.000 passos',
      description: 'Complete 10.000 passos no dia',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'DAILY',
    },
    {
      title: 'Treino de força',
      description: 'Faça 30 minutos de treino de força ou musculação',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 120,
      coinsReward: 25,
      frequency: 'DAILY',
    },
    {
      title: 'Corrida de 5km',
      description: 'Complete uma corrida de 5 quilômetros',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'HARD',
      xpReward: 150,
      coinsReward: 30,
      frequency: 'DAILY',
    },
    {
      title: 'Alongamento matinal',
      description: 'Faça 10 minutos de alongamento ao acordar',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'EASY',
      xpReward: 40,
      coinsReward: 8,
      frequency: 'DAILY',
    },
    {
      title: 'Yoga ou Pilates',
      description: 'Pratique 30 minutos de yoga ou pilates',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'DAILY',
    },
    {
      title: 'Subir escadas',
      description: 'Use as escadas ao invés do elevador hoje',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'EASY',
      xpReward: 30,
      coinsReward: 6,
      frequency: 'DAILY',
    },
    {
      title: 'Aula de dança',
      description: 'Participe de uma aula de dança ou dance por 30 minutos',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'DAILY',
    },
    {
      title: 'Ciclismo 30 minutos',
      description: 'Ande de bicicleta por pelo menos 30 minutos',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'DAILY',
    },
    {
      title: 'Natação',
      description: 'Nade por 30 minutos na piscina',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 120,
      coinsReward: 24,
      frequency: 'DAILY',
    },
    {
      title: 'Exercícios funcionais',
      description: 'Faça 20 minutos de exercícios funcionais (burpees, agachamentos, etc)',
      category: 'PHYSICAL_ACTIVITY',
      difficulty: 'HARD',
      xpReward: 130,
      coinsReward: 26,
      frequency: 'DAILY',
    },

    // ============================================
    // 🥗 NUTRITION (9 desafios)
    // ============================================
    {
      title: 'Comer 5 porções de frutas/vegetais',
      description: 'Consuma pelo menos 5 porções de frutas ou vegetais hoje',
      category: 'NUTRITION',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'DAILY',
    },
    {
      title: 'Café da manhã saudável',
      description: 'Tome um café da manhã balanceado e nutritivo',
      category: 'NUTRITION',
      difficulty: 'EASY',
      xpReward: 50,
      coinsReward: 10,
      frequency: 'DAILY',
    },
    {
      title: 'Zero açúcar refinado',
      description: 'Evite açúcar refinado por todo o dia',
      category: 'NUTRITION',
      difficulty: 'HARD',
      xpReward: 150,
      coinsReward: 30,
      frequency: 'DAILY',
    },
    {
      title: 'Preparar refeição caseira',
      description: 'Prepare pelo menos uma refeição caseira saudável',
      category: 'NUTRITION',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'DAILY',
    },
    {
      title: 'Proteína em cada refeição',
      description: 'Inclua proteína de qualidade em todas as refeições',
      category: 'NUTRITION',
      difficulty: 'MEDIUM',
      xpReward: 90,
      coinsReward: 18,
      frequency: 'DAILY',
    },
    {
      title: 'Evitar fast food',
      description: 'Não consuma fast food ou comida ultra processada hoje',
      category: 'NUTRITION',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'DAILY',
    },
    {
      title: 'Comer salada no almoço',
      description: 'Inclua uma porção generosa de salada no almoço',
      category: 'NUTRITION',
      difficulty: 'EASY',
      xpReward: 50,
      coinsReward: 10,
      frequency: 'DAILY',
    },
    {
      title: 'Lanches saudáveis',
      description: 'Substitua lanches industrializados por frutas ou castanhas',
      category: 'NUTRITION',
      difficulty: 'MEDIUM',
      xpReward: 70,
      coinsReward: 14,
      frequency: 'DAILY',
    },
    {
      title: 'Reduzir sal',
      description: 'Evite adicionar sal extra na comida hoje',
      category: 'NUTRITION',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'DAILY',
    },

    // ============================================
    // 💧 HYDRATION (5 desafios)
    // ============================================
    {
      title: 'Beber 2L de água',
      description: 'Consuma pelo menos 2 litros de água durante o dia',
      category: 'HYDRATION',
      difficulty: 'EASY',
      xpReward: 60,
      coinsReward: 12,
      frequency: 'DAILY',
    },
    {
      title: 'Água ao acordar',
      description: 'Beba um copo de água logo ao acordar',
      category: 'HYDRATION',
      difficulty: 'EASY',
      xpReward: 30,
      coinsReward: 6,
      frequency: 'DAILY',
    },
    {
      title: 'Zero refrigerante',
      description: 'Evite refrigerantes e bebidas açucaradas hoje',
      category: 'HYDRATION',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'DAILY',
    },
    {
      title: 'Chá ou infusão',
      description: 'Beba pelo menos uma xícara de chá ou infusão natural',
      category: 'HYDRATION',
      difficulty: 'EASY',
      xpReward: 40,
      coinsReward: 8,
      frequency: 'DAILY',
    },
    {
      title: 'Água com limão',
      description: 'Beba água com limão em jejum pela manhã',
      category: 'HYDRATION',
      difficulty: 'EASY',
      xpReward: 35,
      coinsReward: 7,
      frequency: 'DAILY',
    },

    // ============================================
    // 🧠 MENTAL_HEALTH (4 desafios)
    // ============================================
    {
      title: 'Gratidão diária',
      description: 'Liste 3 coisas pelas quais você é grato hoje',
      category: 'MENTAL_HEALTH',
      difficulty: 'EASY',
      xpReward: 50,
      coinsReward: 10,
      frequency: 'DAILY',
    },
    {
      title: 'Momento sem telas',
      description: 'Passe 30 minutos longe de celular, TV e computador',
      category: 'MENTAL_HEALTH',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'DAILY',
    },
    {
      title: 'Tempo na natureza',
      description: 'Passe pelo menos 20 minutos ao ar livre',
      category: 'MENTAL_HEALTH',
      difficulty: 'EASY',
      xpReward: 60,
      coinsReward: 12,
      frequency: 'DAILY',
    },
    {
      title: 'Journaling',
      description: 'Escreva sobre seus pensamentos e emoções por 10 minutos',
      category: 'MENTAL_HEALTH',
      difficulty: 'MEDIUM',
      xpReward: 70,
      coinsReward: 14,
      frequency: 'DAILY',
    },

    // ============================================
    // 😴 SLEEP (5 desafios)
    // ============================================
    {
      title: 'Dormir 8 horas',
      description: 'Durma pelo menos 8 horas de sono de qualidade',
      category: 'SLEEP',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'DAILY',
    },
    {
      title: 'Rotina noturna',
      description: 'Siga uma rotina relaxante 30 minutos antes de dormir',
      category: 'SLEEP',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'DAILY',
    },
    {
      title: 'Dormir antes das 23h',
      description: 'Vá para a cama antes das 23h',
      category: 'SLEEP',
      difficulty: 'HARD',
      xpReward: 120,
      coinsReward: 24,
      frequency: 'DAILY',
    },
    {
      title: 'Cochilo power nap',
      description: 'Tire um cochilo de 20 minutos durante o dia',
      category: 'SLEEP',
      difficulty: 'EASY',
      xpReward: 40,
      coinsReward: 8,
      frequency: 'DAILY',
    },
    {
      title: 'Acordar no mesmo horário',
      description: 'Acorde no mesmo horário programado (mesmo fim de semana)',
      category: 'SLEEP',
      difficulty: 'MEDIUM',
      xpReward: 90,
      coinsReward: 18,
      frequency: 'DAILY',
    },

    // ============================================
    // 👥 SOCIAL (5 desafios)
    // ============================================
    {
      title: 'Ligar para amigo/familiar',
      description: 'Faça uma ligação de vídeo ou voz para alguém querido',
      category: 'SOCIAL',
      difficulty: 'EASY',
      xpReward: 60,
      coinsReward: 12,
      frequency: 'DAILY',
    },
    {
      title: 'Ato de bondade',
      description: 'Faça algo gentil por outra pessoa sem esperar nada em troca',
      category: 'SOCIAL',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'DAILY',
    },
    {
      title: 'Encontro presencial',
      description: 'Encontre um amigo ou familiar pessoalmente',
      category: 'SOCIAL',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'WEEKLY',
    },
    {
      title: 'Mensagem para amigo',
      description: 'Envie uma mensagem carinhosa para um amigo que não fala há tempo',
      category: 'SOCIAL',
      difficulty: 'EASY',
      xpReward: 50,
      coinsReward: 10,
      frequency: 'DAILY',
    },
    {
      title: 'Participar de grupo/comunidade',
      description: 'Participe de uma atividade em grupo ou comunidade',
      category: 'SOCIAL',
      difficulty: 'MEDIUM',
      xpReward: 90,
      coinsReward: 18,
      frequency: 'WEEKLY',
    },

    // ============================================
    // 🎯 PRODUCTIVITY (8 desafios)
    // ============================================
    {
      title: 'Planejar o dia',
      description: 'Liste suas 3 prioridades do dia pela manhã',
      category: 'PRODUCTIVITY',
      difficulty: 'EASY',
      xpReward: 50,
      coinsReward: 10,
      frequency: 'DAILY',
    },
    {
      title: 'Pomodoro de foco',
      description: 'Complete 4 sessões de 25 minutos de foco (técnica Pomodoro)',
      category: 'PRODUCTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 100,
      coinsReward: 20,
      frequency: 'DAILY',
    },
    {
      title: 'Organizar espaço de trabalho',
      description: 'Deixe sua mesa ou área de trabalho limpa e organizada',
      category: 'PRODUCTIVITY',
      difficulty: 'EASY',
      xpReward: 40,
      coinsReward: 8,
      frequency: 'DAILY',
    },
    {
      title: 'Aprender algo novo',
      description: 'Dedique 30 minutos para aprender uma nova habilidade',
      category: 'PRODUCTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 90,
      coinsReward: 18,
      frequency: 'DAILY',
    },
    {
      title: 'Ler 20 páginas',
      description: 'Leia pelo menos 20 páginas de um livro',
      category: 'PRODUCTIVITY',
      difficulty: 'EASY',
      xpReward: 60,
      coinsReward: 12,
      frequency: 'DAILY',
    },
    {
      title: 'Zero procrastinação',
      description: 'Complete suas 3 tarefas prioritárias sem procrastinar',
      category: 'PRODUCTIVITY',
      difficulty: 'HARD',
      xpReward: 130,
      coinsReward: 26,
      frequency: 'DAILY',
    },
    {
      title: 'Revisar metas semanais',
      description: 'Dedique 15 minutos para revisar suas metas da semana',
      category: 'PRODUCTIVITY',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'WEEKLY',
    },

    // ============================================
    // 🧘 MINDFULNESS (4 desafios)
    // ============================================
    {
      title: 'Meditar 10 minutos',
      description: 'Pratique 10 minutos de meditação guiada ou livre',
      category: 'MINDFULNESS',
      difficulty: 'MEDIUM',
      xpReward: 80,
      coinsReward: 16,
      frequency: 'DAILY',
    },
    {
      title: 'Respiração consciente',
      description: 'Faça 5 minutos de exercícios de respiração profunda',
      category: 'MINDFULNESS',
      difficulty: 'EASY',
      xpReward: 50,
      coinsReward: 10,
      frequency: 'DAILY',
    },
    {
      title: 'Refeição consciente',
      description: 'Faça uma refeição sem distrações, focando nos sabores',
      category: 'MINDFULNESS',
      difficulty: 'MEDIUM',
      xpReward: 70,
      coinsReward: 14,
      frequency: 'DAILY',
    },
    {
      title: 'Body scan',
      description: 'Pratique um body scan completo (escaneamento corporal)',
      category: 'MINDFULNESS',
      difficulty: 'HARD',
      xpReward: 120,
      coinsReward: 24,
      frequency: 'DAILY',
    },
  ];

  // Cria todos os desafios
  const createdChallenges = await prisma.challenge.createMany({
    data: challenges,
  });

  console.log(`✅ ${createdChallenges.count} desafios criados com sucesso!`);

  // Busca e mostra resumo por categoria
  const categories = [
    'PHYSICAL_ACTIVITY',
    'NUTRITION',
    'HYDRATION',
    'MENTAL_HEALTH',
    'SLEEP',
    'SOCIAL',
    'PRODUCTIVITY',
    'MINDFULNESS',
  ];

  console.log('\n📊 Resumo por categoria:');
  for (const category of categories) {
    const count = await prisma.challenge.count({
      where: { category: category as any },
    });
    console.log(`   ${category}: ${count} desafios`);
  }
}

async function main() {
  try {
    await seedChallenges();
    console.log('\n🎉 Seed de desafios concluído!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
