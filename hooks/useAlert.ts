/**
 * HOOK USEALERT
 *
 * Hook personalizado para gerenciamento centralizado de alertas/modal.
 * Fornece uma API simples para mostrar diferentes tipos de alertas
 * (sucesso, erro, aviso, informação) e confirmações.
 *
 * Funcionalidades:
 * - 4 tipos de alertas pré-configurados (success/error/warning/info)
 * - Método confirm para diálogos de confirmação
 * - Estado centralizado para visibilidade e configuração
 * - API fluida e fácil de usar
 *
 * @author FiQuestLife Team
 * @version 1.0.0
 */

import { useState } from 'react';

/**
 * Configuração de um alerta/modal
 */
interface AlertConfig {
  /** Título do alerta */
  title: string;
  /** Mensagem principal do alerta */
  message: string;
  /** Tipo visual do alerta (afeta cores e ícones) */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** Texto do botão de confirmação (padrão: 'OK') */
  confirmText?: string;
  /** Texto do botão de cancelamento (opcional) */
  cancelText?: string;
  /** Função executada ao confirmar */
  onConfirm?: () => void;
  /** Função executada ao cancelar */
  onCancel?: () => void;
}

/**
 * Hook useAlert - Gerenciamento de alertas centralizado
 *
 * Retorna um objeto com métodos para controlar alertas e o estado atual.
 * Deve ser usado em conjunto com o componente AlertModal.
 *
 * @returns {Object} Objeto contendo métodos de alerta e estado
 */
export const useAlert = () => {
  // Estado para configuração atual do alerta
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  // Estado para controlar visibilidade do modal
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Mostra um alerta com configuração específica
   *
   * @param config - Configuração completa do alerta
   */
  const showAlert = (config: AlertConfig) => {
    setAlertConfig(config);
    setIsVisible(true);
  };

  /**
   * Esconde o alerta atual e limpa a configuração
   */
  const hideAlert = () => {
    setIsVisible(false);
    setAlertConfig(null);
  };

  /**
   * Objeto com métodos convenientes para diferentes tipos de alertas
   *
   * Cada método configura automaticamente o tipo apropriado
   * e valores padrão para uma experiência consistente.
   */
  const alert = {
    /**
     * Mostra alerta de sucesso (verde, ícone de check)
     *
     * @param title - Título do alerta
     * @param message - Mensagem descritiva
     * @param onConfirm - Função opcional ao confirmar
     */
    success: (title: string, message: string, onConfirm?: () => void) =>
      showAlert({ title, message, type: 'success', onConfirm }),

    /**
     * Mostra alerta de erro (vermelho, ícone de X)
     *
     * @param title - Título do alerta
     * @param message - Mensagem descritiva
     * @param onConfirm - Função opcional ao confirmar
     */
    error: (title: string, message: string, onConfirm?: () => void) =>
      showAlert({ title, message, type: 'error', onConfirm }),

    /**
     * Mostra alerta de aviso (amarelo, ícone de exclamação)
     *
     * @param title - Título do alerta
     * @param message - Mensagem descritiva
     * @param onConfirm - Função opcional ao confirmar
     */
    warning: (title: string, message: string, onConfirm?: () => void) =>
      showAlert({ title, message, type: 'warning', onConfirm }),

    /**
     * Mostra alerta informativo (azul, ícone de i)
     *
     * @param title - Título do alerta
     * @param message - Mensagem descritiva
     * @param onConfirm - Função opcional ao confirmar
     */
    info: (title: string, message: string, onConfirm?: () => void) =>
      showAlert({ title, message, type: 'info', onConfirm }),

    /**
     * Mostra diálogo de confirmação (amarelo, dois botões)
     *
     * @param title - Título da confirmação
     * @param message - Mensagem perguntando se deve confirmar
     * @param onConfirm - Função executada se confirmar
     * @param onCancel - Função opcional se cancelar
     * @param confirmText - Texto do botão confirmar (padrão: 'Confirmar')
     * @param cancelText - Texto do botão cancelar (padrão: 'Cancelar')
     */
    confirm: (
      title: string,
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      confirmText = 'Confirmar',
      cancelText = 'Cancelar'
    ) =>
      showAlert({
        title,
        message,
        type: 'warning',  // Confirmações usam tipo warning
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
      }),
  };

  /**
   * Retorna o objeto público do hook
   *
   * Contém:
   * - alert: métodos para mostrar alertas
   * - alertConfig: configuração atual do alerta
   * - isVisible: se o modal deve estar visível
   * - hideAlert: função para fechar o alerta
   */
  return {
    alert,        // Métodos para mostrar alertas
    alertConfig,  // Configuração atual do alerta
    isVisible,    // Estado de visibilidade
    hideAlert,    // Função para fechar alerta
  };
};

