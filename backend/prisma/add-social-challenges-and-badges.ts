/**
 * ============================================
 * SCRIPT: Adicionar Desafios Sociais e Badges
 * ============================================
 * 
 * Adiciona desafios auto-verificáveis relacionados a interações sociais
 * e badges de conquista relacionadas
 * 
 * @created 1 de dezembro de 2025
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// DESAFIOS SOCIAIS
// ==========================================
const socialChallenges = [
  {
    title: '🎯 Desafie um Amigo',
    description: 'Envie um convite de desafio para um amigo e motive-o a completar um desafio junto com você!',
    category: 'SOCIAL' as const,
    difficulty: 'EASY' as const,
    xpReward: 50,
    coinsReward: 25,
    requiresPhoto: false,
    isActive: true,
    autoVerifiable: true,
    verificationEvent: 'CHALLENGE_INVITE_SENT',
  },
  {
    title: '🤝 Aceite um Desafio',
    description: 'Aceite o convite de desafio de um amigo e mostre que você está sempre pronto para novos desafios!',
    category: 'SOCIAL' as const,
    difficulty: 'EASY' as const,
    xpReward: 50,
    coinsReward: 25,
    requiresPhoto: false,
    isActive: true,
    autoVerifiable: true,
    verificationEvent: 'CHALLENGE_INVITE_ACCEPTED',
  },
  {
    title: '❤️ Curta uma Postagem',
    description: 'Mostre apoio aos seus amigos curtindo uma postagem no feed. Espalhe positividade!',
    category: 'SOCIAL' as const,
    difficulty: 'EASY' as const,
    xpReward: 30,
    coinsReward: 15,
    requiresPhoto: false,
    isActive: true,
    autoVerifiable: true,
    verificationEvent: 'POST_LIKED',
  },
  {
    title: '💬 Comente em uma Postagem',
    description: 'Deixe um comentário significativo em uma postagem de um amigo. Interação é tudo!',
    category: 'SOCIAL' as const,
    difficulty: 'EASY' as const,
    xpReward: 40,
    coinsReward: 20,
    requiresPhoto: false,
    isActive: true,
    autoVerifiable: true,
    verificationEvent: 'POST_COMMENTED',
  },
  {
    title: '👥 Conecte-se com um Novo Amigo',
    description: 'Adicione um novo amigo à sua rede e expanda suas conexões no FiQuestLife!',
    category: 'SOCIAL' as const,
    difficulty: 'EASY' as const,
    xpReward: 60,
    coinsReward: 30,
    requiresPhoto: false,
    isActive: true,
    autoVerifiable: true,
    verificationEvent: 'FRIENDSHIP_CREATED',
  },
  {
    title: '🎉 Conquiste uma Nova Badge',
    description: 'Desbloqueie uma nova conquista completando desafios e atingindo marcos especiais!',
    category: 'SOCIAL' as const,
    difficulty: 'MEDIUM' as const,
    xpReward: 75,
    coinsReward: 40,
    requiresPhoto: false,
    isActive: true,
    autoVerifiable: true,
    verificationEvent: 'BADGE_EARNED',
  },
  {
    title: '🔥 Mantenha sua Sequência',
    description: 'Complete pelo menos 3 desafios diários para manter sua sequência ativa por mais um dia!',
    category: 'SOCIAL' as const,
    difficulty: 'MEDIUM' as const,
    xpReward: 80,
    coinsReward: 45,
    requiresPhoto: false,
    isActive: true,
    autoVerifiable: true,
    verificationEvent: 'DAILY_CHALLENGES_COMPLETED',
  },
];

// ==========================================
// BADGES SOCIAIS
// ==========================================
const baseBadgeFields = {
  category: 'SOCIAL' as const,
  requirementType: 'EVENT_COUNT' as const,
  isActive: true,
};

const socialBadges = [
  // Badges de Desafiar Amigos
  {
    ...baseBadgeFields,
    name: 'Desafiador Iniciante',
    description: 'Desafie seu primeiro amigo e comece a espalhar motivação!',
    icon: '🎯',
    rarity: 'COMMON' as const,
    requirement: 'Desafiar 1 amigo',
    requirementValue: 1,
    requiredCount: 1,
    event: 'CHALLENGE_INVITE_SENT',
    xpReward: 50,
    coinsReward: 25,
  },
  {
    ...baseBadgeFields,
    name: 'Desafiador Frequente',
    description: 'Você é conhecido por motivar seus amigos com desafios empolgantes!',
    icon: '🎯',
    rarity: 'RARE' as const,
    requirement: 'Desafiar 10 amigos',
    requirementValue: 10,
    requiredCount: 10,
    event: 'CHALLENGE_INVITE_SENT',
    xpReward: 200,
    coinsReward: 100,
  },
  {
    ...baseBadgeFields,
    name: 'Mestre dos Desafios',
    description: 'Você é um verdadeiro mestre em criar competições saudáveis entre amigos!',
    icon: '👑',
    rarity: 'EPIC' as const,
    requirement: 'Desafiar 50 amigos',
    requirementValue: 50,
    requiredCount: 50,
    event: 'CHALLENGE_INVITE_SENT',
    xpReward: 500,
    coinsReward: 250,
  },
  {
    ...baseBadgeFields,
    name: 'Lenda dos Desafios',
    description: 'Sua dedicação em desafiar amigos é lendária! Você inspira toda a comunidade!',
    icon: '⚡',
    rarity: 'LEGENDARY' as const,
    requirement: 'Desafiar 100 amigos',
    requirementValue: 100,
    requiredCount: 100,
    event: 'CHALLENGE_INVITE_SENT',
    xpReward: 1000,
    coinsReward: 500,
  },

  // Badges de Aceitar Desafios
  {
    ...baseBadgeFields,
    name: 'Aceita Tudo',
    description: 'Você nunca recusa um bom desafio! Sempre pronto para a ação!',
    icon: '🤝',
    rarity: 'COMMON' as const,
    requirement: 'Aceitar 10 desafios',
    requirementValue: 10,
    requiredCount: 10,
    event: 'CHALLENGE_INVITE_ACCEPTED',
    xpReward: 150,
    coinsReward: 75,
  },
  {
    ...baseBadgeFields,
    name: 'Amigo Solidário',
    description: 'Você é o tipo de amigo que está sempre disposto a participar e apoiar!',
    icon: '💪',
    rarity: 'RARE' as const,
    requirement: 'Aceitar 25 desafios',
    requirementValue: 25,
    requiredCount: 25,
    event: 'CHALLENGE_INVITE_ACCEPTED',
    xpReward: 300,
    coinsReward: 150,
  },
  {
    ...baseBadgeFields,
    name: 'Guerreiro Imparável',
    description: 'Nenhum desafio é grande demais para você! Aceitar é sua especialidade!',
    icon: '⚔️',
    rarity: 'EPIC' as const,
    requirement: 'Aceitar 50 desafios',
    requirementValue: 50,
    requiredCount: 50,
    event: 'CHALLENGE_INVITE_ACCEPTED',
    xpReward: 600,
    coinsReward: 300,
  },

  // Badges de Curtidas
  {
    ...baseBadgeFields,
    name: 'Apoiador',
    description: 'Você espalha positividade curtindo as conquistas dos seus amigos!',
    icon: '❤️',
    rarity: 'COMMON' as const,
    requirement: 'Curtir 25 postagens',
    requirementValue: 25,
    requiredCount: 25,
    event: 'POST_LIKED',
    xpReward: 100,
    coinsReward: 50,
  },
  {
    ...baseBadgeFields,
    name: 'Engajado',
    description: 'Seu apoio constante motiva a comunidade a continuar compartilhando!',
    icon: '💖',
    rarity: 'RARE' as const,
    requirement: 'Curtir 100 postagens',
    requirementValue: 100,
    requiredCount: 100,
    event: 'POST_LIKED',
    xpReward: 250,
    coinsReward: 125,
  },
  {
    ...baseBadgeFields,
    name: 'Ícone de Positividade',
    description: 'Você é uma fonte constante de energia positiva na comunidade!',
    icon: '✨',
    rarity: 'EPIC' as const,
    requirement: 'Curtir 250 postagens',
    requirementValue: 250,
    requiredCount: 250,
    event: 'POST_LIKED',
    xpReward: 500,
    coinsReward: 250,
  },

  // Badges de Comentários
  {
    ...baseBadgeFields,
    name: 'Comentarista',
    description: 'Você não só acompanha, você participa! Seus comentários fazem a diferença!',
    icon: '💬',
    rarity: 'COMMON' as const,
    requirement: 'Fazer 50 comentários',
    requirementValue: 50,
    requiredCount: 50,
    event: 'POST_COMMENTED',
    xpReward: 150,
    coinsReward: 75,
  },
  {
    ...baseBadgeFields,
    name: 'Conversador',
    description: 'Suas palavras inspiram e motivam outros a continuar em suas jornadas!',
    icon: '🗨️',
    rarity: 'RARE' as const,
    requirement: 'Fazer 150 comentários',
    requirementValue: 150,
    requiredCount: 150,
    event: 'POST_COMMENTED',
    xpReward: 350,
    coinsReward: 175,
  },
  {
    ...baseBadgeFields,
    name: 'Influenciador',
    description: 'Suas interações criam conexões reais e fortalecem a comunidade!',
    icon: '🌟',
    rarity: 'EPIC' as const,
    requirement: 'Fazer 300 comentários',
    requirementValue: 300,
    requiredCount: 300,
    event: 'POST_COMMENTED',
    xpReward: 700,
    coinsReward: 350,
  },

  // Badges de Amizades
  {
    ...baseBadgeFields,
    name: 'Sociável',
    description: 'Você entende o valor das conexões e está sempre aberto a novas amizades!',
    icon: '👥',
    rarity: 'COMMON' as const,
    requirement: 'Adicionar 10 amigos',
    requirementValue: 10,
    requiredCount: 10,
    event: 'FRIENDSHIP_CREATED',
    xpReward: 150,
    coinsReward: 75,
  },
  {
    ...baseBadgeFields,
    name: 'Social Butterfly',
    description: 'Sua rede de amigos é vasta e suas conexões são valiosas!',
    icon: '🦋',
    rarity: 'RARE' as const,
    requirement: 'Adicionar 20 amigos',
    requirementValue: 20,
    requiredCount: 20,
    event: 'FRIENDSHIP_CREATED',
    xpReward: 300,
    coinsReward: 150,
  },
  {
    ...baseBadgeFields,
    name: 'Conector',
    description: 'Você é o elo que une pessoas e cria uma comunidade mais forte!',
    icon: '🌐',
    rarity: 'EPIC' as const,
    requirement: 'Adicionar 50 amigos',
    requirementValue: 50,
    requiredCount: 50,
    event: 'FRIENDSHIP_CREATED',
    xpReward: 600,
    coinsReward: 300,
  },

  // Badges Especiais
  {
    ...baseBadgeFields,
    name: 'Colecionador de Badges',
    description: 'Você ama conquistar novas badges e mostrar suas conquistas!',
    icon: '🏆',
    rarity: 'RARE' as const,
    requirement: 'Conquistar 15 badges',
    requirementValue: 15,
    requiredCount: 15,
    event: 'BADGE_EARNED',
    xpReward: 400,
    coinsReward: 200,
  },
  {
    ...baseBadgeFields,
    name: 'Mestre das Conquistas',
    description: 'Seu arsenal de badges é invejável! Você é um verdadeiro campeão!',
    icon: '👑',
    rarity: 'EPIC' as const,
    requirement: 'Conquistar 30 badges',
    requirementValue: 30,
    requiredCount: 30,
    event: 'BADGE_EARNED',
    xpReward: 800,
    coinsReward: 400,
  },
];

async function main() {
  console.log('🚀 Iniciando inserção de desafios sociais e badges...\n');

  // ==========================================
  // INSERIR DESAFIOS
  // ==========================================
  console.log('📝 Inserindo desafios sociais...');
  
  for (const challenge of socialChallenges) {
    try {
      const existing = await prisma.challenge.findFirst({
        where: { title: challenge.title },
      });

      if (existing) {
        console.log(`   ⚠️  Desafio "${challenge.title}" já existe, pulando...`);
        continue;
      }

      await prisma.challenge.create({
        data: challenge,
      });
      console.log(`   ✅ Desafio "${challenge.title}" criado com sucesso!`);
    } catch (error) {
      console.error(`   ❌ Erro ao criar desafio "${challenge.title}":`, error);
    }
  }

  // ==========================================
  // INSERIR BADGES
  // ==========================================
  console.log('\n🏅 Inserindo badges sociais...');
  
  for (const badge of socialBadges) {
    try {
      const existing = await prisma.badge.findFirst({
        where: { name: badge.name },
      });

      if (existing) {
        console.log(`   ⚠️  Badge "${badge.name}" já existe, pulando...`);
        continue;
      }

      await prisma.badge.create({
        data: badge,
      });
      console.log(`   ✅ Badge "${badge.name}" (${badge.rarity}) criada com sucesso!`);
    } catch (error) {
      console.error(`   ❌ Erro ao criar badge "${badge.name}":`, error);
    }
  }

  console.log('\n✨ Processo concluído!\n');
  console.log('📊 Resumo:');
  console.log(`   - ${socialChallenges.length} desafios sociais adicionados`);
  console.log(`   - ${socialBadges.length} badges sociais adicionadas\n`);
}

main()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
