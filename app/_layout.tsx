import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Modal, Platform } from 'react-native';
import { useAppState } from '../hooks/useAppState';
import { useNotifications } from '../hooks/useNotifications';
import ActivitySyncService from '../services/activitySync';
import { authStorage } from '../services/auth';
import MultiTrackerService from '../services/multiTracker';
import { HealthOnboardingScreen } from './screens';

const HEALTH_ONBOARDING_KEY = '@FiQuestLife:healthOnboardingShown';

// Verifica se é Expo Go (não suporta react-native-health)
const isExpoGo = Constants.appOwnership === 'expo';

export default function RootLayout() {
  // Inicializa sistema de notificações globalmente
  useNotifications();
  
  const router = useRouter();
  const appState = useAppState();
  const lastSyncRef = useRef<number>(0);
  const alertTimeoutRef = useRef<NodeJS.Timeout>();
  const [showHealthOnboarding, setShowHealthOnboarding] = useState(false);
  const checkHealthOnboardingRef = useRef(false);

  // Cleanup do timeout quando componente desmontar
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  // Verificar se deve mostrar Health onboarding (apenas iOS/Android + não Expo Go)
  useEffect(() => {
    const checkHealthOnboarding = async () => {
      // Evitar múltiplas verificações
      if (checkHealthOnboardingRef.current) return;
      checkHealthOnboardingRef.current = true;

      // Não mostrar no Expo Go (não funciona)
      if (isExpoGo) {
        console.log('[HEALTH ONBOARDING] ⚠️ Pulado: Expo Go não suporta react-native-health');
        return;
      }

      // Apenas em plataformas nativas
      if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

      // Aguardar 3 segundos após app abrir (UX melhor)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const shown = await AsyncStorage.getItem(HEALTH_ONBOARDING_KEY);
      if (!shown) {
        setShowHealthOnboarding(true);
      }
    };

    checkHealthOnboarding();
  }, []);

  // Callback para quando onboarding for completo
  const handleHealthOnboardingComplete = useCallback(async () => {
    await AsyncStorage.setItem(HEALTH_ONBOARDING_KEY, 'true');
    setShowHealthOnboarding(false);
  }, []);

  // Função memoizada para evitar re-criação a cada render
  const syncActivities = useCallback(async () => {
    try {
      // ✅ VERIFICAR SE ESTÁ AUTENTICADO ANTES DE SINCRONIZAR
      const isAuthenticated = await authStorage.isLoggedIn();
      if (!isAuthenticated) {
        console.log('[ROOT LAYOUT] ⚠️ Usuário não autenticado, pulando sync');
        return;
      }

      lastSyncRef.current = Date.now();
      const results = await ActivitySyncService.syncActivityOnAppOpen();
      
      // Filtrar desafios completados
      const completed = results.filter(r => r.completed);
      
      if (completed.length > 0) {
        // Limpar timeout anterior se existir
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
        }
        
        // Exibir alerta de conquista com cleanup
        alertTimeoutRef.current = setTimeout(() => {
          Alert.alert(
            '🎉 Parabéns!',
            completed.length === 1
              ? `Você completou o desafio "${completed[0].title}" automaticamente!`
              : `Você completou ${completed.length} desafios automaticamente!`,
            [
              { 
                text: 'Ver Badges', 
                onPress: () => router.push('/(tabs)/badges')
              },
              { text: 'OK', style: 'cancel' },
            ]
          );
        }, 1000); // Delay de 1s para garantir que UI está pronta
      }
    } catch (error) {
      console.error('[ROOT LAYOUT] Erro ao sincronizar atividades:', error);
      // Falha silenciosa - não incomodar o usuário
    }
  }, [router]);

  // Sync ao montar o componente (primeira vez que abre o app)
  useEffect(() => {
    syncActivities();
    
    // Inicializar MultiTrackerService
    const initMultiTracker = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        await MultiTrackerService.loadSessionsFromStorage();
        console.log('[ROOT LAYOUT] ✅ MultiTrackerService inicializado');
      } catch (error) {
        console.error('[ROOT LAYOUT] ⚠️ Erro ao inicializar MultiTrackerService:', error);
      }
    };
    
    initMultiTracker();
  }, [syncActivities]);

  // Sync quando app volta ao foreground
  useEffect(() => {
    if (appState === 'active') {
      // Evitar sync múltiplo (mínimo 10 segundos entre syncs)
      const now = Date.now();
      if (now - lastSyncRef.current > 10000) {
        syncActivities();
      }
    }
  }, [appState, syncActivities]);
  
  return (
    <>
      {/* O Stack é o navegador que empilha suas telas */}
      <Stack
        screenOptions={{
          // Animação suave para todas as transições de tela
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        {/* 1. Definimos a tela inicial (nosso login). headerShown: false esconde o cabeçalho. */}
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            animation: 'fade', // Fade para tela de login
          }} 
        />
        
        {/* 2. Definimos o grupo de telas com abas, para onde iremos após o login. */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animation: 'fade', // Fade ao entrar nas tabs
          }} 
        />
        
        {/* 3. Tela de edição de perfil */}
        <Stack.Screen 
          name="edit-profile" 
          options={{ 
            headerShown: false,
            animation: 'slide_from_right', // Slide da direita (iOS e Android style)
            animationDuration: 300,
          }} 
        />
      </Stack>
      
      {/* O StatusBar pode ficar aqui para controlar a cor dos ícones do celular */}
      <StatusBar style="auto" />

      {/* Modal de Health Onboarding (primeira vez) */}
      <Modal
        visible={showHealthOnboarding}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <HealthOnboardingScreen
          onComplete={handleHealthOnboardingComplete}
          onSkip={handleHealthOnboardingComplete}
        />
      </Modal>
    </>
  );
}