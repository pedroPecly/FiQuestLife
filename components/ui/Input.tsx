import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { forwardRef, useRef, useState } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  icon?: string;
  iconColor?: string;
  multiline?: boolean;
  style?: any;
}

export const Input = forwardRef<TextInput, InputProps>(({
  icon,
  iconColor = '#888',
  multiline = false,
  style,
  onFocus,
  onBlur,
  secureTextEntry,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const internalRef = useRef<TextInput>(null);
  const inputRef = (ref as any) || internalRef;

  const isPasswordField = secureTextEntry === true;

  const handleContainerPress = () => {
    if (inputRef.current && props.editable !== false) {
      inputRef.current.focus();
    }
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
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
          ref={inputRef}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            style,
            Platform.OS === 'web' && { outline: 'none' },
          ]}
          placeholderTextColor="#888"
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
          autoCorrect={false}
          importantForAutofill="no"
          textContentType="none"
          blurOnSubmit={true}
          secureTextEntry={isPasswordField && !isPasswordVisible}
          {...props}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeButton}
            accessible={true}
            accessibilityLabel={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
});

Input.displayName = 'Input';

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
  },
  focusedContainer: {
    borderColor: '#007BFF',
    ...Platform.select({
      ios: {
        shadowColor: '#007BFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 123, 255, 0.15)',
      },
    }),
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
    marginTop: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    paddingVertical: 0,
  },
  multilineInput: {
    paddingTop: Platform.OS === 'ios' ? 8 : 5,
    height: '100%',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 4,
  },
});
