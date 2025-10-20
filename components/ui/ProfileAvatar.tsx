/**
 * ============================================
 * PROFILE AVATAR - Avatar clicável com upload
 * ============================================
 * 
 * Componente de avatar interativo que permite:
 * - Exibir foto de perfil ou iniciais
 * - Toque para trocar foto
 * - Loading durante upload
 * - Hint visual
 */

import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from './Avatar';

interface ProfileAvatarProps {
  initials: string;
  imageUrl?: string | null;
  size?: number;
  onPress: () => void;
  loading?: boolean;
  showHint?: boolean;
  hintText?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  initials,
  imageUrl,
  size = 100,
  onPress,
  loading = false,
  showHint = true,
  hintText = 'Toque para alterar',
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.7}>
        <Avatar initials={initials} imageUrl={imageUrl} size={size} />
        
        {loading && (
          <View style={[styles.loadingOverlay, { borderRadius: size / 2 }]}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </TouchableOpacity>
      
      {showHint && (
        <Text style={styles.hint}>{hintText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});
