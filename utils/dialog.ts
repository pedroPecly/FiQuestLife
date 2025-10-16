/**
 * ============================================
 * DIALOG UTILS - Utilitários de Diálogos
 * ============================================
 * 
 * Funções compatíveis com Web e Mobile para exibir
 * alertas e confirmações ao usuário.
 * 
 * Problema: Alert.alert() do React Native NÃO funciona no navegador!
 * Solução: Detectar plataforma e usar API nativa correspondente.
 */

import { Alert, Platform } from 'react-native';

/**
 * Exibe um alerta simples compatível com Web e Mobile
 * @param title - Título do alerta
 * @param message - Mensagem do alerta
 * 
 * @example
 * showAlert('Sucesso', 'Login realizado com sucesso!');
 */
export const showAlert = (title: string, message: string): void => {
  if (Platform.OS === 'web') {
    // Web: usa window.alert
    window.alert(`${title}\n\n${message}`);
  } else {
    // Mobile: usa Alert.alert nativo
    Alert.alert(title, message, [{ text: 'OK', style: 'default' }]);
  }
};

/**
 * Exibe um diálogo de confirmação compatível com Web e Mobile
 * @param title - Título do diálogo
 * @param message - Mensagem do diálogo
 * @param onConfirm - Callback executado ao confirmar
 * @param onCancel - Callback executado ao cancelar (opcional)
 * @param confirmText - Texto do botão de confirmação (padrão: 'Confirmar')
 * @param cancelText - Texto do botão de cancelamento (padrão: 'Cancelar')
 * 
 * @example
 * showConfirm(
 *   'Excluir',
 *   'Tem certeza que deseja excluir?',
 *   () => console.log('Confirmado!'),
 *   () => console.log('Cancelado')
 * );
 */
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText: string = 'Confirmar',
  cancelText: string = 'Cancelar'
): void => {
  if (Platform.OS === 'web') {
    // Web: usa window.confirm
    const confirmed = window.confirm(`${title}\n\n${message}`);
    
    if (confirmed) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
  } else {
    // Mobile: usa Alert.alert com botões
    Alert.alert(title, message, [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: 'destructive',
        onPress: onConfirm,
      },
    ]);
  }
};

/**
 * Exibe um alerta de erro
 * @param message - Mensagem de erro
 * 
 * @example
 * showError('Não foi possível conectar ao servidor');
 */
export const showError = (message: string): void => {
  showAlert('❌ Erro', message);
};

/**
 * Exibe um alerta de sucesso
 * @param message - Mensagem de sucesso
 * 
 * @example
 * showSuccess('Dados salvos com sucesso!');
 */
export const showSuccess = (message: string): void => {
  showAlert('✅ Sucesso', message);
};

/**
 * Exibe um alerta de aviso
 * @param message - Mensagem de aviso
 * 
 * @example
 * showWarning('Sua sessão está prestes a expirar');
 */
export const showWarning = (message: string): void => {
  showAlert('⚠️ Atenção', message);
};

/**
 * Exibe um alerta de informação
 * @param message - Mensagem informativa
 * 
 * @example
 * showInfo('Esta funcionalidade estará disponível em breve');
 */
export const showInfo = (message: string): void => {
  showAlert('ℹ️ Informação', message);
};
