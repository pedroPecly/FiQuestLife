/**
 * ============================================
 * CHALLENGE CARD STYLES
 * ============================================
 * 
 * Estilos para o componente ChallengeCard
 * Segue o padrão de design do projeto:
 * - BorderRadius: 20px nos cards principais
 * - Elevation: 5 e shadowRadius: 8
 * - Cores consistentes com o tema
 * 
 * @created 20 de outubro de 2025
 */

import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER PRINCIPAL
  // ==========================================
  container: {
    width: '100%',
    maxWidth: 500, // Segue padrão do projeto
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Padrão do projeto (não 16)
    padding: 20, // Padrão do projeto (não 16)
    marginBottom: 16,
    // Sombra padrão do projeto
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8, // Padrão do projeto (não 4)
    elevation: 5, // Padrão do projeto (não 3)
    position: 'relative',
    // Sombra nativa CSS para Web
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  completedContainer: {
    opacity: 0.8,
  },

  // ==========================================
  // HEADER (BADGES DE CATEGORIA E DIFICULDADE)
  // ==========================================
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  categoryIcon: {
    fontSize: 14,
  },

  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  difficultyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // ==========================================
  // CONTEÚDO (TÍTULO E DESCRIÇÃO)
  // ==========================================
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F4F4F', // Cor padrão de títulos do projeto
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#666', // Cor padrão de texto secundário do projeto
    lineHeight: 20,
    marginBottom: 16,
  },

  // ==========================================
  // RECOMPENSAS
  // ==========================================
  rewardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },

  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  rewardIcon: {
    fontSize: 16,
  },

  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F4F4F', // Cor consistente com o projeto
  },

  // ==========================================
  // BOTÃO DE COMPLETAR
  // ==========================================
  button: {
    backgroundColor: '#10B981', // Verde de sucesso
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  buttonCompleted: {
    backgroundColor: '#9CA3AF', // Cinza para disabled
  },

  buttonCompleting: {
    backgroundColor: '#059669', // Verde mais escuro durante loading
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // ==========================================
  // OVERLAY DE COMPLETADO
  // ==========================================
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Verde transparente
    borderRadius: 20, // Mesmo borderRadius do container
    pointerEvents: 'none',
  },
});
