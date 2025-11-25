import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/*
  Pequenas configurações padrão e fallbacks
  - keyboardMargin: espaço extra entre modal e teclado
  - maxTranslateRatio: quanto do alto da tela o modal pode subir (cap)
  - FALLBACK_KEYBOARD_HEIGHT: valor seguro caso a API do teclado não retorne altura
*/
const DEFAULT_KEYBOARD_MARGIN = 6;
// Aumentado levemente para permitir que o modal suba um pouco mais quando necessário.
const DEFAULT_MAX_TRANSLATE_RATIO = 0.24; // ajuste fino: subir um pouco mais que 18%
const FALLBACK_KEYBOARD_HEIGHT = 280;

interface PhotoCaptureModalProps {
  visible: boolean;
  challengeTitle: string;
  onClose: () => void;
  onSubmit: (photo: { uri: string; type: string; name: string }, caption?: string) => void;
  isSubmitting?: boolean;
  keyboardMargin?: number; // override local para casos especiais
  maxTranslateRatio?: number; // override do cap de tradução
}

export default function PhotoCaptureModal({
  visible,
  challengeTitle,
  onClose,
  onSubmit,
  isSubmitting = false,
  keyboardMargin = DEFAULT_KEYBOARD_MARGIN,
  maxTranslateRatio = DEFAULT_MAX_TRANSLATE_RATIO,
}: PhotoCaptureModalProps): React.ReactElement {
  // Safe area para respeitar gestos / barras do sistema
  const insets = useSafeAreaInsets();

  // Estado local: uri da foto selecionada e texto da legenda
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  // Valores animados e refs para comportamento do teclado
  const translateY = useRef(new Animated.Value(0)).current; // animates wrapper
  const scrollPadding = useRef(new Animated.Value(32)).current; // padding do ScrollView
  const containerHeight = useRef(0); // altura medida do wrapper
  const containerY = useRef(0); // posição Y medida do wrapper
  // Medidas específicas do campo de legenda: preferimos manter o input visível
  // em vez de usar apenas o bottom do container. Isso evita que o modal suba
  // demais quando não há preview de imagem.
  const captionY = useRef(0);
  const captionHeight = useRef(0);

  const screenHeight = Dimensions.get('window').height;
  const maxTranslate = screenHeight * maxTranslateRatio; // cap em pixels

  /*
    Handler de layout do wrapper: captura altura e posição para os cálculos
    Esses valores são essenciais para calcular a sobreposição entre modal e teclado.
  */
  const handleContainerLayout = useCallback((e: any) => {
    const { height, y } = e.nativeEvent.layout;
    containerHeight.current = height;
    containerY.current = y;
    if (__DEV__) console.log('[PhotoCaptureModal] onLayout', { height, y });
  }, []);

  // Captura posição e altura do campo de legenda (caption) para calcular
  // um translate mais preciso quando o teclado abrir.
  const handleCaptionLayout = useCallback((e: any) => {
    const { height, y } = e.nativeEvent.layout;
    captionHeight.current = height;
    captionY.current = y;
    if (__DEV__) console.log('[PhotoCaptureModal] caption onLayout', { height, y });
  }, []);

  /*
    calculateTranslate:
    - keyboardHeight: altura do teclado reportada pelo evento
    - calcula quanto o modal precisa subir para ficar acima do teclado
    - aplica cap (`maxTranslate`) para evitar movimentos exagerados
  */
  const calculateTranslate = useCallback((keyboardHeight: number) => {
    // Preferimos manter o campo de legenda visível. Se tivermos medidas do
    // caption (quando o onLayout foi chamado), usamos o bottom do caption como
    // referência; caso contrário, voltamos a usar o bottom do container.
    // IMPORTANTE: captionY é relativo ao container; precisamos converter para
    // coordenadas de tela somando containerY.
    const containerBottom = containerY.current + containerHeight.current;
    const captionBottomScreen = containerY.current + captionY.current + captionHeight.current;
    const targetBottom = (captionHeight.current > 0) ? captionBottomScreen : containerBottom;
    const keyboardTop = screenHeight - keyboardHeight;

    // Calcula quantos pixels precisamos subir para deixar o target (caption ou container)
    // acima do topo do teclado.
    const needed = targetBottom - keyboardTop + keyboardMargin + (insets.bottom || 0);
    if (__DEV__) console.log('[PhotoCaptureModal] calcTranslate', { containerBottom, captionBottomScreen, keyboardTop, needed, maxTranslate });
    if (needed > 0) return Math.min(needed, maxTranslate);
    return 0;
  }, [screenHeight, keyboardMargin, insets.bottom, maxTranslate]);

  /*
    Observadores do teclado: usamos eventos diferentes em iOS/Android para
    melhor experiência de animação. Quando o teclado aparece, calculamos
    translate e animamos tanto o wrapper quanto o padding do ScrollView.
  */
  useEffect(() => {
    if (!visible) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: KeyboardEvent) => {
      const kbHeight = e.endCoordinates?.height || FALLBACK_KEYBOARD_HEIGHT;
      const translate = calculateTranslate(kbHeight);
      if (__DEV__) console.log('[PhotoCaptureModal] keyboard show', { kbHeight, translate });

      // Move o wrapper para cima
      Animated.timing(translateY, {
        toValue: -translate,
        duration: Platform.OS === 'ios' ? 250 : 200,
        useNativeDriver: true,
      }).start();

      // Aumenta o padding do ScrollView para garantir espaço ao digitar
      Animated.timing(scrollPadding, {
        toValue: kbHeight + (insets.bottom || 0) + 32,
        duration: Platform.OS === 'ios' ? 250 : 200,
        useNativeDriver: false, // padding não suporta native driver
      }).start();
    };

    const onHide = () => {
      if (__DEV__) console.log('[PhotoCaptureModal] keyboard hide');
      Animated.timing(translateY, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? 200 : 180,
        useNativeDriver: true,
      }).start();
      Animated.timing(scrollPadding, {
        toValue: 32,
        duration: Platform.OS === 'ios' ? 200 : 180,
        useNativeDriver: false,
      }).start();
    };

    const s = Keyboard.addListener(showEvent, onShow as any);
    const h = Keyboard.addListener(hideEvent, onHide as any);
    return () => {
      s.remove();
      h.remove();
    };
  }, [visible, calculateTranslate, insets.bottom, scrollPadding, translateY]);

  // Quando o modal fecha, limpa o estado para evitar vazamento de dados entre aberturas
  useEffect(() => {
    if (!visible) {
      setPhotoUri(null);
      setCaption('');
      translateY.setValue(0);
      scrollPadding.setValue(32);
    }
  }, [visible, translateY, scrollPadding]);

  /*
    requestPermissions: pede permissões de câmera e galeria (Android/iOS).
    Retorna `true` quando as permissões foram concedidas.
  */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web') return true;
    try {
      const cam = await ImagePicker.requestCameraPermissionsAsync();
      const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cam.status !== 'granted' || lib.status !== 'granted') {
        Alert.alert('Permissões necessárias', 'Precisamos de acesso à câmera e galeria para você adicionar fotos aos desafios.');
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[PhotoCaptureModal] requestPermissions', err);
      return false;
    }
  }, []);

  /*
    takePhoto / pickImage: funções que abrem câmera/galeria e atualizam o estado
    com a URI retornada. Tratam erros com alertas e logs para debugging.
  */
  const takePhoto = useCallback(async () => {
    const ok = await requestPermissions();
    if (!ok) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
    } catch (err) {
      console.warn('[PhotoCaptureModal] takePhoto', err);
      Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
    }
  }, [requestPermissions]);

  const pickImage = useCallback(async () => {
    const ok = await requestPermissions();
    if (!ok) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
    } catch (err) {
      console.warn('[PhotoCaptureModal] pickImage', err);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente.');
    }
  }, [requestPermissions]);

  // Remove a foto selecionada (usado pelo botão 'X' na preview)
  const removePhoto = useCallback(() => {
    setPhotoUri(null);
  }, []);

  /*
    handleSubmit: valida presença de foto, cria um nome de arquivo com timestamp
    e chama `onSubmit` (contrato preservado da API anterior).
  */
  const handleSubmit = useCallback(() => {
    if (!photoUri) {
      Alert.alert('Foto obrigatória', 'Por favor, adicione uma foto para completar este desafio.');
      return;
    }
    const ext = photoUri.split('.').pop() || 'jpg';
    const filename = `challenge_photo_${Date.now()}.${ext}`;
    const photo = { uri: photoUri, type: `image/${ext}`, name: filename };
    onSubmit(photo, caption || undefined);
  }, [photoUri, caption, onSubmit]);

  // Fecha o modal, descarta teclado e limpa estado local
  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    setPhotoUri(null);
    setCaption('');
    onClose();
  }, [onClose]);

  // Estilos animados reutilizáveis
  const animatedContainerStyle = useMemo(() => ({ transform: [{ translateY }] }), [translateY]);
  const animatedScrollStyle = useMemo(() => ({ paddingBottom: scrollPadding as any }), [scrollPadding]);

  /* Render: modal com overlay, wrapper animado e Animated.ScrollView.
     Anotações de acessibilidade/testID adicionadas para facilitar testes.
  */
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        {/* Wrapper animado: aplicamos translateY aqui */}
        <Animated.View style={[styles.containerWrapper, animatedContainerStyle]} onLayout={handleContainerLayout}>
          {/* Animated.ScrollView com paddingBottom animado para abrir espaço ao digitar */}
          <Animated.ScrollView contentContainerStyle={animatedScrollStyle as any} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>📸 Adicionar Foto</Text>
                <Text style={styles.subtitle}>{challengeTitle}</Text>
              </View>

              {/* Preview ou botões para tirar/escolher foto */}
              {photoUri ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
                  {/* Botão 'X' sobre a imagem para remover a foto selecionada */}
                  <TouchableOpacity style={styles.previewCloseButton} onPress={removePhoto} accessibilityLabel="Remover foto" testID="remove-photo-button">
                    <Text style={styles.previewCloseButtonText}>✕</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage} disabled={isSubmitting} accessibilityLabel="Trocar foto" testID="change-photo-button">
                    <Text style={styles.changePhotoText}>Trocar Foto</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <TouchableOpacity style={styles.photoButton} onPress={takePhoto} disabled={isSubmitting} accessibilityLabel="Tirar foto" testID="take-photo-button">
                    <Text style={styles.photoButtonIcon}>📷</Text>
                    <Text style={styles.photoButtonText}>Tirar Foto</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.photoButton} onPress={pickImage} disabled={isSubmitting} accessibilityLabel="Escolher da galeria" testID="pick-image-button">
                    <Text style={styles.photoButtonIcon}>🖼️</Text>
                    <Text style={styles.photoButtonText}>Galeria</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Campo de legenda (multiline) */}
              <View style={styles.captionContainer} onLayout={handleCaptionLayout}>
                <Text style={styles.captionLabel}>Legenda (opcional)</Text>
                <TextInput style={styles.captionInput} placeholder="Adicione uma legenda..." placeholderTextColor="#999" value={caption} onChangeText={setCaption} maxLength={200} multiline numberOfLines={3} editable={!isSubmitting} accessibilityLabel="Campo de legenda" testID="caption-input" />
                <Text style={styles.captionCounter}>{caption.length}/200</Text>
              </View>

              {/* Ações */}
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleClose} disabled={isSubmitting} accessibilityLabel="Cancelar" testID="cancel-button">
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.submitButton, (!photoUri || isSubmitting) && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={isSubmitting || !photoUri} accessibilityLabel="Concluir desafio" testID="submit-button">
                  {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Concluir Desafio</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerWrapper: {
    width: '96%',
    maxWidth: 500,
    maxHeight: Dimensions.get('window').height * 0.85,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    marginBottom: 14,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 6,
  },
  photoButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  previewContainer: {
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  changePhotoButton: {
    marginTop: 12,
    alignSelf: 'center',
    padding: 8,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  // Botão 'X' posicionado sobre a imagem de preview para remover a foto selecionada
  previewCloseButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 5,
  },
  previewCloseButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  captionContainer: {
    marginBottom: 16,
  },
  captionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  captionInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#1A1A1A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  captionCounter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#B0D4FF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
