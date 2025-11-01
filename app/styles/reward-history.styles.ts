/**
 * ============================================
 * REWARD HISTORY STYLES - Estilos do Histórico de Recompensas
 * ============================================
 *
 * Estilos organizados e comentados para a tela de histórico de recompensas.
 * Segue o padrão do projeto com comentários descritivos e responsividade.
 *
 * @created 01 de novembro de 2025
 */

import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================================================
  // CONTAINER PRINCIPAL
  // ============================================================================

  /** Container principal da tela */
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Alice Blue - mesmo padrão do Profile
  },

  // ============================================================================
  // HEADER SIMPLES
  // ============================================================================

  /** Container do header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#F0F8FF', // Mesma cor do fundo
  },

  /** Botão de voltar com fundo branco circular */
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  /** Texto do botão de voltar (seta) */
  backButtonText: {
    fontSize: 30,
    fontWeight: '300',
    color: '#1F2937',
    lineHeight: 30,
    marginLeft: -2, // Ajuste fino para centralizar visualmente
  },

  /** Título do header */
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },

  /** Espaçador para centralizar o título */
  headerSpacer: {
    width: 42,
  },

  // ============================================================================
  // ESTATÍSTICAS (CARDS NO TOPO)
  // ============================================================================

  /**
   * Container das estatísticas
   * - Responsivo: 3 colunas em telas grandes, adapta em mobile
   * - Gap consistente entre cards
   */
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },

  /**
   * Card individual de estatística
   * - Design consistente com o resto do app
   * - Responsivo com minWidth
   */
  statCard: {
    flex: 1,
    minWidth: 95, // Garante tamanho mínimo em telas pequenas
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // Padrão do app (16px)
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  },

  /** Ícone emoji no topo do stat card */
  statIcon: {
    fontSize: 36,
    marginBottom: 10,
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  /** Valor numérico da estatística */
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937', // Cinza escuro
    marginBottom: 4,
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  /** Label descritiva da estatística */
  statLabel: {
    fontSize: 12,
    color: '#6B7280', // Cinza médio
    fontWeight: '600',
    textAlign: 'center',
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  // ============================================================================
  // FILTROS (SCROLL HORIZONTAL)
  // ============================================================================

  /** Container scroll dos filtros */
  filtersContainer: {
    paddingVertical: 8,
    flexGrow: 0,
  },

  /** Content do ScrollView */
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },

  /**
   * Botão individual de filtro
   * - Estado padrão: branco com borda
   * - Estado ativo: preenchido com cor primária
   */
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 8,
    height: 34,
  },

  /** Estado ativo do filtro */
  filterButtonActive: {
    backgroundColor: '#20B2AA',
    borderColor: '#20B2AA',
  },

  /** Ícone emoji do filtro */
  filterIcon: {
    fontSize: 15,
    marginRight: 5,
  },

  /** Texto do filtro */
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },

  /** Texto do filtro ativo (branco) */
  filterTextActive: {
    color: '#FFFFFF',
  },

  // ============================================================================
  // LISTA DE RECOMPENSAS
  // ============================================================================

  /** Content container da FlatList */
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1, // Permite que empty state ocupe espaço vertical
  },

  // ============================================================================
  // ESTADO VAZIO (EMPTY STATE)
  // ============================================================================

  /**
   * Container do estado vazio
   * - Centralizado vertical e horizontalmente
   * - Padding generoso para melhor visualização
   */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
    minHeight: 300, // Altura mínima para ocupar espaço visível
  },

  /** Ícone grande do estado vazio */
  emptyIcon: {
    fontSize: 72,
    marginBottom: 20,
    opacity: 0.6,
  },

  /** Título do estado vazio */
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937', // Cinza escuro
    marginBottom: 8,
    textAlign: 'center',
  },

  /** Texto explicativo do estado vazio */
  emptyText: {
    fontSize: 15,
    color: '#6B7280', // Cinza médio
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280, // Limita largura para melhor leitura
  },

  /** Subtexto adicional (dica de ação) */
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF', // Cinza mais claro
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12,
    fontStyle: 'italic',
  },

  // ============================================================================
  // LOADING (FOOTER DA LISTA)
  // ============================================================================

  /** Footer com indicador de "carregando mais" */
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Texto de "Carregando mais..." */
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },

  // ============================================================================
  // ESTADO DE ERRO
  // ============================================================================

  /** Container do estado de erro */
  errorContainer: {
    backgroundColor: '#FEF2F2', // Vermelho muito claro
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },

  /** Ícone de erro */
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  /** Título do erro */
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626', // Vermelho
    marginBottom: 8,
    textAlign: 'center',
  },

  /** Mensagem de erro */
  errorText: {
    fontSize: 14,
    color: '#991B1B', // Vermelho escuro
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },

  /** Botão de retry */
  retryButton: {
    backgroundColor: '#DC2626', // Vermelho
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },

  /** Texto do botão de retry */
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },
});

export default styles;
