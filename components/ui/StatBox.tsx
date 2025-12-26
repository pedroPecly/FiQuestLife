import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatBoxProps {
  icon: string;
  value: string | number;
  label: string;
  iconColor?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({
  icon,
  value,
  label,
  iconColor = '#007BFF',
}) => {
  return (
    <View style={styles.box}>
      <MaterialCommunityIcons name={icon as any} size={24} color={iconColor} />
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    maxWidth: 120, // Largura máxima, mas pode encolher
    flexShrink: 1, // Permite encolher proporcionalmente
    flexBasis: 0, // Distribui espaço igualmente
    marginHorizontal: 3,
    marginVertical: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 3,
    textAlign: 'center',
    width: '100%',
    flexShrink: 1,
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginTop: 3,
    textAlign: 'center',
    width: '100%',
    flexShrink: 1,
  },
});
