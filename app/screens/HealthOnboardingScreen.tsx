/**
 * 🏥 Health Integration Onboarding Screen
 * 
 * Tela para conectar Apple Health (iOS) ou Google Fit (Android)
 * Exibida na primeira vez que o usuário abre o app ou via Configurações
 */

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import HealthKitService from '@/services/healthKit';
import GoogleFitService from '@/services/googleFit';

interface HealthOnboardingScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function HealthOnboardingScreen({ onComplete, onSkip }: HealthOnboardingScreenProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const serviceName = Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit';
  const serviceIcon = Platform.OS === 'ios' ? 'heart' : 'fitness';

  async function handleConnect() {
    setLoading(true);

    try {
      let success = false;

      if (Platform.OS === 'ios') {
        success = await HealthKitService.initialize();
      } else if (Platform.OS === 'android') {
        success = await GoogleFitService.initialize();
      }

      setLoading(false);

      if (success) {
        console.log(`[ONBOARDING] ✅ ${serviceName} conectado com sucesso`);
        onComplete();
      } else {
        alert(
          `Não foi possível conectar ao ${serviceName}. ` +
          `Você pode tentar novamente mais tarde nas configurações do app.`
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('[ONBOARDING] Erro ao conectar:', error);
      alert('Erro ao conectar. Tente novamente mais tarde.');
    }
  }

  function handleSkip() {
    console.log('[ONBOARDING] Usuário pulou integração Health');
    onSkip ? onSkip() : onComplete();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name={serviceIcon as any} size={100} color="#20B2AA" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Conectar ao {serviceName}</Text>

      {/* Description */}
      <Text style={styles.description}>
        Permita que o FiQuestLife leia seus dados de atividade para atualizar seus desafios automaticamente.
      </Text>

      {/* Benefits */}
      <View style={styles.benefits}>
        <Benefit
          icon="checkmark-circle"
          text="Desafios completam automaticamente"
          color="#4CAF50"
        />
        <Benefit
          icon={Platform.OS === 'ios' ? 'watch' : 'watch-outline'}
          text={Platform.OS === 'ios' ? 'Integração com Apple Watch' : 'Integração com smartwatches'}
          color="#2196F3"
        />
        <Benefit
          icon="trending-up"
          text="Dados mais precisos e confiáveis"
          color="#FF9800"
        />
        <Benefit
          icon="battery-charging"
          text="Baixo consumo de bateria"
          color="#8BC34A"
        />
      </View>

      {/* Privacy Note */}
      <View style={styles.privacyNote}>
        <Ionicons name="shield-checkmark" size={20} color="#999" />
        <Text style={styles.privacyText}>
          Seus dados de saúde são privados e ficam apenas no seu dispositivo.
          O FiQuestLife apenas lê informações básicas de atividade física.
        </Text>
      </View>

      {/* Connect Button */}
      <TouchableOpacity
        style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]}
        onPress={handleConnect}
        disabled={loading}
      >
        <Text style={styles.buttonTextPrimary}>
          {loading ? 'Conectando...' : `Conectar ao ${serviceName}`}
        </Text>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={handleSkip}
        disabled={loading}
      >
        <Text style={styles.buttonTextSecondary}>Pular por enquanto</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        Você pode conectar ou desconectar a qualquer momento nas Configurações
      </Text>
    </ScrollView>
  );
}

function Benefit({ icon, text, color }: { icon: string; text: string; color: string }) {
  return (
    <View style={styles.benefit}>
      <Ionicons name={icon as any} size={28} color={color} />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  benefits: {
    width: '100%',
    marginBottom: 24,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    flex: 1,
    fontWeight: '500',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
  },
  privacyText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#20B2AA',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 18,
  },
});
