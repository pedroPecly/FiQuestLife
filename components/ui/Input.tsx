import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

interface InputProps extends TextInputProps {
  icon?: string;
  iconColor?: string;
  multiline?: boolean;
}

export const Input: React.FC<InputProps> = ({
  icon,
  iconColor = '#888',
  multiline = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        multiline && styles.multilineContainer,
        isFocused && styles.focusedContainer,
      ]}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={iconColor}
          style={[styles.icon, multiline && styles.iconMultiline]}
        />
      )}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          style,
          Platform.OS === 'web' && { outline: 'none', boxShadow: 'none' },
        ]}
        placeholderTextColor="#888"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  focusedContainer: {
    borderColor: '#007BFF', // Azul primário
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  multilineContainer: {
    height: 80,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  iconMultiline: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    backgroundColor: 'transparent',
  },
  multilineInput: {
    paddingTop: 0,
  },
});
