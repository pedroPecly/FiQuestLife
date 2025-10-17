/**
 * COMPONENTE INPUT
 *
 * Campo de entrada de texto customizado com ícones e efeitos visuais.
 * Suporta modo single-line e multi-line com foco profissional.
 *
 * Funcionalidades:
 * - Ícones opcionais usando MaterialCommunityIcons
 * - Efeitos de foco com borda azul e sombra
 * - Suporte a múltiplas linhas (textarea)
 * - Estilos cross-platform (web/mobile)
 * - Remoção automática de bordas pretas no foco (web)
 *
 * @author FiQuestLife Team
 * @version 1.0.0
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

/**
 * Propriedades do componente Input
 */
interface InputProps extends TextInputProps {
  /** Nome do ícone do MaterialCommunityIcons (opcional) */
  icon?: string;
  /** Cor do ícone (padrão: '#888') */
  iconColor?: string;
  /** Se o input deve suportar múltiplas linhas (padrão: false) */
  multiline?: boolean;
}

/**
 * Componente Input - Campo de entrada customizado
 *
 * Renderiza um campo de entrada com ícone opcional e efeitos de foco.
 * Suporta tanto inputs single-line quanto multi-line (textarea).
 */
export const Input: React.FC<InputProps> = ({
  icon,
  iconColor = '#888',
  multiline = false,
  style,
  ...props
}) => {
  // Estado para controlar se o input está focado
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,                    // Estilo base do container
        multiline && styles.multilineContainer, // Ajustes para multiline
        isFocused && styles.focusedContainer,   // Efeitos de foco
      ]}
    >
      {/* ==========================================
          ÍCONE OPCIONAL
          ==========================================
          Renderizado apenas se a prop 'icon' for fornecida.
          Usa MaterialCommunityIcons para consistência visual. */}
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}                          // Nome do ícone
          size={24}                                  // Tamanho fixo
          color={iconColor}                          // Cor customizável
          style={[styles.icon, multiline && styles.iconMultiline]} // Posicionamento
        />
      )}

      {/* ==========================================
          CAMPO DE TEXTO PRINCIPAL
          ==========================================
          TextInput nativo com customizações cross-platform.
          Suporte completo a todas as props do TextInput. */}
      <TextInput
        style={[
          styles.input,                      // Estilo base do input
          multiline && styles.multilineInput, // Ajustes para multiline
          style,                            // Estilos customizados do usuário
          // REMOÇÃO DE BORDAS PRETAS NO WEB:
          // outline: none remove a borda azul padrão do navegador
          // boxShadow: none remove sombras indesejadas
          Platform.OS === 'web' && { outline: 'none', boxShadow: 'none' },
        ]}
        placeholderTextColor="#888"          // Cor do placeholder
        multiline={multiline}                // Suporte a múltiplas linhas
        numberOfLines={multiline ? 3 : 1}   // Altura baseada no modo
        textAlignVertical={multiline ? 'top' : 'center'} // Alinhamento vertical
        onFocus={() => setIsFocused(true)}  // Ativa efeitos de foco
        onBlur={() => setIsFocused(false)}  // Desativa efeitos de foco
        {...props}                          // Todas as outras props do TextInput
      />
    </View>
  );
};

const styles = StyleSheet.create({
  /**
   * Container base do input
   * Design clean com fundo cinza claro e bordas arredondadas
   * Layout horizontal com ícone e campo de texto
   */
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
  /**
   * Estilos aplicados quando o input está focado
   * Borda azul primária e sombra sutil para destacar o campo ativo
   * Cria feedback visual profissional para o usuário
   */
  focusedContainer: {
    borderColor: '#007BFF', // Azul primário para foco
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  /**
   * Container para modo multiline (textarea)
   * Altura maior e alinhamento no topo para melhor usabilidade
   * Padding vertical adicional para texto longo
   */
  multilineContainer: {
    height: 80,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },

  /**
   * Estilo do ícone
   * Posicionamento à esquerda com margem para separação
   */
  icon: {
    marginRight: 10,
  },

  /**
   * Ajuste do ícone para modo multiline
   * Margem superior para alinhar com o texto no topo
   */
  iconMultiline: {
    marginTop: 2,
  },

  /**
   * Estilo base do campo de texto
   * Transparente para herdar fundo do container
   * Cor do texto escura para boa legibilidade
   */
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    backgroundColor: 'transparent',
  },

  /**
   * Ajustes para input multiline
   * Remove padding superior padrão para alinhamento correto
   */
  multilineInput: {
    paddingTop: 0,
  },
});

// ==========================================
// EXEMPLOS DE USO E API
// ==========================================

/**
 * EXEMPLOS DE USO DO COMPONENTE INPUT:
 *
 * // Input básico com placeholder
 * <Input
 *   placeholder="Digite seu nome"
 *   value={name}
 *   onChangeText={setName}
 * />
 *
 * // Input com ícone
 * <Input
 *   icon="email"
 *   placeholder="Digite seu email"
 *   value={email}
 *   onChangeText={setEmail}
 *   keyboardType="email-address"
 * />
 *
 * // Input multiline (textarea)
 * <Input
 *   multiline
 *   placeholder="Digite sua mensagem"
 *   value={message}
 *   onChangeText={setMessage}
 *   numberOfLines={4}
 * />
 *
 * // Input com ícone customizado
 * <Input
 *   icon="lock"
 *   iconColor="#FF6B6B"
 *   placeholder="Digite sua senha"
 *   secureTextEntry
 *   value={password}
 *   onChangeText={setPassword}
 * />
 */

/**
 * PROPRIEDADES DO COMPONENTE:
 *
 * icon?: string - Nome do ícone do MaterialCommunityIcons
 * iconColor?: string - Cor do ícone (padrão: '#888')
 * multiline?: boolean - Se suporta múltiplas linhas (padrão: false)
 * ...TextInputProps - Todas as props do TextInput nativo
 *
 * ÍCONES SUPORTADOS:
 * Qualquer ícone válido do MaterialCommunityIcons
 * Exemplos: 'email', 'lock', 'account', 'phone', 'map-marker', etc.
 *
 * NOTAS DE IMPLEMENTAÇÃO:
 * - Efeitos de foco automáticos (borda azul + sombra)
 * - Remoção automática de bordas pretas no web
 * - Design responsivo cross-platform
 * - Suporte completo a acessibilidade
 * - Altura automática baseada no modo (single/multiline)
 */

export default Input;
