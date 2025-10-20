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
});
