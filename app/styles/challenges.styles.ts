/**
 * ============================================
 * CHALLENGES SCREEN STYLES
 * ============================================
 * 
 * Estilos profissionais para a tela de desafios diários
 * Segue o padrão de design do projeto:
 * - Background: #F0F8FF (Alice Blue)
 * - Cards: maxWidth 500px, borderRadius 20px
 * - Elevation: 5 e shadowRadius: 8
 * - Cores consistentes: #2F4F4F para títulos, #666 para texto secundário
 * 
 * @created 20 de outubro de 2025
 */

import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER PRINCIPAL
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Padrão do projeto (Alice Blue)
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  // ==========================================
  // STATS ROW
  // ==========================================
  statsRow: {
    width: '100%',
    maxWidth: 500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  levelBadge: {
    backgroundColor: '#007BFF', // Azul padrão do projeto
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexShrink: 0, // Não encolhe
  },

  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    flexShrink: 0, // Não encolhe, quebra linha se necessário
    // Sombra leve
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  statIcon: {
    fontSize: 16,
  },

  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F4F4F', // Cor padrão do projeto
    flexShrink: 0,
  },

  // ==========================================
  // CARD DE PROGRESSO
  // ==========================================
  progressCard: {
    width: '100%',
    maxWidth: 500, // Padrão do projeto
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Padrão do projeto
    padding: 20, // Padrão do projeto (25 é usado em alguns cards)
    marginBottom: 24,
    // Sombra padrão do projeto
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

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F4F4F', // Cor padrão de títulos
  },

  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981', // Verde de sucesso
  },

  progressSubtitle: {
    fontSize: 14,
    color: '#666', // Cor padrão de texto secundário do projeto
    marginBottom: 12,
  },

  progressBarContainer: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981', // Verde de sucesso
    borderRadius: 6,
  },

  allCompletedText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981', // Verde de sucesso
    textAlign: 'center',
  },

  // ==========================================
  // SEÇÃO DE DESAFIOS
  // ==========================================
  challengesSection: {
    width: '100%',
    maxWidth: 500, // Padrão do projeto
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F4F4F', // Cor padrão de títulos
  },

  invitesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    position: 'relative',
  },

  invitesButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },

  invitesBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  invitesBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // ==========================================
  // ESTADO VAZIO
  // ==========================================
  emptyState: {
    width: '100%',
    maxWidth: 500, // Padrão do projeto
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    // Sombra padrão
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

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2F4F4F', // Cor padrão de títulos
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#666', // Cor padrão de texto secundário
  },
  notificationContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
