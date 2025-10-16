import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
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
  return (
    <View style={[
      styles.container, 
      multiline && styles.multilineContainer
    ]}>
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
          style
        ]}
        placeholderTextColor="#888"
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
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
  },
  multilineInput: {
    paddingTop: 0,
  },
});
