import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  iconColor?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  value,
  iconColor = '#007BFF',
}) => {
  return (
    <View style={styles.row}>
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={iconColor}
        style={styles.icon}
      />
      <View style={styles.content}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        <Text style={styles.value} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
  },
  icon: {
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
