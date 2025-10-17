/**
 * ============================================
 * SETTINGS MENU ITEM COMPONENT
 * ============================================
 * 
 * Componente reutilizável para itens de menu em telas de configurações.
 * 
 * Suporta:
 * - Item clicável com chevron
 * - Item com Switch (toggle)
 * - Item somente informativo
 * - Customização de ícone e cores
 * 
 * @created 17 de outubro de 2025
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

// ==========================================
// TYPES
// ==========================================
export type SettingsMenuItemType = 'clickable' | 'toggle' | 'info';

export interface SettingsMenuItemProps {
  /** Tipo do item (clicável, toggle, ou apenas informação) */
  type?: SettingsMenuItemType;
  
  /** Nome do ícone do Material Community Icons */
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  
  /** Cor do ícone */
  iconColor?: string;
  
  /** Texto principal do item */
  label: string;
  
  /** Texto secundário (subtítulo) */
  subtitle?: string;
  
  /** Se é o último item da seção (remove borda inferior) */
  isLast?: boolean;
  
  /** Callback quando o item é pressionado (para type='clickable') */
  onPress?: () => void;
  
  /** Valor do switch (para type='toggle') */
  switchValue?: boolean;
  
  /** Callback quando o switch muda (para type='toggle') */
  onSwitchChange?: (value: boolean) => void;
  
  /** Desabilitar o item */
  disabled?: boolean;
  
  /** Estilo customizado para o texto principal */
  labelStyle?: any;
}

// ==========================================
// COMPONENT
// ==========================================
export const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({
  type = 'info',
  icon,
  iconColor = '#4CAF50',
  label,
  subtitle,
  isLast = false,
  onPress,
  switchValue = false,
  onSwitchChange,
  disabled = false,
  labelStyle,
}) => {
  // ==========================================
  // RENDER HELPERS
  // ==========================================
  const renderContent = () => (
    <>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
        <View style={styles.textContainer}>
          <Text style={[styles.label, labelStyle, disabled && styles.disabledText]}>
            {label}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, disabled && styles.disabledText]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right Side Content */}
      {type === 'clickable' && (
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      )}
      
      {type === 'toggle' && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E0E0E0', true: '#81C784' }}
          thumbColor={switchValue ? '#4CAF50' : '#f4f3f4'}
          disabled={disabled}
        />
      )}
    </>
  );

  // ==========================================
  // RENDER
  // ==========================================
  const containerStyle = [
    styles.container,
    isLast && styles.containerLast,
    disabled && styles.disabled,
  ];

  if (type === 'clickable' && onPress && !disabled) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{renderContent()}</View>;
};

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 60,
  },
  containerLast: {
    borderBottomWidth: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  disabledText: {
    color: '#999',
  },
});
