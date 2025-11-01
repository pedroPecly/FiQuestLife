import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

export interface SearchBarProps extends Omit<TextInputProps, 'onChangeText' | 'style'> {
  /** Valor atual do input */
  value: string;
  /** Callback quando o texto muda */
  onChangeText: (text: string) => void;
  /** Callback quando o botão de busca é pressionado */
  onSearch: () => void;
  /** Callback quando o botão clear (X) é pressionado */
  onClear?: () => void;
  /** Placeholder do input */
  placeholder?: string;
  /** Se está carregando os resultados */
  loading?: boolean;
  /** Se o input está desabilitado */
  disabled?: boolean;
  /** Comprimento mínimo para habilitar a busca */
  minLength?: number;
  /** Estilo customizado do container */
  style?: ViewStyle;
}

/**
 * Componente de barra de busca completa com ícone, input, botão clear e botão de ação
 * 
 * @example
 * ```tsx
 * <SearchBar
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   onSearch={performSearch}
 *   onClear={clearSearch}
 *   placeholder="Buscar por @username ou nome"
 *   loading={searching}
 *   minLength={2}
 *   autoCapitalize="none"
 *   returnKeyType="search"
 * />
 * ```
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  onClear,
  placeholder = 'Buscar...',
  loading = false,
  disabled = false,
  minLength = 0,
  style,
  autoCapitalize = 'none',
  autoCorrect = false,
  returnKeyType = 'search',
  ...textInputProps
}) => {
  const canSearch = !loading && !disabled && value.trim().length >= minLength;
  const showClearButton = value.length > 0 && !loading;

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, style]}>
      {/* Search Icon */}
      <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" style={styles.searchIcon} />

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        onSubmitEditing={canSearch ? onSearch : undefined}
        returnKeyType={returnKeyType}
        editable={!disabled}
        {...textInputProps}
      />

      {/* Clear Button */}
      {showClearButton && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear} activeOpacity={0.7}>
          <MaterialCommunityIcons name="close-circle" size={20} color="#8E8E93" />
        </TouchableOpacity>
      )}

      {/* Search Button */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={onSearch}
        disabled={!canSearch}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={canSearch ? '#007AFF' : '#C7C7CC'}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  searchButton: {
    marginLeft: 8,
    padding: 4,
  },
});
