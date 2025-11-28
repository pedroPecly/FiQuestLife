import {
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    CATEGORY_LABELS,
    DIFFICULTY_COLORS,
    DIFFICULTY_LABELS,
    UserChallenge,
} from '@/services/challenge';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhotoCaptureModal from './PhotoCaptureModal';

interface ChallengeCardProps {
  userChallenge: UserChallenge;
  onComplete: (id: string, photo?: { uri: string; type: string; name: string }, caption?: string) => void;
  isCompleting?: boolean;
}

export default function ChallengeCard({
  userChallenge,
  onComplete,
  isCompleting = false,
}: ChallengeCardProps) {
  const { challenge, status, id } = userChallenge;
  const isCompleted = status === 'COMPLETED';
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const categoryColor = CATEGORY_COLORS[challenge.category];
  const categoryLabel = CATEGORY_LABELS[challenge.category];
  const categoryIcon = CATEGORY_ICONS[challenge.category];

  const difficultyColor = DIFFICULTY_COLORS[challenge.difficulty];
  const difficultyLabel = DIFFICULTY_LABELS[challenge.difficulty];

  const handleComplete = () => {
    // Se requer foto, mostrar modal
    if (challenge.requiresPhoto) {
      setShowPhotoModal(true);
    } else {
      // Se não requer foto, completar direto
      onComplete(id);
    }
  };

  const handlePhotoSubmit = (photo: { uri: string; type: string; name: string }, caption?: string) => {
    setShowPhotoModal(false);
    onComplete(id, photo, caption);
  };

  return (
    <>
      <View style={[styles.container, isCompleted && styles.completedContainer]}>
        {/* Header com categorias e dificuldade */}
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.categoryIcon}>{categoryIcon}</Text>
            <Text style={styles.categoryText}>{categoryLabel}</Text>
          </View>

          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
            <Text style={styles.difficultyText}>{difficultyLabel}</Text>
          </View>
        </View>

        {/* Título e descrição */}
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description}>{challenge.description}</Text>

        {/* Badge de foto obrigatória */}
        {challenge.requiresPhoto && !isCompleted && (
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>📸 Foto obrigatória</Text>
          </View>
        )}

        {/* Recompensas */}
        <View style={styles.rewardsRow}>
          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>⭐</Text>
            <Text style={styles.rewardText}>{challenge.xpReward} XP</Text>
          </View>

          <View style={styles.rewardItem}>
            <Text style={styles.rewardIcon}>💰</Text>
              <Text style={styles.rewardText}>{challenge.coinsReward} FiCoins</Text>
          </View>
        </View>

        {/* Botão de completar */}
        <TouchableOpacity
          style={[
            styles.button,
            isCompleted && styles.buttonCompleted,
            isCompleting && styles.buttonCompleting,
          ]}
          onPress={handleComplete}
          disabled={isCompleted || isCompleting}
        >
          {isCompleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isCompleted
                ? '✓ Concluído'
                : challenge.requiresPhoto
                  ? '📸 Adicionar Foto'
                  : 'Concluir Desafio'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Overlay de completado */}
        {isCompleted && <View style={styles.completedOverlay} />}
      </View>

      {/* Modal de captura de foto */}
      <PhotoCaptureModal
        visible={showPhotoModal}
        challengeTitle={challenge.title}
        onClose={() => setShowPhotoModal(false)}
        onSubmit={handlePhotoSubmit}
        isSubmitting={isCompleting}
      />
    </>
  );
}

// ==========================================
// ESTILOS (Seguindo padrão do projeto)
// ==========================================
const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 500, // Padrão do projeto
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Padrão do projeto
    padding: 20, // Padrão do projeto
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8, // Padrão do projeto
    elevation: 5, // Padrão do projeto
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  completedContainer: {
    opacity: 0.8,
  },
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2F4F4F', // Cor padrão do projeto
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666', // Cor padrão do projeto
    lineHeight: 20,
    marginBottom: 16,
  },
  photoBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  photoBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
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
    color: '#2F4F4F', // Cor padrão do projeto
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonCompleted: {
    backgroundColor: '#9CA3AF',
  },
  buttonCompleting: {
    backgroundColor: '#059669',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 20, // Mesmo borderRadius do container
    pointerEvents: 'none',
  },
});
