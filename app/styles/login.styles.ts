/**
 * 🎨 ESTILOS DA TELA DE LOGIN/CADASTRO
 * 
 * Arquivo de estilização responsivo para a tela de autenticação.
 * Suporta Mobile, Tablet e Desktop com adaptações específicas.
 * 
 * Cores principais:
 * - Background: #F0F8FF (Alice Blue - azul claro suave)
 * - Primária: #007BFF (Azul vibrante para CTAs)
 * - Texto: #333 (Cinza escuro para leitura)
 * - Secundária: #20B2AA (Turquesa para tags/destaques)
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
   * - flexGrow permite crescer conforme necessário
   * - Centraliza conteúdo vertical e horizontalmente
   * - Padding responsivo para diferentes tamanhos de tela
   */
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  // ==========================================
  // 🎯 HEADER (Logo e Título do App)
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

  /** Slogan do aplicativo */
  slogan: {
    fontSize: 16,
    color: '#666', // Cinza médio
  },
  // ==========================================
  // 🃏 CARD PRINCIPAL (Container do Formulário)
  // ==========================================
  
  /**
   * Card branco central que contém todo o formulário
   * - width: 100% em mobile, maxWidth: 500px em desktop
   * - Sombra nativa (elevation) para Android e iOS
   * - boxShadow CSS para Web (melhor performance)
   */
  card: {
    width: '100%',
    maxWidth: 500, // Limita largura em telas grandes (desktop/tablet)
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
  // 🏷️ TAG DE MISSÃO (Badge no topo do card)
  // ==========================================
  
  /** Tag colorida com ícone indicando "Missão" */
  missionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA', // Turquesa
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  /** Texto dentro da tag de missão */
  missionTagText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },

  // ==========================================
  // 📝 TÍTULOS E TEXTOS DO CARD
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
  // ⌨️ INPUTS (Campos de texto)
  // ==========================================
  
  /** Container do input com ícone */
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#F7F7F7', // Cinza muito claro
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },

  /** Ícone à esquerda do input */
  inputIcon: {
    marginRight: 10,
  },

  /** Campo de texto do input */
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  // ==========================================
  // 🔘 BOTÕES
  // ==========================================
  
  /**
   * Botão primário (Entrar / Criar Conta)
   * - Cursor pointer em web para melhor UX
   */
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#007BFF', // Azul vibrante
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }), // Cursor de mão na web
  },

  /**
   * Botão primário quando desabilitado (loading)
   * - Cursor not-allowed indica que não é clicável
   */
  primaryButtonDisabled: {
    backgroundColor: '#cccccc', // Cinza quando desabilitado
    ...(Platform.OS === 'web' && { cursor: 'not-allowed' }),
  },

  /**
   * Texto do botão primário
   * - userSelect: 'none' evita seleção acidental em web
   */
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    ...(Platform.OS === 'web' && { userSelect: 'none' }),
  },

  /** Botão para alternar entre Login e Cadastro */
  switchModeButton: {
    marginTop: 15,
    padding: 10,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },

  /** Texto do botão de alternar modo */
  switchModeText: {
    color: '#007BFF',
    fontSize: 14,
    textAlign: 'center',
  },
  // ==========================================
  // ➗ DIVISOR ("ou")
  // ==========================================
  
  /** Container do divisor com linhas e texto */
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },

  /** Linha horizontal do divisor */
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },

  /** Texto "ou" no centro do divisor */
  dividerText: {
    marginHorizontal: 15,
    color: '#888',
    fontSize: 14,
  },

  // ==========================================
  // 🌐 BOTÕES SOCIAIS (Google, Apple)
  // ==========================================
  
  /**
   * Botões de login social
   * - Fundo branco com borda para destaque
   * - Mesmo tamanho dos botões primários
   */
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    ...(Platform.OS === 'web' && { cursor: 'pointer' }),
  },

  /** Texto dos botões sociais */
  socialButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
    ...(Platform.OS === 'web' && { userSelect: 'none' }),
  },

  // ==========================================
  // 📜 DISCLAIMER (Termos e Privacidade)
  // ==========================================
  
  /**
   * Texto de disclaimer no rodapé
   * - maxWidth garante legibilidade em telas grandes
   */
  disclaimer: {
    fontSize: 12,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 20,
    width: '85%',
    maxWidth: 400, // Limita largura para melhor leitura
  },

  /** Links clicáveis dentro do disclaimer */
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
