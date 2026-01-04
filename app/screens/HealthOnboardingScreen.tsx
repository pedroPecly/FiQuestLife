import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HealthOnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function HealthOnboardingScreen({ onComplete, onSkip }: HealthOnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.emoji}>🏃‍♂️💪</Text>
        <Text style={styles.title}>Sincronize suas Atividades</Text>
        <Text style={styles.description}>
          FiQuestLife pode sincronizar automaticamente suas atividades físicas 
          {Platform.OS === 'ios' ? ' do Apple Health' : ' do Google Fit'} para 
          completar desafios automaticamente!
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>✅</Text>
            <Text style={styles.featureText}>Complete desafios automaticamente</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <Text style={styles.featureText}>Rastreamento preciso de atividades</Text>
          </View>
          
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🔒</Text>
            <Text style={styles.featureText}>Seus dados permanecem privados</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Permitir Acesso</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={onSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Pular por Agora</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
