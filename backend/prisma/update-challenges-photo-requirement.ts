/**
 * Script para atualizar desafios existentes com requiresPhoto = true
 * Baseado na tabela de TAREFAS_PROJETO.md
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Desafios que requerem foto (baseado em TAREFAS_PROJETO.md)
const challengesRequiringPhoto = [
  // Atividade Física
  'Treino de força',
  'Alongamento matinal',
  'Yoga ou Pilates',
  'Aula de dança',
  'Natação',
  'Exercícios funcionais',
  
  // Nutrição
  'Comer 5 porções de frutas/vegetais',
  'Café da manhã saudável',
  'Preparar refeição caseira',
  'Proteína em cada refeição',
  'Comer salada no almoço',
  'Lanches saudáveis',
  
  // Hidratação
  'Beber 2L de água',
  'Água ao acordar',
  'Chá ou infusão',
  'Água com limão',
  'Evitar bebidas açucaradas',
  'Água antes das refeições',
  
  // Saúde Mental
  'Gratidão diária',
  'Tempo na natureza',
  'Journaling',
  
  // Social
  'Ato de bondade',
  'Encontro presencial',
  'Mensagem para amigo',
  'Participar de grupo/comunidade',
  
  // Produtividade
  'Planejar o dia',
  'Organizar espaço de trabalho',
  'Aprender algo novo',
  'Ler 20 páginas',
  'Revisar metas semanais',
];

async function updateChallenges() {
  console.log('🔄 Atualizando desafios com requisito de foto...\n');

  for (const title of challengesRequiringPhoto) {
    try {
      const result = await prisma.challenge.updateMany({
        where: { title },
        data: { requiresPhoto: true },
      });

      if (result.count > 0) {
        console.log(`✅ ${title} - marcado como requer foto`);
      } else {
        console.log(`⚠️  ${title} - não encontrado no banco`);
      }
    } catch (error) {
      console.error(`❌ Erro ao atualizar "${title}":`, error);
    }
  }

  // Contagem final
  const totalWithPhoto = await prisma.challenge.count({
    where: { requiresPhoto: true },
  });

  const total = await prisma.challenge.count();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Atualização concluída!');
  console.log(`📊 ${totalWithPhoto}/${total} desafios requerem foto`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

updateChallenges()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
