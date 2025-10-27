import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

export default function RootLayout() {
  // Inicializa sistema de notificações globalmente
  useNotifications();
  
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
    </>
  );
}