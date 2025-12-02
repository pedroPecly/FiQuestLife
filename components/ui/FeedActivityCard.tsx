import { FeedActivity, FeedActivityType } from '@/services/feed';
import { feedInteractionsService } from '@/services/feedInteractions';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityRewardBadges } from './ActivityRewardBadges';
import { CommentModal } from './CommentModal';

const theme = {
  colors: {
    surface: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    primary: '#007AFF',
    warning: '#FF9500',
    success: '#34C759',
    error: '#FF3B30',
    info: '#5856D6',
  },
};

interface FeedActivityCardProps {
  activity: FeedActivity;
  onInteraction?: () => void; // Callback para recarregar stats após interação
  isHighlighted?: boolean; // Indica se o card deve ser destacado visualmente
  openCommentsOnMount?: boolean; // Abre modal de comentários ao montar (para notificações de comentário)
}

const getActivityIcon = (type: FeedActivityType) => {
  switch (type) {
    case 'CHALLENGE_COMPLETED':
      return <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />;
    case 'BADGE_EARNED':
      return <MaterialCommunityIcons name="medal" size={24} color={theme.colors.warning} />;
    case 'LEVEL_UP':
      return <MaterialCommunityIcons name="arrow-up-bold" size={24} color={theme.colors.info} />;
    case 'STREAK_MILESTONE':
      return <MaterialIcons name="local-fire-department" size={24} color={theme.colors.error} />;
  }
};

const getActivityColor = (type: FeedActivityType) => {
  switch (type) {
    case 'CHALLENGE_COMPLETED':
      return theme.colors.success + '15';
    case 'BADGE_EARNED':
      return theme.colors.warning + '15';
    case 'LEVEL_UP':
      return theme.colors.info + '15';
    case 'STREAK_MILESTONE':
      return theme.colors.error + '15';
  }
};

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'agora mesmo';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm atrás';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h atrás';
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd atrás';
  return Math.floor(seconds / 604800) + 'sem atrás';
};

const getCategoryEmoji = (category: string): string => {
  const map: Record<string, string> = {
    PHYSICAL_ACTIVITY: '💪', NUTRITION: '🥗', HYDRATION: '💧', SLEEP: '😴',
    MENTAL_HEALTH: '🧠', SOCIAL: '🤝', PRODUCTIVITY: '📚',
  };
  return map[category] || '✨';
};

const getRarityColor = (rarity: string): string => {
  const map: Record<string, string> = {
    COMMON: theme.colors.textSecondary, RARE: theme.colors.info,
    EPIC: '#9333EA', LEGENDARY: theme.colors.warning,
  };
  return map[rarity] || theme.colors.textSecondary;
};

