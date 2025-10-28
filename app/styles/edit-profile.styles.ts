/**
 * ============================================
 * EDIT PROFILE STYLES - Estilos da Edição de Perfil
 * ============================================
 * 
 * Estilos profissionais para a tela de edição de perfil
 * Seguindo o padrão de cards brancos com sombra das outras telas
 * 
 * @created 17 de outubro de 2025
 */

import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },

  // ==========================================
  // HEADER
  // ==========================================
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  backButton: {
    padding: 8,
    borderRadius: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  headerSpacer: {
    width: 40,
  },

  // Header Simples (sem botão voltar, sem fundo)
  headerSimple: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // ==========================================
  // LOADING
  // ==========================================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },

  // ==========================================
  // KEYBOARD VIEW & SCROLL
  // ==========================================
  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  // ==========================================
  // AVATAR CARD (Padrão Card Branco)
  // ==========================================
  avatarSection: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  removeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFEBEE',
  },

  removeAvatarText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },

  // ==========================================
  // FORM CARD (Padrão Card Branco)
  // ==========================================
  formSection: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  inputGroup: {
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#F44336',
  },

  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: '#999',
  },

  // ==========================================
  // INFO BOX
  // ==========================================
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    marginTop: 8,
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },

  // ==========================================
  // ACTION BUTTONS
  // ==========================================
  actionButtons: {
    width: '100%',
    maxWidth: 500,
    marginTop: 8,
  },

  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
