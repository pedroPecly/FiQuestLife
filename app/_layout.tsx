import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      {/* O Stack é o navegador que empilha suas telas */}
      <Stack>
        {/* 1. Definimos a tela inicial (nosso login). headerShown: false esconde o cabeçalho. */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* 2. Definimos o grupo de telas com abas, para onde iremos após o login. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* 3. Mantemos a tela modal, caso queira usá-la. */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      
      {/* O StatusBar pode ficar aqui para controlar a cor dos ícones do celular */}
      <StatusBar style="auto" />
    </>
  );
}