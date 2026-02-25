/**
 * ============================================
 * BADGES STYLES - Estilos da Galeria de Badges
 * ============================================
 * 
 * Estilos profissionais para a tela de badges/conquistas
 * Seguindo o padrão do app com cards brancos e sombras
 * 
 * @created 27 de outubro de 2025
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },

  // ==========================================
  // HEADER
  // ==========================================
  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },

  headerContent: {},

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  notificationContainer: {},

  // ==========================================
  // FILTERS
  // ==========================================
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  filterButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },

  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  // ==========================================
  // GRID
  // ==========================================
  gridContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },

  badgeCardWrapper: {
    width: '50%',
  },

  // ==========================================
  // EMPTY STATE
  // ==========================================
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // ==========================================
  // MODAL
  // ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    height: 600,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },

  // ==========================================
  // MODAL BADGE ICON
  // ==========================================
  modalIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 24,
    borderWidth: 4,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  modalIconEmoji: {
    fontSize: 70,
  },

  // ==========================================
  // MODAL TEXT
  // ==========================================
  modalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },

  modalRarityBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  modalRarityText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  modalDescription: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 8,
  },

  // ==========================================
  // MODAL INFO SECTION
  // ==========================================
  modalInfoSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  modalInfoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  modalInfoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },

  // ==========================================
  // MODAL EARNED
  // ==========================================
  modalEarnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#D1FAE5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  modalEarnedText: {
    fontSize: 15,
    color: '#059669',
    fontWeight: '700',
  },

  // ==========================================
  // MODAL PROGRESS
  // ==========================================
  modalProgressSection: {
    marginTop: 8,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  modalProgressTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },

  modalProgressText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 14,
  },

  modalProgressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },

  modalProgressBarFill: {
    height: '100%',
    borderRadius: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  modalProgressHint: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    textAlign: 'center',
  },
});
