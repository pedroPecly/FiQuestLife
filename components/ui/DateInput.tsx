/**
 * ============================================
 * DATE INPUT - COMPONENTE DE DATA FORMATADA
 * ============================================
 *
 * Input especializado para datas no formato brasileiro (DD/MM/YYYY)
 * Com formatação automática e validação integrada
 *
 * @created 17 de outubro de 2025
 */

import React from 'react';
import { Input } from './Input';

interface DateInputProps {
  /** Valor atual da data (DD/MM/YYYY) */
  value: string;
  /** Callback quando o valor muda */
  onChangeText: (text: string) => void;
  /** Placeholder do input */
  placeholder?: string;
  /** Se o input está desabilitado */
  editable?: boolean;
  /** Tipo de retorno do teclado */
  returnKeyType?: 'done' | 'next' | 'search' | 'send' | 'go';
  /** Callback ao pressionar Enter */
  onSubmitEditing?: () => void;
}

/**
 * Componente de input para datas com formatação automática
 * 
 * Características:
 * - Formata automaticamente para DD/MM/YYYY
 * - Aceita apenas números
 * - Adiciona barras automaticamente
 * - Limite de 10 caracteres
 * 
 * @example
 * ```tsx
 * <DateInput
 *   value={birthDate}
 *   onChangeText={setBirthDate}
 *   placeholder="Data de nascimento"
 * />
 * ```
 */
export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Data (DD/MM/YYYY)',
  editable = true,
  returnKeyType = 'next',
  onSubmitEditing,
}) => {
  /**
   * Formata a data automaticamente enquanto o usuário digita
   * Remove caracteres não numéricos e adiciona barras nas posições corretas
   */
  const handleChangeText = (text: string) => {
    // Remove tudo que não é número
    const numbersOnly = text.replace(/[^0-9]/g, '');
    
    // Aplica formatação DD/MM/YYYY
    let formatted = numbersOnly;
    if (numbersOnly.length >= 2) {
      formatted = numbersOnly.slice(0, 2);
      if (numbersOnly.length >= 3) {
        formatted += '/' + numbersOnly.slice(2, 4);
      }
      if (numbersOnly.length >= 5) {
        formatted += '/' + numbersOnly.slice(4, 8);
      }
    }
    
    onChangeText(formatted);
  };

  return (
    <Input
      icon="calendar-outline"
      placeholder={placeholder}
      value={value}
      onChangeText={handleChangeText}
      editable={editable}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      keyboardType="numeric"
      maxLength={10}
    />
  );
};
