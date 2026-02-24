/**
 * ============================================================
 * PROGRESSÃO & LEVEL UP — FiQuestLife
 * ============================================================
 *
 * Fórmula projetada para um sistema de gamificação de fitness
 * com níveis de 1 a 100 e desafios que concedem 40-150 XP cada.
 *
 * ── FÓRMULA CENTRAL ─────────────────────────────────────────
 *
 *   xpParaChegar(n) = 50 × (n − 1) × (n + 5)
 *
 * O gap entre dois níveis consecutivos cresce linearmente:
 *
 *   gap(n → n+1) = 100n + 250
 *
 *   N1→N2:  350 XP   | N5→N6:   750 XP  | N10→N11: 1.250 XP
 *   N20→N21: 2.250 XP | N50→N51: 5.250 XP | N99→N100: 10.150 XP
 *
 * ── INVERSA FECHADA (sem loop, sem tabela) ──────────────────
 *
 *   Prova: xp/50 + 9 = (n-1)(n+5)/1 + 9
 *                    = n²+4n-5+9
 *                    = n²+4n+4
 *                    = (n+2)²
 *
 *   ∴ nivel(xp) = ⌊√(xp/50 + 9) − 2⌋
 *
 * ── CURVA DE PROGRESSÃO (usando ~400 XP/dia de atividade) ───
 *
 *   Nível 1   →   0 XP          (início)
 *   Nível 2   →   350 XP        (~1 dia)
 *   Nível 5   →   2.000 XP      (~5 dias)
 *   Nível 10  →   6.750 XP      (~17 dias)
 *   Nível 20  →   23.750 XP     (~2 meses)
 *   Nível 50  →   134.750 XP    (~11 meses)
 *   Nível 100 →   519.750 XP    (~4,3 anos)
 * ============================================================
 */

/**
 * Retorna o XP total acumulado necessário para CHEGAR ao nível `level`.
 *
 * @example
 * xpForLevel(1)   // 0        — nível inicial
 * xpForLevel(2)   // 350
 * xpForLevel(10)  // 6750
 * xpForLevel(100) // 519750
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * (level - 1) * (level + 5);
}

/**
 * Retorna o nível correspondente a um total de XP acumulado.
 * Usa a inversa fechada da fórmula quadrática — O(1), sem loop.
 *
 * @example
 * levelFromXP(0)      // 1
 * levelFromXP(349)    // 1
 * levelFromXP(350)    // 2
 * levelFromXP(6750)   // 10
 */
export function levelFromXP(totalXP: number): number {
  if (totalXP < 0) return 1;
  // nivel = floor( sqrt(xp/50 + 9) − 2 )
  const raw = Math.sqrt(totalXP / 50 + 9) - 2;
  return Math.max(1, Math.floor(raw));
}

/**
 * Retorna o XP acumulado dentro do nível atual.
 * (XP total menos o limiar do nível atual)
 *
 * @param storedLevel - Nível armazenado no banco (opcional). Quando fornecido,
 *   usa-o como referência em vez de recalcular pelo XP. Isso é essencial para
 *   usuários com nível protegido pela migração (acima do nível 15), cujo nivel
 *   no banco é maior do que levelFromXP(xp) retornaria.
 *
 * @example
 * xpProgressInLevel(600)         // 600 - 350 = 250 (nível 2)
 * xpProgressInLevel(19000, 20)   // max(0, 19000 - 23750) = 0  (usuário protegido)
 */
export function xpProgressInLevel(totalXP: number, storedLevel?: number): number {
  const level = storedLevel ?? levelFromXP(totalXP);
  const progress = totalXP - xpForLevel(level);
  return Math.max(0, progress);
}

/**
 * Retorna o total de XP necessário para completar o nível atual
 * (diferença entre o limiar do próximo nível e o nível atual).
 *
 * Equivale a: 100 × nivelAtual + 250
 *
 * @param storedLevel - Nível armazenado no banco (opcional). Veja xpProgressInLevel.
 *
 * @example
 * xpNeededForNextLevel(0)    // 350  (nível 1 → nível 2)
 * xpNeededForNextLevel(350)  // 450  (nível 2 → nível 3)
 * xpNeededForNextLevel(6750) // 1250 (nível 10 → nível 11)
 */
export function xpNeededForNextLevel(totalXP: number, storedLevel?: number): number {
  const level = storedLevel ?? levelFromXP(totalXP);
  return xpForLevel(level + 1) - xpForLevel(level);
}

/**
 * Retorna a porcentagem de progresso dentro do nível atual (0–100).
 *
 * @param storedLevel - Nível armazenado no banco (opcional). Veja xpProgressInLevel.
 *
 * @example
 * xpLevelProgress(600)  // ≈ 55.6  (250 de 450 XP para o próximo nível)
 */
export function xpLevelProgress(totalXP: number, storedLevel?: number): number {
  const progress = xpProgressInLevel(totalXP, storedLevel);
  const needed = xpNeededForNextLevel(totalXP, storedLevel);
  if (needed <= 0) return 100;
  return Math.min(100, Math.round((progress / needed) * 100));
}

/**
 * Retorna uma string formatada do progresso para exibição em UI.
 * Formato: "250/450 XP"
 *
 * @param storedLevel - Nível armazenado no banco (opcional). Veja xpProgressInLevel.
 *
 * @example
 * xpProgressLabel(600)  // "250/450 XP"
 */
export function xpProgressLabel(totalXP: number, storedLevel?: number): string {
  const progress = xpProgressInLevel(totalXP, storedLevel);
  const needed = xpNeededForNextLevel(totalXP, storedLevel);
  return `${progress}/${needed} XP`;
}
