import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Button } from './Button';

export interface EmptyStateProps {
  /** Nome do ícone do MaterialCommunityIcons */
  icon: string;
  /** Tamanho do ícone (default: 80) */
  iconSize?: number;
  /** Cor do ícone (default: #C7C7CC) */
  iconColor?: string;
  /** Título principal */
  title: string;
  /** Descrição/texto auxiliar */
  description: string;
  /** Botão de ação opcional */
  actionButton?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: string;
  };
  /** Estilo customizado do container */
  style?: ViewStyle;
}

/**
 * Componente genérico para estados vazios com ícone, título e descrição
 * 
 * @example
 * ```tsx
 * // Sem botão de ação
 * <EmptyState
 *   icon="account-group-outline"
 *   title="Nenhum amigo ainda"
 *   description="Busque usuários na aba 'Buscar' para adicionar seus primeiros amigos!"
 * />
 * 
 * // Com botão de ação
 * <EmptyState
 *   icon="account-search"
 *   title="Nenhum usuário encontrado"
 *   description="Tente buscar por outro username ou nome"
 *   actionButton={{
 *     label: "Limpar Busca",
 *     onPress: () => clearSearch(),
 *     variant: 'secondary'
 *   }}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  iconSize = 80,
  iconColor = '#C7C7CC',
  title,
  description,
  actionButton,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name={icon as any} size={iconSize} color={iconColor} />
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionButton && (
        <Button
          title={actionButton.label}
          onPress={actionButton.onPress}
          variant={actionButton.variant || 'primary'}
          icon={actionButton.icon}
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    marginTop: 20,
    minWidth: 150,
  },
});
