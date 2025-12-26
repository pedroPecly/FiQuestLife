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
      <MaterialCommunityIcons name={icon as any} size={28} color={iconColor} />
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    minWidth: 90, // Largura mínima para evitar quebras
    flexShrink: 1, // Permite encolher se necessário
    marginHorizontal: 4,
    marginVertical: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  label: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
    flexShrink: 1,
  },
});
