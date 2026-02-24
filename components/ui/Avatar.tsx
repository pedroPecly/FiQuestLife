import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface AvatarProps {
  initials: string;
  imageUrl?: string | null;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  imageUrl,
  size = 100,
  backgroundColor = '#20B2AA',
  borderColor = '#20B2AA',
  borderWidth = 2.5,
}) => {
  const GAP = 2; // espaço branco entre a foto e o anel colorido

  return (
    // Anel colorido externo
    <View
      style={{
        width: size + (borderWidth + GAP) * 2,
        height: size + (borderWidth + GAP) * 2,
        borderRadius: (size + (borderWidth + GAP) * 2) / 2,
        borderWidth,
        borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: borderColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Gap branco */}
      <View
        style={{
          width: size + GAP * 2,
          height: size + GAP * 2,
          borderRadius: (size + GAP * 2) / 2,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
      </View>
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
