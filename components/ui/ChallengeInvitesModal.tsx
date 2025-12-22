/**
 * ============================================
 * CHALLENGE INVITES MODAL
 * ============================================
 * 
 * Modal para gerenciar convites de desafios recebidos
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    acceptChallengeInvite,
    ChallengeInvitation,
    getPendingInvites,
    rejectChallengeInvite,
} from '../../services/challengeInvitation';
import { getTimeUntilExpiration, isInvitationExpired } from '../../utils/invitationUtils';
import { Avatar } from './Avatar';

interface ChallengeInvitesModalProps {
  visible: boolean;
  onClose: () => void;
  onInviteProcessed?: () => void;
}

export function ChallengeInvitesModal({
  visible,
  onClose,
  onInviteProcessed,
}: ChallengeInvitesModalProps) {
  const insets = useSafeAreaInsets();
  const [invites, setInvites] = useState<ChallengeInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadInvites();
    }
  }, [visible]);

  const loadInvites = async () => {
    setLoading(true);
    try {
      const result = await getPendingInvites();
      setInvites(result);
    } catch (error: any) {
      console.error('Erro ao carregar convites:', error);
      Alert.alert('Erro', 'Não foi possível carregar os convites');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (inviteId: string) => {
    setProcessingId(inviteId);
    try {
      await acceptChallengeInvite(inviteId);
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      onInviteProcessed?.();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível aceitar o convite');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (inviteId: string) => {
    setProcessingId(inviteId);
    try {
      await rejectChallengeInvite(inviteId);
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      onInviteProcessed?.();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível rejeitar o convite');
    } finally {
      setProcessingId(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return '#4CAF50';
      case 'MEDIUM':
        return '#FF9800';
      case 'HARD':
        return '#F44336';
      case 'EXPERT':
        return '#9C27B0';
      default:
        return '#999';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'Fácil';
      case 'MEDIUM':
        return 'Médio';
      case 'HARD':
        return 'Difícil';
      case 'EXPERT':
        return 'Expert';
      default:
        return difficulty;
    }
  };

  const renderInviteItem = ({ item }: { item: ChallengeInvitation }) => {
    const isProcessing = processingId === item.id;
    const timeLeft = getTimeUntilExpiration(item);
    const isExpired = isInvitationExpired(item);

    return (
      <View style={[styles.inviteCard, isExpired && styles.inviteCardExpired]}>
        {/* Quem desafiou */}
        <View style={styles.inviteHeader}>
          <Avatar
            imageUrl={item.fromUser?.avatarUrl || null}
            initials={item.fromUser?.name.substring(0, 2) || '??'}
            size={40}
          />
          <View style={styles.inviteHeaderText}>
            <Text style={styles.challengerName}>{item.fromUser?.name}</Text>
            <Text style={styles.challengerAction}>te desafiou em</Text>
          </View>
          
          {/* Indicador de tempo de expiração */}
          <View style={[styles.expirationBadge, isExpired && styles.expirationBadgeExpired]}>
            <Ionicons 
              name={isExpired ? "close-circle" : "time-outline"} 
              size={14} 
              color={isExpired ? "#F44336" : "#FF9800"} 
            />
            <Text style={[styles.expirationText, isExpired && styles.expirationTextExpired]}>
              {timeLeft}
            </Text>
          </View>
        </View>

        {/* Informações do desafio */}
        <View style={styles.challengeInfo}>
          <Text style={styles.challengeTitle}>{item.challenge.title}</Text>
          <Text style={styles.challengeDescription} numberOfLines={2}>
            {item.challenge.description}
          </Text>

          <View style={styles.challengeMeta}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(item.challenge.difficulty) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(item.challenge.difficulty) },
                ]}
              >
                {getDifficultyLabel(item.challenge.difficulty)}
              </Text>
            </View>

            <View style={styles.rewardsContainer}>
              <View style={styles.rewardItem}>
                <Ionicons name="flash" size={14} color="#FFD700" />
                <Text style={styles.rewardText}>{item.challenge.xpReward} XP</Text>
              </View>
              <View style={styles.rewardItem}>
                <Ionicons name="logo-bitcoin" size={14} color="#FF9800" />
                <Text style={styles.rewardText}>{item.challenge.coinsReward}</Text>
              </View>
            </View>
          </View>

          {item.message && (
            <View style={styles.messageContainer}>
              <Ionicons name="chatbubble-outline" size={14} color="#666" />
              <Text style={styles.messageText}>{item.message}</Text>
            </View>
          )}
        </View>

        {/* Ações */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.rejectButton, isProcessing && styles.buttonDisabled]}
            onPress={() => handleReject(item.id)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#F44336" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#F44336" />
                <Text style={styles.rejectButtonText}>Recusar</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.acceptButton, isProcessing && styles.buttonDisabled]}
            onPress={() => handleAccept(item.id)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
                <Text style={styles.acceptButtonText}>Aceitar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
            <Text style={styles.title}>Convites de Desafios</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#20B2AA" />
            </View>
          ) : invites.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>Nenhum convite pendente</Text>
              <Text style={styles.emptySubtext}>
                Quando seus amigos te desafiarem, os convites aparecerão aqui!
              </Text>
            </View>
          ) : (
            <FlatList
              data={invites}
              renderItem={renderInviteItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    minHeight: 300,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  inviteCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#20B2AA',
  },
  inviteCardExpired: {
    opacity: 0.6,
    borderColor: '#CCC',
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  expirationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    marginLeft: 'auto',
  },
  expirationBadgeExpired: {
    backgroundColor: '#FFEBEE',
  },
  expirationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9800',
  },
  expirationTextExpired: {
    color: '#F44336',
  },
  inviteHeaderText: {
    marginLeft: 12,
  },
  challengerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  challengerAction: {
    fontSize: 14,
    color: '#666',
  },
  challengeInfo: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  challengeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rewardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#20B2AA',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
