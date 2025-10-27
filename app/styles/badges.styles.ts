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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },

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
    maxHeight: '80%',
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },

  modalIconEmoji: {
    fontSize: 60,
  },

  // ==========================================
  // MODAL TEXT
  // ==========================================
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },

  modalRarityBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },

  modalRarityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  modalDescription: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
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
    gap: 8,
    backgroundColor: '#D1FAE5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },

  modalEarnedText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },

  // ==========================================
  // MODAL PROGRESS
  // ==========================================
  modalProgressSection: {
    marginTop: 8,
  },

  modalProgressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },

  modalProgressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 12,
  },

  modalProgressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },

  modalProgressBarFill: {
    height: '100%',
    borderRadius: 6,
  },

  modalProgressHint: {
    fontSize: 13,
    color: '#8B5CF6',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
