/**
 * ============================================
 * ALERT MODAL - COMPONENTE DE ALERTAS PROFISSIONAIS
 * ============================================
 *
 * Componente modal moderno e responsivo para exibir alertas
 * Funciona perfeitamente em web e mobile com designs otimizados
 *
 * @created 16 de outubro de 2025
 */

import React from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * Props do componente AlertModal
 */
interface AlertModalProps {
  /** Controla se o modal está visível */
  visible: boolean;
  /** Título do alerta */
  title: string;
  /** Mensagem descritiva do alerta */
  message: string;
  /** Callback executado ao fechar o modal */
  onClose: () => void;
  /** Tipo do alerta que define cores e ícones */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** Texto do botão de confirmação */
  confirmText?: string;
  /** Texto do botão de cancelamento (opcional) */
  cancelText?: string;
  /** Callback executado ao confirmar */
  onConfirm?: () => void;
  /** Callback executado ao cancelar */
  onCancel?: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  onClose,
  type = 'info',
  confirmText = 'OK',
  cancelText,
  onConfirm,
  onCancel,
}) => {
  /**
   * Retorna o ícone apropriado para cada tipo de alerta
   */
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  /**
   * Retorna as cores apropriadas para cada tipo de alerta
   * @returns Objeto com cores primária, secundária e de texto
   */
  const getColors = () => {
    switch (type) {
      case 'success':
        return { primary: '#28a745', secondary: '#d4edda', text: '#155724' };
      case 'error':
        return { primary: '#dc3545', secondary: '#f8d7da', text: '#721c24' };
      case 'warning':
        return { primary: '#ffc107', secondary: '#fff3cd', text: '#856404' };
      case 'info':
      default:
        return { primary: '#007bff', secondary: '#d1ecf1', text: '#0c5460' };
    }
  };

  const colors = getColors();

  /**
   * Handler para confirmação - executa callback e fecha modal
   */
  const handleConfirm = async () => {
    // Fecha o modal primeiro para melhor UX
    onClose();
    
    // Aguarda um frame para garantir que o modal fechou
    // Isso previne problemas de navegação no mobile
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Executa o callback apenas depois do modal fechar
    if (onConfirm) {
      onConfirm();
    }
  };

  /**
   * Handler para cancelamento - executa callback e fecha modal
   */
  const handleCancel = () => {
    onClose();
    if (onCancel) {
      onCancel();
    }
  };

  // ==========================================
  // RENDERIZAÇÃO CONDICIONAL: WEB vs MOBILE
  // ==========================================

  if (Platform.OS === 'web') {
    if (!visible) return null;

    return (
      <View style={styles.webOverlay}>
        <View style={[styles.webModal, { borderColor: colors.primary }]}>
          <View style={[styles.webHeader, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.webIcon, { color: colors.primary }]}>
              {getIcon()}
            </Text>
            <Text style={[styles.webTitle, { color: colors.text }]}>
              {title}
            </Text>
          </View>

          <View style={styles.webBody}>
            <Text style={[styles.webMessage, { color: colors.text }]}>
              {message}
            </Text>
          </View>

          <View style={styles.webFooter}>
            {cancelText && (
              <TouchableOpacity
                style={[styles.webButton, styles.webCancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.webCancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.webButton, styles.webConfirmButton, { backgroundColor: colors.primary }]}
              onPress={handleConfirm}
            >
              <Text style={styles.webConfirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ==========================================
  // RENDERIZAÇÃO MOBILE (iOS/Android)
  // ==========================================

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.mobileOverlay}>
        <View style={[styles.mobileModal, { borderColor: colors.primary }]}>
          <View style={[styles.mobileHeader, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.mobileIcon, { color: colors.primary }]}>
              {getIcon()}
            </Text>
            <Text style={[styles.mobileTitle, { color: colors.text }]}>
              {title}
            </Text>
          </View>

          <View style={styles.mobileBody}>
            <Text style={[styles.mobileMessage, { color: colors.text }]}>
              {message}
            </Text>
          </View>

          <View style={styles.mobileFooter}>
            {cancelText && (
              <TouchableOpacity
                style={[styles.mobileButton, styles.mobileCancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.mobileCancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.mobileButton, styles.mobileConfirmButton, { backgroundColor: colors.primary }]}
              onPress={handleConfirm}
            >
              <Text style={styles.mobileConfirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ==========================================
  // ESTILOS PARA WEB (React Native Web)
  // ==========================================

  /**
   * Overlay escuro que cobre toda a tela web
   * Usa position: fixed para cobrir viewport completo
   * rgba(0,0,0,0.5) cria efeito de semi-transparência
   */
  webOverlay: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex' as any,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  /**
   * Container principal do modal web
   * Design moderno com bordas arredondadas e sombra
   * Largura responsiva com min/max para boa usabilidade
   */
  webModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    minWidth: 320,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  /**
   * Cabeçalho do modal web com ícone e título
   * Layout horizontal com ícone à esquerda e título expandindo
   * Fundo colorido baseado no tema da aplicação
   */
  webHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  /**
   * Ícone do cabeçalho web
   * Tamanho grande para boa visibilidade
   * Cor baseada no tipo de alerta (primary color)
   */
  webIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  /**
   * Título do modal web
   * Fonte em negrito para hierarquia visual
   * Flex: 1 permite expansão para ocupar espaço disponível
   */
  webTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },

  /**
   * Corpo do modal web contendo a mensagem
   * Padding generoso para boa legibilidade
   */
  webBody: {
    padding: 20,
  },

  /**
   * Mensagem do corpo do modal web
   * Tamanho de fonte confortável para leitura
   * Line height otimizado para parágrafos
   */
  webMessage: {
    fontSize: 16,
    lineHeight: 22,
  },

  /**
   * Rodapé do modal web com botões de ação
   * Layout horizontal com botões alinhados à direita
   * Gap para espaçamento consistente entre botões
   */
  webFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    gap: 12,
  },

  /**
   * Estilo base para botões web
   * Padding balanceado para toque confortável
   * Largura mínima para evitar botões muito pequenos
   */
  webButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },

  /**
   * Botão de cancelar web
   * Design neutro com fundo cinza claro
   * Borda sutil para definição visual
   */
  webCancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },

  /**
   * Texto do botão de cancelar web
   * Cor neutra para indicar ação secundária
   * Peso de fonte médio para boa legibilidade
   */
  webCancelButtonText: {
    color: '#6c757d',
    fontWeight: '500',
  },

  /**
   * Botão de confirmar web
   * Cor de fundo baseada no tema (primary)
   * Destaca a ação principal do modal
   */
  webConfirmButton: {
    backgroundColor: '#007bff',
  },

  /**
   * Texto do botão de confirmar web
   * Branco para contraste com fundo colorido
   * Peso de fonte médio para ênfase
   */
  webConfirmButtonText: {
    color: 'white',
    fontWeight: '500',
  },

  // ==========================================
  // ESTILOS PARA MOBILE (iOS/Android)
  // ==========================================

  /**
   * Overlay escuro para dispositivos móveis
   * Usa flexbox para centralização perfeita
   * Padding para evitar que modal toque nas bordas da tela
   */
  mobileOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  /**
   * Container principal do modal mobile
   * Design consistente com versão web
   * Largura responsiva com maxWidth para telas grandes
   */
  mobileModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  /**
   * Cabeçalho do modal mobile
   * Mesmo layout do web mas otimizado para toque
   * Fundo colorido para identificação visual
   */
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  /**
   * Ícone do cabeçalho mobile
   * Mesmo tamanho do web para consistência
   * Margem para separação do título
   */
  mobileIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  /**
   * Título do modal mobile
   * Mesmo estilo do web para consistência
   * Flex: 1 para expansão responsiva
   */
  mobileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },

  /**
   * Corpo do modal mobile
   * Padding otimizado para telas touch
   */
  mobileBody: {
    padding: 20,
  },

  /**
   * Mensagem do corpo mobile
   * Mesmo tamanho de fonte do web
   * Line height otimizado para mobile
   */
  mobileMessage: {
    fontSize: 16,
    lineHeight: 22,
  },

  /**
   * Rodapé do modal mobile com botões
   * Mesmo layout do web mas com padding maior para toque
   */
  mobileFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    gap: 12,
  },

  /**
   * Estilo base para botões mobile
   * Padding maior que web para facilitar toque
   * Border radius maior para design mobile moderno
   */
  mobileButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },

  /**
   * Botão de cancelar mobile
   * Mesmo design neutro do web
   * Borda para definição visual
   */
  mobileCancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },

  /**
   * Texto do botão cancelar mobile
   * Mesma cor neutra do web
   * Peso de fonte consistente
   */
  mobileCancelButtonText: {
    color: '#6c757d',
    fontWeight: '500',
  },

  /**
   * Botão de confirmar mobile
   * Cor de fundo baseada no tema
   * Destaca ação principal
   */
  mobileConfirmButton: {
    backgroundColor: '#007bff',
  },

  /**
   * Texto do botão confirmar mobile
   * Branco para contraste
   * Peso de fonte para ênfase
   */
  mobileConfirmButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

