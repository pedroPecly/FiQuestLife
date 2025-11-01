/**
 * ============================================
 * REWARD CARD STYLES - Estilos do Card de Recompensa
 * ============================================
 *
 * Estilos para o componente RewardCard.
 * Card individual que exibe uma recompensa do histórico.
 *
 * @created 01 de novembro de 2025
 */

import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================================================
  // CONTAINER PRINCIPAL
  // ============================================================================

  /**
   * Container principal do card
   * - Layout horizontal: ícone à esquerda, conteúdo à direita
   * - Sombra suave para dar profundidade
   * - Responsivo e acessível
   */
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Centraliza verticalmente
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // Padrão do app
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      },
    }),
  } as any,

  // ============================================================================
  // ÍCONE COM BACKGROUND COLORIDO
  // ============================================================================

  /**
   * Container circular do ícone
   * - Background colorido conforme tipo de recompensa
   * - Tamanho fixo para consistência
   */
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Círculo perfeito
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  /** Ícone emoji dentro do círculo */
  icon: {
    fontSize: 30,
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  // ============================================================================
  // CONTEÚDO TEXTUAL
  // ============================================================================

  /** Container do conteúdo textual (direita) */
  content: {
    flex: 1,
    justifyContent: 'center',
  },

  /** Header: valor + data (linha superior) */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  /** Valor da recompensa (ex: "+50 XP") */
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937', // Cinza escuro
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  /** Data relativa (ex: "há 2h") */
  date: {
    fontSize: 13,
    color: '#9CA3AF', // Cinza claro
    fontWeight: '500',
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  /** Origem da recompensa (ex: "Desafio completado") */
  source: {
    fontSize: 14,
    color: '#6B7280', // Cinza médio
    fontWeight: '600',
    marginBottom: 4,
  },

  /** Descrição adicional (opcional) */
  description: {
    fontSize: 13,
    color: '#9CA3AF', // Cinza claro
    lineHeight: 18,
  },

  // ============================================================================
  // BADGE/TAG ADICIONAL (OPCIONAL)
  // ============================================================================

  /** Tag pequena para informação adicional */
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  },

  /** Texto da tag */
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
});

export default styles;
