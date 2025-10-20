/**
 * ============================================
 * HOOK - USE IMAGE PICKER
 * ============================================
 * 
 * Hook customizado para seleção de imagens
 * Encapsula lógica de permissões e seleção
 * Suporta galeria e câmera
 */

import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

export const useImagePicker = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Solicita permissões de galeria (se necessário)
   */
  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para acessar sua galeria de fotos.'
        );
        return false;
      }
    }
    return true;
  };

  /**
   * Solicita permissões de câmera (se necessário)
   */
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de permissão para usar sua câmera.'
        );
        return false;
      }
    }
    return true;
  };

  /**
   * Abre a galeria para selecionar uma imagem
   */
  const pickImageFromGallery = async (): Promise<ImagePickerResult | null> => {
    try {
      setLoading(true);

      // Solicita permissão
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) {
        return null;
      }

      // Abre a galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Quadrado para foto de perfil
        quality: 0.8, // Boa qualidade mas otimizado
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
          fileName: asset.fileName || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao selecionar imagem da galeria:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre a câmera para tirar uma foto
   */
  const takePhoto = async (): Promise<ImagePickerResult | null> => {
    try {
      setLoading(true);

      // Solicita permissão
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        return null;
      }

      // Abre a câmera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1], // Quadrado para foto de perfil
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type,
          fileName: asset.fileName || undefined,
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mostra um ActionSheet para escolher entre galeria ou câmera
   */
  const showImagePickerOptions = () => {
    Alert.alert(
      'Escolher foto',
      'De onde você quer escolher a foto?',
      [
        {
          text: 'Galeria',
          onPress: () => pickImageFromGallery(),
        },
        {
          text: 'Câmera',
          onPress: () => takePhoto(),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return {
    loading,
    pickImageFromGallery,
    takePhoto,
    showImagePickerOptions,
  };
};
