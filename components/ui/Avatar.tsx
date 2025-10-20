import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface AvatarProps {
  initials: string;
  imageUrl?: string | null;
  size?: number;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  imageUrl,
  size = 100,
  backgroundColor = '#20B2AA',
}) => {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: imageUrl ? 'transparent' : backgroundColor,
        },
      ]}
    >
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.text, { fontSize: size * 0.4 }]}>
          {initials.substring(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Garante que a imagem não vaze do círculo
  },
  text: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  image: {
    // Estilos dinâmicos aplicados inline
  },
});
