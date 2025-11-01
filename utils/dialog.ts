import { Alert, Platform } from 'react-native';

export interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const showDialog = ({
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: DialogOptions): void => {
  if (Platform.OS === 'web') {
    // Para web, usar confirm nativo
    const result = window.confirm(`${title}\n\n${message}`);
    if (result && onConfirm) {
      onConfirm();
    } else if (!result && onCancel) {
      onCancel();
    }
  } else {
    // Para mobile, usar Alert do React Native
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: 'default',
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  }
};

export const showAlert = (title: string, message: string): void => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }
};

export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void => {
  showDialog({
    title,
    message,
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    onConfirm,
    onCancel,
  });
};
