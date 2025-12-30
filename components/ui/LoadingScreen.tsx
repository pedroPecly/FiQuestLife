/**
 * ============================================
 * LOADING SCREEN - Tela de Carregamento
 * ============================================
 * 
 * Componente reutilizável para exibir estados de loading
 * em qualquer tela da aplicação.
 * 
 * Props:
 * - message?: string - Mensagem customizável (padrão: "Carregando...")
 * - color?: string - Cor do spinner (padrão: "#20B2AA")
 */

import React from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
} from 'react-native';

interface LoadingScreenProps {
  message?: string;
  color?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Carregando...',
  color = '#20B2AA',
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ActivityIndicator size="large" color={color} />
      <Text style={styles.text}>{message}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});
