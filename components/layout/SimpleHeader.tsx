/**
 * ============================================
 * SIMPLE HEADER - Header Simples com Botão Voltar
 * ============================================
 *
 * Header minimalista com:
 * - Botão voltar (opcional)
 * - Título centralizado
 * - Espaçador para manter título centralizado
 *
 * @created 2 de novembro de 2025
 */

import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SimpleHeaderProps {
  /**
   * Título exibido no centro do header
   */
  title: string;
  
  /**
   * Se true, exibe o botão de voltar (default: true)
   */
  showBackButton?: boolean;
  
  /**
   * Função customizada ao clicar em voltar
   * Se não fornecida, usa router.back()
   */
  onBack?: () => void;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  title,
  showBackButton = true,
  onBack,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessible={true}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
        
        <Text style={styles.headerTitle}>{title}</Text>
        
        <View style={styles.headerSpacer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: StatusBar.currentHeight || 0, // Android
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#007AFF',
    marginTop: -4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
});