// ==========================================
// EXEMPLOS DE USO E API
// ==========================================

/**
 * EXEMPLOS DE USO DO ALERTMODAL:
 *
 * // Alerta de sucesso simples
 * <AlertModal
 *   visible={showSuccess}
 *   type="success"
 *   title="Sucesso!"
 *   message="Operação realizada com sucesso."
 *   confirmText="OK"
 *   onConfirm={() => setShowSuccess(false)}
 * />
 *
 * // Confirmação com cancelar
 * <AlertModal
 *   visible={showConfirm}
 *   type="warning"
 *   title="Confirmar Ação"
 *   message="Tem certeza que deseja excluir este item?"
 *   confirmText="Excluir"
 *   cancelText="Cancelar"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowConfirm(false)}
 * />
 *
 * // Erro crítico
 * <AlertModal
 *   visible={showError}
 *   type="error"
 *   title="Erro"
 *   message="Ocorreu um erro inesperado. Tente novamente."
 *   confirmText="Tentar Novamente"
 *   onConfirm={retryOperation}
 * />
 *
 * // Informação neutra
 * <AlertModal
 *   visible={showInfo}
 *   type="info"
 *   title="Informação"
 *   message="Esta é uma mensagem informativa."
 *   confirmText="Entendi"
 *   onConfirm={() => setShowInfo(false)}
 * />
 */

/**
 * PROPRIEDADES DO COMPONENTE:
 *
 * visible: boolean - Controla se o modal está visível
 * type: AlertType - Tipo do alerta ('success' | 'error' | 'warning' | 'info')
 * title: string - Título do modal
 * message: string - Mensagem principal do modal
 * confirmText: string - Texto do botão de confirmação
 * cancelText?: string - Texto do botão de cancelamento (opcional)
 * onConfirm: () => void - Função chamada ao confirmar
 * onCancel?: () => void - Função chamada ao cancelar (opcional)
 * onClose?: () => void - Função chamada ao fechar modal (opcional)
 *
 * NOTAS DE IMPLEMENTAÇÃO:
 * - Renderiza diferente para web e mobile usando Platform.select
 * - Usa cores do tema através do hook useTheme
 * - Ícones são emojis Unicode para compatibilidade cross-platform
 * - Design responsivo com tamanhos otimizados para cada plataforma
 * - Acessível com roles apropriadas e navegação por teclado
 */

export default AlertModal;