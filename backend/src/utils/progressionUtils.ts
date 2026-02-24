/**
 * ============================================================
 * PROGRESSÃO & LEVEL UP — FiQuestLife (Backend)
 * ============================================================
 *
 * Fórmula central:  xpParaChegar(n) = 50 × (n − 1) × (n + 5)
 * Gap entre níveis: gap(n → n+1)    = 100n + 250
 * Inversa fechada:  nivel(xp)       = ⌊√(xp/50 + 9) − 2⌋
 *
 * Curva de referência (~400 XP/dia de atividade):
 *   Nível 10  →  6.750 XP  (~17 dias)
 *   Nível 20  → 23.750 XP  (~2 meses)
 *   Nível 50  → 134.750 XP (~11 meses)
 *   Nível 100 → 519.750 XP (~4,3 anos)
 * ============================================================
 */

/**
 * Retorna o XP total acumulado necessário para CHEGAR ao nível `level`.
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return 50 * (level - 1) * (level + 5);
}

/**
 * Retorna o nível correspondente a um total de XP acumulado.
 * Usa a inversa fechada da fórmula quadrática — O(1), sem loop.
 */
export function levelFromXP(totalXP: number): number {
  if (totalXP < 0) return 1;
  const raw = Math.sqrt(totalXP / 50 + 9) - 2;
  return Math.max(1, Math.floor(raw));
}

/**
 * Retorna o XP acumulado dentro do nível atual.
 */
export function xpProgressInLevel(totalXP: number): number {
  const level = levelFromXP(totalXP);
  return totalXP - xpForLevel(level);
}

/**
 * Retorna o total de XP necessário para completar o nível atual.
 * Equivale a: 100 × nivelAtual + 250
 */
export function xpNeededForNextLevel(totalXP: number): number {
  const level = levelFromXP(totalXP);
  return xpForLevel(level + 1) - xpForLevel(level);
}
