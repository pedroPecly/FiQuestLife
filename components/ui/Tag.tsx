import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TagProps {
  icon?: string;
  text: string;
  backgroundColor?: string;
}

export const Tag: React.FC<TagProps> = ({
  icon,
  text,
  backgroundColor = '#20B2AA',
}) => {
  return (
    <View style={[styles.tag, { backgroundColor }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={18}
          color="#FFFFFF"
        />
      )}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
