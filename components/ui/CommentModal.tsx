/**
 * ============================================
 * COMMENT MODAL - MODAL DE COMENTÁRIOS
 * ============================================
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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

  useEffect(() => {
    if (visible) {
      loadComments();
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
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Comentários</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Lista de comentários */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#20B2AA" />
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
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
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubble-outline" size={48} color="#CCC" />
                  <Text style={styles.emptyText}>Nenhum comentário ainda</Text>
                  <Text style={styles.emptySubtext}>Seja o primeiro a comentar!</Text>
                </View>
              }
              contentContainerStyle={styles.listContent}
            />
          )}

          {/* Input de comentário */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escreva um comentário..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#20B2AA',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
});