// ==========================================
// EXEMPLOS DE USO E API
// ==========================================

/**
 * EXEMPLOS DE USO DO HOOK USEALERT:
 *
 * // Uso básico em um componente
 * const MyComponent = () => {
 *   const { alert, isVisible, alertConfig, hideAlert } = useAlert();
 *
 *   const handleSuccess = () => {
 *     alert.success('Sucesso!', 'Operação realizada com sucesso.');
 *   };
 *
 *   const handleError = () => {
 *     alert.error('Erro', 'Ocorreu um problema.');
 *   };
 *
 *   const handleConfirm = () => {
 *     alert.confirm(
 *       'Confirmar Exclusão',
 *       'Tem certeza que deseja excluir este item?',
 *       () => console.log('Item excluído'),
 *       () => console.log('Cancelado')
 *     );
 *   };
 *
 *   return (
 *     <>
 *       <Button onPress={handleSuccess} title="Mostrar Sucesso" />
 *       <Button onPress={handleError} title="Mostrar Erro" />
 *       <Button onPress={handleConfirm} title="Confirmar" />
 *
 *       <AlertModal
 *         visible={isVisible}
 *         title={alertConfig?.title || ''}
 *         message={alertConfig?.message || ''}
 *         type={alertConfig?.type}
 *         confirmText={alertConfig?.confirmText}
 *         cancelText={alertConfig?.cancelText}
 *         onConfirm={alertConfig?.onConfirm}
 *         onCancel={alertConfig?.onCancel}
 *         onClose={hideAlert}
 *       />
 *     </>
 *   );
 * };
 */

/**
 * API DO HOOK USEALERT:
 *
 * RETORNO:
 * {
 *   alert: {
 *     success(title, message, onConfirm?) - Alerta verde de sucesso
 *     error(title, message, onConfirm?) - Alerta vermelho de erro
 *     warning(title, message, onConfirm?) - Alerta amarelo de aviso
 *     info(title, message, onConfirm?) - Alerta azul informativo
 *     confirm(title, message, onConfirm, onCancel?, confirmText?, cancelText?) - Confirmação
 *   },
 *   alertConfig: AlertConfig | null - Configuração atual do alerta
 *   isVisible: boolean - Se o modal deve estar visível
 *   hideAlert: () => void - Função para fechar o alerta
 * }
 *
 * TIPOS DE ALERTA:
 * - success: Verde, ícone ✓, para operações bem-sucedidas
 * - error: Vermelho, ícone ✕, para erros e falhas
 * - warning: Amarelo, ícone ⚠, para avisos e confirmações
 * - info: Azul, ícone ℹ, para informações neutras
 *
 * NOTAS DE IMPLEMENTAÇÃO:
 * - Estado é gerenciado internamente pelo hook
 * - Sempre use em conjunto com AlertModal
 * - Alertas são fechados automaticamente ao confirmar/cancelar
 * - hideAlert pode ser usado para fechar programaticamente
 */

export default useAlert;