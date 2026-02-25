import { useAlert } from '@/hooks/useAlert';
import {
    CATEGORY_COLORS,
    CATEGORY_ICONS,
    CATEGORY_LABELS,
    DIFFICULTY_COLORS,
    DIFFICULTY_LABELS,
    UserChallenge,
} from '@/services/challenge';
import { createChallengeInvite } from '@/services/challengeInvitation';
import MultiTrackerService from '@/services/multiTracker';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhotoCaptureModal from './PhotoCaptureModal';
import { SelectFriendModal } from './SelectFriendModal';
import { StepCounterWidget } from './StepCounterWidget';

interface ChallengeCardProps {
  userChallenge: UserChallenge;
  onComplete: (id: string, photo?: { uri: string; type: string; name: string }, caption?: string) => void;
  isCompleting?: boolean;
  alreadyUsedToChallenge?: boolean;
  onInviteSent?: () => void;
  /**
   * Valor atual do sensor de saúde (passos ou metros) vindo do ActivitySyncService.
   * Quando presente, substitui o valor persistido no banco para exibição em tempo real.
   */
  activityCurrentValue?: number;
}

export default function ChallengeCard({
  userChallenge,
  onComplete,
  isCompleting = false,
  alreadyUsedToChallenge = false,
  onInviteSent,
  activityCurrentValue,
}: ChallengeCardProps) {
  const { challenge, status, id, challengeInvitation } = userChallenge;
  const isCompleted = status === 'COMPLETED';
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [hasActiveSession, setHasActiveSession] = useState(false); // Indica se há sessão (ativa ou pausada)
  const { alert } = useAlert();

  // Para desafios com rastreamento
  const hasTracking = challenge.trackingType && challenge.targetValue && challenge.targetUnit;

  /**
   * Desafios de PASSOS e DISTÂNCIA são auto-rastreados:
   * os dados vêm automaticamente do app nativo de saúde (iOS/Android).
   * Eles não precisam que o usuário pressione "Iniciar".
   */
  const isAutoTracked =
    challenge.trackingType === 'STEPS' || challenge.trackingType === 'DISTANCE';

  // Verifica status de rastreamento
  useEffect(() => {
    const checkTrackingStatus = () => {
      const session = MultiTrackerService.getSession(id);
      if (session) {
        // isTracking = true apenas se NÃO estiver pausado
        const isActive = !session.isPaused;
        setIsTracking(isActive);
        setTrackingProgress(session.currentValue);
        setHasActiveSession(true); // Há uma sessão ativa (mesmo que pausada)
        
        // Se completou, auto-finalizar
        if (session.completed && !isCompleted) {
          onComplete(id);
        }
      } else {
        setIsTracking(false);
        setTrackingProgress(0);
        setHasActiveSession(false); // Não há sessão
      }
    };

    checkTrackingStatus();

    // Subscribe para updates do MultiTracker
    const unsubscribe = MultiTrackerService.addListener(() => {
      checkTrackingStatus();
    });

    return unsubscribe;
  }, [id, isCompleted, onComplete]);

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


  const handleToggleTracking = async () => {
    const session = MultiTrackerService.getSession(id);
    
    if (session?.isPaused) {
      // Se está pausado, retomar
      await MultiTrackerService.resumeTracking(id);
      alert.info('Rastreamento retomado', 'Continue de onde parou!');
    } else if (isTracking) {
      // Se está ativo, pausar
      await MultiTrackerService.pauseTracking(id);
      alert.info('Rastreamento pausado', 'Seu progresso foi salvo');
    } else {
      // Se não iniciou, iniciar
      try {
        await MultiTrackerService.startTracking({
          challengeId: challenge.id,
          userChallengeId: id,
          trackingType: challenge.trackingType!,
          targetValue: challenge.targetValue!,
          targetUnit: challenge.targetUnit!,
        });
        alert.success('Rastreamento iniciado!', 'Continue com suas atividades normalmente');
      } catch (error: any) {
        alert.error('Erro', error.message || 'Não foi possível iniciar o rastreamento');
      }
    }
  };

  const handleChallengeFriend = async (friendId: string, friendName: string) => {
    setSendingInvite(true);
    try {
      await createChallengeInvite({
        challengeId: challenge.id,
        toUserId: friendId,
      });
      alert.success('Convite enviado!', `${friendName} foi desafiado! 🎯`);
      setShowFriendModal(false);
      // Notifica o pai para atualizar a lista de desafios usados
      if (onInviteSent) {
        onInviteSent();
      }
    } catch (error: any) {
      alert.error('Erro', error.message || 'Não foi possível enviar o convite');
    } finally {
      setSendingInvite(false);
    }
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

          {/* Badge de desafio recebido de amigo - ao lado da dificuldade */}
          {challengeInvitation && (
            <View style={styles.inviteBadge}>
              <Ionicons name="people" size={14} color="#20B2AA" />
              <Text style={styles.inviteBadgeText}>Desafio de {challengeInvitation.fromUser.name}</Text>
            </View>
          )}
        </View>

        {/* Título e descrição */}
        <Text style={styles.title} numberOfLines={2}>{challenge.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{challenge.description}</Text>

        {/* Badge de foto obrigatória */}
        {challenge.requiresPhoto && (
          <View style={styles.photoBadge}>
            <Text style={styles.photoBadgeText}>📸 Foto obrigatória</Text>
          </View>
        )}

        {/* Widget de progresso para atividades rastreadas */}
        {hasTracking && !isCompleted && (
          <StepCounterWidget
            trackingType={challenge.trackingType!}
            currentValue={
              // 1ª prioridade: há sessão ativa no MultiTracker (manual ou timer)
              // `hasActiveSession` cobre tanto recém-iniciada (value=0) quanto em progresso
              hasActiveSession
                ? trackingProgress
                // 2ª prioridade: valor em tempo real do health app nativo (STEPS / DISTANCE apenas)
                // DURATION nunca vem do health app — é sempre rastreamento manual
                : activityCurrentValue !== undefined && challenge.trackingType !== 'DURATION'
                  ? activityCurrentValue
                  // 3ª prioridade: valor persistido no banco de dados
                  : (userChallenge.steps ?? userChallenge.distance ?? userChallenge.duration ?? 0)
            }
            targetValue={challenge.targetValue!}
            targetUnit={challenge.targetUnit!}
          />
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

        {/* Botões de ação */}
        <View style={styles.actionsContainer}>
          {/* DESAFIOS AUTO-RASTREADOS (PASSOS / DISTÂNCIA):
              Dados vêm automaticamente do app de saúde nativo — sem ação do usuário.
          */}
          {hasTracking && !isCompleted && isAutoTracked && (
            <View style={styles.autoSyncBadge}>
              <Ionicons name="sync" size={14} color="#10B981" />
              <Text style={styles.autoSyncText}>Sincronizado automaticamente</Text>
            </View>
          )}

          {/* DESAFIOS COM TRACKING MANUAL (ex: DURATION / corrida GPS)
              Esses ainda precisam que o usuário pressione Iniciar.
          */}
          {hasTracking && !isCompleted && !isAutoTracked && (
            <TouchableOpacity
              style={[
                styles.button,
                isTracking ? styles.trackingActiveButton : styles.trackingButton
              ]}
              onPress={handleToggleTracking}
            >
              <Ionicons
                name={
                  hasActiveSession && !isTracking
                    ? 'play-circle'   // Pausado → mostrar play
                    : isTracking
                      ? 'pause-circle' // Ativo → mostrar pause
                      : 'play-circle'  // Não iniciado → mostrar play
                }
                size={20}
                color="#FFF"
              />
              <Text style={styles.buttonText}>
                {hasActiveSession && !isTracking ? 'Continuar' : isTracking ? 'Pausar' : 'Iniciar'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Botão de completar - esconde para desafios auto-verificáveis e com tracking */}
          {!challenge.autoVerifiable && !hasTracking && (
            <TouchableOpacity
              style={[
                styles.button,
                isCompleted && styles.buttonCompleted,
                isCompleting && styles.buttonCompleting,
                !isCompleted && styles.buttonPrimary,
              ]}
              onPress={handleComplete}
              disabled={isCompleted || isCompleting}
            >
              {isCompleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isCompleted ? '✓ Concluído' : 'Completar Desafio'}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {/* Badge para desafios auto-verificáveis (exceto os com tracking) */}
          {challenge.autoVerifiable && !hasTracking && (
            <View style={styles.autoVerifyBadge}>
              <Text style={styles.autoVerifyText}>Completa automaticamente</Text>
            </View>
          )}

          {/* Botão de desafiar amigo */}
          <TouchableOpacity
            style={[
              styles.challengeButton,
              (sendingInvite || alreadyUsedToChallenge) && styles.buttonDisabled,
              alreadyUsedToChallenge && styles.challengeButtonUsed,
            ]}
            onPress={() => setShowFriendModal(true)}
            disabled={sendingInvite || alreadyUsedToChallenge}
          >
            {sendingInvite ? (
              <ActivityIndicator size="small" color="#20B2AA" />
            ) : alreadyUsedToChallenge ? (
              <Ionicons name="checkmark-done" size={20} color="#999" />
            ) : (
              <Ionicons name="person-add" size={20} color="#20B2AA" />
            )}
          </TouchableOpacity>
        </View>

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

      {/* Modal de seleção de amigo */}
      <SelectFriendModal
        visible={showFriendModal}
        onClose={() => setShowFriendModal(false)}
        onSelectFriend={handleChallengeFriend}
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
  inviteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    gap: 4,
    marginLeft: 8,
  },
  inviteBadgeText: {
    color: '#FF6B35',
    fontSize: 11,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap', // Permite quebra se necessário
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    flexShrink: 0, // Não encolhe
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
    flexShrink: 0, // Não encolhe
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
    flexShrink: 1, // Permite encolher
  },
  description: {
    fontSize: 14,
    color: '#666', // Cor padrão do projeto
    lineHeight: 20,
    marginBottom: 16,
    flexShrink: 1, // Permite encolher
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
    marginTop: 12,
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
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  autoVerifyBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  autoVerifyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  // Badge exibido em desafios de passos/distância (auto-sincronizados)
  autoSyncBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  autoSyncText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  button: {
    flex: 1,
    backgroundColor: '#9CA3AF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: '#10B981',
  },
  trackingButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    gap: 8,
  },
  trackingActiveButton: {
    backgroundColor: '#FF9500',
    flexDirection: 'row',
    gap: 8,
  },
  buttonCompleted: {
    backgroundColor: '#9CA3AF',
  },
  buttonCompleting: {
    backgroundColor: '#059669',
  },
  challengeButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#20B2AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeButtonUsed: {
    backgroundColor: '#F0F0F0',
    borderColor: '#CCC',
  },
  buttonDisabled: {
    opacity: 0.5,
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
