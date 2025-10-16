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
      <MaterialCommunityIcons name={icon as any} size={30} color={iconColor} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 5,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
