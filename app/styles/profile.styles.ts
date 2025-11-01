/**
 * 🎨 ESTILOS DA TELA DE PERFIL
 * 
 * Arquivo de estilização responsivo para a tela de perfil do usuário.
 * Exibe informações do usuário, estatísticas de gamificação e opções de conta.
 * 
 * Cores principais:
 * - Background: #F0F8FF (Alice Blue - azul claro suave)
 * - Primária: #007BFF (Azul para destaque de stats)
 * - Perigo: #FF6B6B (Vermelho para logout)
 * - Stats BG: #F0F8FF (Azul muito claro para caixas de estatísticas)
 */

import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================================
  // 📦 CONTAINERS PRINCIPAIS
  // ==========================================
  
  /** Container principal - Ocupa toda a tela */
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Fundo azul claro suave
  },

  /**
   * Conteúdo do ScrollView
   * - Permite rolagem quando conteúdo excede altura da tela
   * - Padding responsivo para diferentes dispositivos
   */
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  /**
   * Card de Perfil (primeiro card)
   * Adiciona espaçamento inferior para separar do próximo card
   */
  profileCard: {
    marginBottom: 16,
  },

  /**
   * Card de Badges (segundo card)
   * Com marginBottom consistente com outros cards
   */
  badgesCard: {
    marginBottom: 16,
  },

  // ==========================================
  // 🎯 HEADER (Saudação e Nome do App)
  // ==========================================
  
  /** Container do header centralizado */
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  /** Nome do aplicativo */
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F4F4F', // Verde-azulado escuro
    marginTop: 5,
  },

  /** Mensagem de saudação ao usuário */
  greeting: {
    fontSize: 16,
    color: '#666', // Cinza médio
    marginTop: 5,
  },
  // ==========================================
  // 🃏 CARD PRINCIPAL (Container do Perfil)
  // ==========================================
  
  /**
   * Card branco central que contém todas as informações do perfil
   * - width: 100% em mobile, maxWidth: 500px em desktop/tablet
   * - Sombra nativa (elevation) para Android e iOS
   * - boxShadow CSS para Web (melhor performance e aparência)
   */
  card: {
    width: '100%',
    maxWidth: 500, // Limita largura em telas grandes para melhor legibilidade
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    // Sombra para Android/iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Android apenas
    alignItems: 'center',
    // Sombra nativa CSS para Web (melhor performance)
    ...(Platform.OS === 'web' && {
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    }),
  },

  // ==========================================
  // 🏷️ TAG DE BOAS-VINDAS (Badge no topo)
  // ==========================================
  
  /** Tag colorida de boas-vindas */
  welcomeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA', // Turquesa
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  /** Texto dentro da tag de boas-vindas */
  welcomeTagText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },

  // ==========================================
  // 📝 TÍTULOS DO CARD
  // ==========================================
  
  /** Título principal do card */
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  /** Subtítulo/descrição do card */
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
    textAlign: 'center',
  },

  // ==========================================
  // 👤 AVATAR
  // ==========================================
  
  /** Container do avatar centralizado */
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  // ==========================================
  // ℹ️ INFORMAÇÕES DO USUÁRIO (Email, Username, etc)
  // ==========================================
  
  /** Container das linhas de informação */
  infoContainer: {
    width: '100%',
    marginBottom: 15,
  },

  /**
   * Linha individual de informação
   * - Exibe ícone, label e valor
   */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7', // Cinza muito claro
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
  },

  /** Ícone à esquerda da linha de info */
  infoIcon: {
    marginRight: 15,
  },

  /** Container do texto (label + valor) */
  infoContent: {
    flex: 1,
  },

  /** Label descritivo (ex: "Email", "Usuário") */
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },

  /** Valor da informação */
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // ==========================================
  // 📊 ESTATÍSTICAS DE GAMIFICAÇÃO
  // ==========================================
  
  /**
   * Container das estatísticas (XP, Level, Moedas, etc)
   * - flexWrap: 'wrap' permite quebra de linha em telas pequenas
   * - Responsivo: 3 colunas em telas grandes, 2 colunas em mobile
   */
  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite quebra de linha em telas pequenas
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },

  /**
   * Caixa individual de estatística
   * - minWidth: 100px garante tamanho mínimo mesmo em telas pequenas
   * - flex: 1 distribui espaço igualmente
   * - marginVertical: 5 adiciona espaço quando há quebra de linha
   */
  statBox: {
    alignItems: 'center',
    backgroundColor: '#F0F8FF', // Azul muito claro
    borderRadius: 10,
    padding: 15,
    flex: 1,
    minWidth: 100, // Largura mínima para cada stat (responsividade)
    marginHorizontal: 5,
    marginVertical: 5, // Espaço vertical quando quebra linha
  },

  /**
   * Valor numérico da estatística
   * - userSelect: 'none' evita seleção acidental em web
   */
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF', // Azul vibrante
    marginTop: 5,
    ...(Platform.OS === 'web' && { userSelect: 'none' }),
  },

  /**
   * Label da estatística (ex: "Level", "XP", "Moedas")
   * - textAlign: 'center' garante centralização em todas as larguras
   */
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
    ...(Platform.OS === 'web' && { userSelect: 'none' }),
  },
  // ==========================================
  // 🚪 BOTÃO DE LOGOUT
  // ==========================================
  
  /**
   * Botão vermelho de sair da conta
   * - Cor vermelha indica ação de perigo/saída
   * - Cursor pointer em web para melhor UX
   */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FF6B6B', // Vermelho suave
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }), // Cursor de mão na web
  },

  /**
   * Texto do botão de logout
   * - userSelect: 'none' evita seleção acidental em web
   */
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    ...(Platform.OS === 'web' && { userSelect: 'none' }), // Não seleciona texto na web
  },

  // ==========================================
  // ⏳ ESTADO DE CARREGAMENTO
  // ==========================================
  
  /** Container quando dados estão carregando */
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Texto de "Carregando..." */
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },

  // ==========================================
  // 🎯 ACTION BUTTONS (EDIT & SETTINGS)
  // ==========================================
  
  /** Container dos botões de ação */
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },

  /** Botão individual de ação */
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },

  /** Texto do botão de ação */
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  // ==========================================
  // 🏆 SEÇÃO DE BADGES EM DESTAQUE
  // ==========================================

  /** Header da seção de badges */
  badgesSectionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },

  /** Título da seção de badges */
  badgesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },

  /** Subtítulo da seção de badges */
  badgesSectionSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },

  /** Botão "Ver Todos" */
  viewAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#20B2AA',
    marginBottom: 16,
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },

  /** Texto do botão "Ver Todos" */
  viewAllButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  /** Container de loading dos badges */
  badgesLoadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Container do scroll horizontal de badges */
  badgesScrollContainer: {
    paddingVertical: 8, // Espaçamento vertical interno do scroll
    paddingLeft: 0, // Alinha com a borda do card (Card já tem padding 25)
    paddingRight: 25, // Mesma margem do Card para simetria
    gap: 12,
  },

  /** Card miniatura de badge */
  badgeMiniCard: {
    width: 110, // Aumentado de 100 para 110 - mais espaço interno
    padding: 14, // Aumentado de 12 para 14 - mais confortável
    borderRadius: 16, // Aumentado de 12 para 16 - mais arredondado (padrão do app)
    backgroundColor: '#FFF',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Adiciona transição suave
      },
    }),
  },

  /** Ícone do badge miniatura */
  badgeMiniIcon: {
    fontSize: 36, // Aumentado de 32 para 36 - ícone mais visível
    marginBottom: 8,
  },

  /** Nome do badge miniatura */
  badgeMiniName: {
    fontSize: 13, // Aumentado de 12 para 13 - mais legível
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },

  /** Data de conquista do badge */
  badgeMiniDate: {
    fontSize: 11, // Aumentado de 10 para 11 - mais legível
    color: '#999',
    textAlign: 'center',
  },

  /** Container quando não há badges */
  noBadgesContainer: {
    paddingVertical: 40, // Espaçamento vertical
    paddingHorizontal: 0, // Remove padding - Card já tem padding 25
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Ícone de "sem badges" */
  noBadgesIcon: {
    fontSize: 56, // Aumentado de 48 para 56 - ícone maior e mais visível
    marginBottom: 16, // Aumentado de 12 para 16 - mais espaço
    opacity: 0.4, // Reduzido de 0.5 para 0.4 - mais sutil
  },

  /** Texto de "sem badges" */
  noBadgesText: {
    fontSize: 16, // Aumentado de 15 para 16 - mais legível
    fontWeight: '600',
    color: '#666',
    marginBottom: 8, // Aumentado de 4 para 8 - mais espaço entre textos
    textAlign: 'center',
  },

  /** Subtexto de "sem badges" */
  noBadgesSubtext: {
    fontSize: 14, // Aumentado de 13 para 14 - mais legível
    color: '#999',
    textAlign: 'center',
    lineHeight: 20, // Adiciona altura de linha para melhor leitura
  },

  // ============================================================================
  // HISTÓRICO DE RECOMPENSAS
  // ============================================================================

  /** Container do botão de histórico */
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16, // Consistente com outros cards
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },

  /** Container do conteúdo do botão */
  historyButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  /** Container circular do ícone */
  historyButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF', // Azul muito claro
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  /** Emoji dentro do círculo */
  historyButtonEmoji: {
    fontSize: 24,
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },

  /** Container do texto do botão */
  historyButtonText: {
    flex: 1,
  },

  /** Título do botão de histórico */
  historyButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 3,
  },

  /** Subtítulo do botão de histórico */
  historyButtonSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  /** Seta do botão de histórico */
  historyButtonArrow: {
    fontSize: 24,
    color: '#9CA3AF',
    marginLeft: 12,
    ...Platform.select({
      web: { userSelect: 'none' },
    }),
  },
});