export const FeedActivityCard: React.FC<FeedActivityCardProps> = ({ activity, onInteraction, isHighlighted = false, openCommentsOnMount = false }) => {
  const [liked, setLiked] = useState(activity.isLikedByUser || false);
  const [likesCount, setLikesCount] = useState(activity.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(activity.commentsCount || 0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [liking, setLiking] = useState(false);
  
  // Verifica se é um desafio vindo de convite
  const isFromInvitation = activity.type === 'CHALLENGE_COMPLETED' && activity.invitedBy;
  
  // Sincronizar estado quando activity prop mudar (após refreshStats)
  useEffect(() => {
    setLiked(activity.isLikedByUser || false);
    setLikesCount(activity.likesCount || 0);
    setCommentsCount(activity.commentsCount || 0);
  }, [activity.isLikedByUser, activity.likesCount, activity.commentsCount]);

  // Abre modal de comentários automaticamente se solicitado (para notificações de comentário)
  useEffect(() => {
    if (openCommentsOnMount && isHighlighted) {
      // Pequeno delay para garantir que o scroll aconteceu primeiro
      setTimeout(() => {
        setShowCommentModal(true);
      }, 800);
    }
  }, [openCommentsOnMount, isHighlighted]);
  
  const handleLike = async () => {
    if (liking) return;
    
    setLiking(true);
    const previousLiked = liked;
    const previousCount = likesCount;
    
    // Otimistic update
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    
    const result = await feedInteractionsService.toggleLike(activity.id);
    
    if (!result.success) {
      // Revert on error
      setLiked(previousLiked);
      setLikesCount(previousCount);
    } else {
      // Notificar para recarregar stats do servidor
      onInteraction?.();
    }
    
    setLiking(false);
  };

  const metaText = (() => {
    if (!activity.metadata) return '';
    const m = String(activity.metadata);
    if (activity.type === 'CHALLENGE_COMPLETED') {
      return getCategoryEmoji(m) + ' ' + m.replace(/_/g, ' ');
    }
    if (activity.type === 'BADGE_EARNED') {
      return '⭐ ' + m;
    }
    if (activity.type === 'LEVEL_UP') {
      return '🎯 Nível ' + m;
    }
    if (activity.type === 'STREAK_MILESTONE') {
      return '🔥 ' + m + ' dias';
    }
    return '';
  })();
  
  const metaColor = activity.type === 'BADGE_EARNED' && activity.metadata 
    ? getRarityColor(String(activity.metadata)) 
    : theme.colors.textSecondary;
    
  const xp = activity.xpReward || 0;
  const coins = activity.coinsReward || 0;
  const bgColor = getActivityColor(activity.type);

  return (
    <View style={[
      styles.container,
      isHighlighted && styles.highlighted,
      isFromInvitation && styles.invitationCard,
    ]}>
      <View style={[
        styles.colorStrip, 
        { backgroundColor: isFromInvitation ? '#FF6B35' : bgColor }
      ]} />
      <View style={styles.iconBadge}>{getActivityIcon(activity.type)}</View>
      <View style={styles.content}>
        <TouchableOpacity 
          onPress={() => router.push(`/user-profile?userId=${activity.userId}` as any)} 
          style={styles.userRow}
          activeOpacity={0.7}
        >
          {activity.avatarUrl ? (
            <Image source={{ uri: activity.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialIcons name="person" size={20} color={theme.colors.textSecondary} />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{String(activity.name)}</Text>
            <Text style={styles.timeAgo}>{getTimeAgo(activity.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        
        {/* Badge de "Desafiado por X" */}
        {isFromInvitation && activity.invitedBy && (
          <View style={styles.invitationBadge}>
            <Ionicons name="trophy" size={16} color="#FF6B35" />
            <Text style={styles.invitationText}>
              Desafiado por <Text style={styles.invitationName}>@{activity.invitedBy.username}</Text>
            </Text>
          </View>
        )}
        
        <Text style={styles.description}>{String(activity.description)}</Text>
        {metaText.length > 0 && (
          <Text style={[styles.metadata, { color: metaColor }]}>{metaText}</Text>
        )}
        
        {/* Foto do desafio (se houver) */}
        {activity.photoUrl && (
          <View style={styles.photoContainer}>
            <Image 
              source={{ uri: activity.photoUrl }} 
              style={styles.challengePhoto} 
              resizeMode="cover"
            />
            {activity.caption && (
              <Text style={styles.photoCaption}>{activity.caption}</Text>
            )}
          </View>
        )}
        
        {/* Badges de recompensas (XP e FiCoins) */}
        {(xp > 0 || coins > 0) && (
          <ActivityRewardBadges xp={xp} coins={coins} size="small" />
        )}
        
        {/* Botões de interação */}
        <View style={styles.interactionRow}>
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={liked ? "heart" : "heart-outline"} 
              size={20} 
              color={liked ? "#FF3B30" : theme.colors.textSecondary} 
            />
            {likesCount > 0 && (
              <Text style={[styles.interactionText, liked && styles.likedText]}>
                {likesCount}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.interactionButton}
            onPress={() => setShowCommentModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="chatbubble-outline" 
              size={20} 
              color={theme.colors.textSecondary} 
            />
            {commentsCount > 0 && (
              <Text style={styles.interactionText}>
                {commentsCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Modal de comentários */}
      <CommentModal
        visible={showCommentModal}
        activityId={activity.id}
        onClose={() => {
          setShowCommentModal(false);
        }}
        onCommentAdded={() => {
          // Incrementar contagem quando adiciona comentário
          setCommentsCount(prev => prev + 1);
          // Notificar para recarregar stats do servidor
          onInteraction?.();
        }}
        onCommentDeleted={() => {
          // Decrementar contagem quando deleta comentário
          setCommentsCount(prev => Math.max(0, prev - 1));
          // Notificar para recarregar stats do servidor
          onInteraction?.();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  highlighted: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primary + '08', // Azul translúcido
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  invitationCard: {
    borderColor: '#FF6B35',
    borderWidth: 2,
    backgroundColor: '#FFF5F2',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  colorStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  invitationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#FF6B35',
    alignSelf: 'flex-start',
  },
  invitationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  invitationName: {
    color: '#FF6B35',
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  metadata: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  photoContainer: {
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  challengePhoto: {
    width: '100%',
    height: 250,
    backgroundColor: '#F5F5F5',
  },
  photoCaption: {
    fontSize: 14,
    color: theme.colors.text,
    padding: 12,
    backgroundColor: '#FAFAFA',
    lineHeight: 20,
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 16,
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interactionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  likedText: {
    color: '#FF3B30',
  },
});
