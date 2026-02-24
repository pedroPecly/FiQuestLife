/**
 * ============================================
 * IMAGE VIEWER MODAL
 * ============================================
 *
 * Abre uma imagem em tela cheia com overlay escuro,
 * botão de fechar e gesto de tap para dispensar.
 * Igual ao comportamento padrão de redes sociais.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ImageViewerModalProps {
  visible: boolean;
  imageUrl: string | null | undefined;
  /** Usado como fallback quando não há imageUrl */
  initials?: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  imageUrl,
  initials,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
      scaleAnim.setValue(0.85);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.97)" />

      {/* Overlay escuro — toque fora fecha */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          {/* Bloco central — impede que o toque NA imagem feche o modal */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.imageWrapper,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                /* Fallback: círculo com iniciais quando não há foto */
                <View style={styles.fallbackContainer}>
                  <Text style={styles.fallbackText}>
                    {(initials ?? '?').substring(0, 2).toUpperCase()}
                  </Text>
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>

          {/* Botão fechar */}
          <TouchableOpacity
            style={[styles.closeButton, { top: insets.top + 12 }]}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <View style={styles.closeButtonInner}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
  fallbackContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#20B2AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  closeButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
