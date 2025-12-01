/**
 * ============================================
 * COMMENT MODAL - MODAL DE COMENTÁRIOS
 * ============================================
 * 
 * Modal otimizada com KeyboardAwareScrollView para:
 * - Teclado que move conteúdo automaticamente
 * - Safe Area nativa Android/iOS
 * - Performance e simplicidade
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedComment, feedInteractionsService } from '../../services/feedInteractions';
import { Avatar } from './Avatar';

interface CommentModalProps {
  visible: boolean;
  activityId: string;
  onClose: () => void;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

export function CommentModal({ visible, activityId, onClose, onCommentAdded, onCommentDeleted }: CommentModalProps) {
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      loadComments();
    } else {
      // Limpar estado ao fechar
      setNewComment('');
      Keyboard.dismiss();
    }
  }, [visible, activityId]);

  const loadComments = async () => {
    setLoading(true);
    const result = await feedInteractionsService.getComments(activityId);
    if (result.success && result.data) {
      setComments(result.data);
    }
    setLoading(false);
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || sending) return;

    setSending(true);
    const result = await feedInteractionsService.addComment(activityId, newComment.trim());
    
    if (result.success && result.data) {
      setComments([...comments, result.data]);
      setNewComment('');
      onCommentAdded?.(); // Notificar pai que adicionou comentário
    } else {
      // Tratar erro de comentário duplicado de forma profissional
      if (result.error?.includes('já comentou')) {
        Alert.alert(
          'Apenas 1 Comentário Permitido',
          'Você já comentou nesta atividade. Apenas um comentário por pessoa é permitido.',
          [{ text: 'Entendi', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Erro ao Comentar',
          result.error || 'Não foi possível adicionar o comentário. Tente novamente.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    }
    
    setSending(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    const result = await feedInteractionsService.deleteComment(commentId);
    if (result.success) {
      setComments(comments.filter((c) => c.id !== commentId));
      onCommentDeleted?.(); // Notificar pai que deletou comentário
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.flex}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            style={styles.modalContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Comentários</Text>
              <TouchableOpacity 
                onPress={onClose} 
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Conteúdo Scrollável */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#20B2AA" />
                </View>
              ) : comments.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubble-outline" size={48} color="#CCC" />
                  <Text style={styles.emptyText}>Nenhum comentário ainda</Text>
                  <Text style={styles.emptySubtext}>Seja o primeiro a comentar!</Text>
                </View>
              ) : (
                comments.map((item) => (
                  <View key={item.id} style={styles.commentItem}>
                    <Avatar
                      imageUrl={item.user.avatarUrl}
                      initials={item.user.name.substring(0, 2)}
                      size={40}
                    />
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>{item.user.name}</Text>
                        <Text style={styles.commentTime}>
                          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        </Text>
                      </View>
                      <Text style={styles.commentText}>{item.content}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Input de comentário - fixo no bottom */}
            <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom - 8, 8) }]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Escreva um comentário..."
                placeholderTextColor="#999"
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={500}
                returnKeyType="send"
                blurOnSubmit={false}
                onSubmitEditing={handleSendComment}
              />
              <TouchableOpacity
                style={[styles.sendButton, (!newComment.trim() || sending) && styles.sendButtonDisabled]}
                onPress={handleSendComment}
                disabled={!newComment.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Ionicons name="send" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 4,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    maxHeight: 100,
    fontSize: 14,
    color: '#1A1A1A',
  },
  sendButton: {
    backgroundColor: '#20B2AA',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
});