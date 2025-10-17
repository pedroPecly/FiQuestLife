/**
 * ============================================
 * SETTINGS STYLES - Estilos da Tela de Configurações
 * ============================================
 * 
 * Estilos profissionais para a tela de configurações
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

  headerSimple: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F0F8FF',
  },

  backButton: {
    padding: 8,
    borderRadius: 8,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },

  headerSpacer: {
    width: 40,
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
  // SCROLL VIEW
  // ==========================================
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  // ==========================================
  // SECTION CARD (Padrão Card Branco)
  // ==========================================
  section: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
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

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 0.5,
    marginBottom: 16,
  },

  // ==========================================
  // DANGER ZONE CARD
  // ==========================================
  dangerSection: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFEBEE',
    borderRadius: 20,
    padding: 20,
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

  dangerMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },

  // ==========================================
  // LOGOUT BUTTON
  // ==========================================
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    gap: 12,
  },

  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
});
