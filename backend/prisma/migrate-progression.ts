/**
 * ============================================================
 * MIGRATION: Fórmula de Progressão Antiga → Nova
 * ============================================================
 *
 * Contexto:
 *   Fórmula antiga: level = floor(totalXP / 1000) + 1  (linear plana)
 *   Fórmula nova:   level = floor(sqrt(xp/50 + 9) − 2) (quadrática)
 *
 * Ponto de cruzamento: nível 15 (ambas as fórmulas concordam em 14.000 XP)
 *
 *   Nível < 15 → nova fórmula é mais generosa → usuário ganha níveis (OK)
 *   Nível = 15 → idêntico → sem impacto
 *   Nível > 15 → nova fórmula exige mais XP → usuário perderia níveis (PROIBIDO)
 *
 * Estratégia adotada:
 *   - Usuários abaixo do nível 15: recalcula o nível com a nova fórmula (boost gratuito)
 *   - Usuários acima do nível 15: nível é congelado no valor atual. A fórmula nova
 *     assume o controle a partir do próximo XP ganho (Math.max no service).
 *
 * Uso:
 *   npm run ts-node prisma/migrate-progression.ts          → dry run (somente relatório)
 *   npm run ts-node prisma/migrate-progression.ts --apply  → aplica no banco
 * ============================================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = !process.argv.includes('--apply');

// ── Fórmula nova (espelhada aqui para evitar dependência de import) ──
function levelFromXP(totalXP: number): number {
  if (totalXP < 0) return 1;
  const raw = Math.sqrt(totalXP / 50 + 9) - 2;
  return Math.max(1, Math.floor(raw));
}

async function run() {
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('  MIGRAÇÃO DE PROGRESSÃO — FiQuestLife');
  console.log(DRY_RUN ? '  MODO: DRY RUN (sem alterações no banco)' : '  MODO: APLICANDO NO BANCO');
  console.log('══════════════════════════════════════════════\n');

  const users = await prisma.user.findMany({
    select: { id: true, username: true, xp: true, level: true },
    orderBy: { level: 'desc' },
  });

  console.log(`Total de usuários: ${users.length}\n`);

  let boostCount = 0;
  let frozenCount = 0;
  let unchangedCount = 0;

  const toUpdate: Array<{ id: string; username: string; oldLevel: number; newLevel: number; xp: number }> = [];

  for (const user of users) {
    const calculatedLevel = levelFromXP(user.xp);

    if (calculatedLevel > user.level) {
      // Nova fórmula é mais generosa → boost gratuito
      boostCount++;
      toUpdate.push({
        id: user.id,
        username: user.username,
        oldLevel: user.level,
        newLevel: calculatedLevel,
        xp: user.xp,
      });
    } else if (calculatedLevel < user.level) {
      // Usuário acima do cruzamento → nível congelado no valor atual
      // O Math.max no challenge.service já garante que não vai regredir
      frozenCount++;
    } else {
      unchangedCount++;
    }
  }

  // ── Relatório de impacto ──────────────────────────────────────
  console.log('── RESUMO ───────────────────────────────────');
  console.log(`  ✅ Boost (nova fórmula mais generosa): ${boostCount} usuários`);
  console.log(`  🔒 Congelados (acima do cruzamento):   ${frozenCount} usuários`);
  console.log(`  ➖ Sem impacto:                         ${unchangedCount} usuários`);
  console.log('');

  if (toUpdate.length > 0) {
    console.log('── USUÁRIOS QUE RECEBEM BOOST ───────────────');
    console.log('  Username               XP       Nível antigo → Nível novo');
    console.log('  ─────────────────────────────────────────────────────────');
    for (const u of toUpdate) {
      const username = u.username.padEnd(22);
      const xp = String(u.xp).padStart(8);
      console.log(`  ${username} ${xp}   ${u.oldLevel} → ${u.newLevel}  (+${u.newLevel - u.oldLevel})`);
    }
    console.log('');
  }

  const frozenUsers = users.filter(u => levelFromXP(u.xp) < u.level);
  if (frozenUsers.length > 0) {
    console.log('── USUÁRIOS CONGELADOS (nível protegido) ────');
    console.log('  Username               XP       Nível salvo  Novo calc.  Diferença');
    console.log('  ───────────────────────────────────────────────────────────────────');
    for (const u of frozenUsers) {
      const calc = levelFromXP(u.xp);
      const username = u.username.padEnd(22);
      const xp = String(u.xp).padStart(8);
      console.log(`  ${username} ${xp}   ${String(u.level).padStart(5)}       ${String(calc).padStart(5)}      -${u.level - calc}`);
    }
    console.log('');
    console.log('  ℹ️  Esses usuários NÃO são alterados. O nível deles está salvo corretamente');
    console.log('     no banco. A nova fórmula assumirá o controle quando eles ganharem o');
    console.log('     próximo XP suficiente para ultrapassar o nível atual.\n');
  }

  // ── Aplicação ─────────────────────────────────────────────────
  if (DRY_RUN) {
    console.log('══════════════════════════════════════════════');
    console.log('  DRY RUN concluído. Nenhuma alteração feita.');
    console.log('  Para aplicar: npx ts-node prisma/migrate-progression.ts --apply');
    console.log('══════════════════════════════════════════════\n');
  } else {
    if (toUpdate.length === 0) {
      console.log('Nenhuma atualização necessária.');
    } else {
      console.log(`Aplicando ${toUpdate.length} atualizações...`);

      let applied = 0;
      for (const u of toUpdate) {
        await prisma.user.update({
          where: { id: u.id },
          data: { level: u.newLevel },
        });
        applied++;
        if (applied % 10 === 0) console.log(`  ${applied}/${toUpdate.length} concluídos...`);
      }

      console.log(`\n✅ ${applied} usuários atualizados com sucesso.\n`);
    }

    console.log('══════════════════════════════════════════════');
    console.log('  MIGRAÇÃO CONCLUÍDA');
    console.log('══════════════════════════════════════════════\n');
  }

  await prisma.$disconnect();
}

run().catch(async (error) => {
  console.error('Erro durante a migração:', error);
  await prisma.$disconnect();
  process.exit(1);
});
