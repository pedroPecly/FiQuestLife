/**
 * ============================================
 * ROTA STANDALONE: CONQUISTAS / TROFÉUS
 * ============================================
 *
 * Tela de Conquistas como página independente,
 * fora da barra de navegação inferior.
 *
 * Padrão idêntico a loja.tsx e edit-profile.tsx:
 *  - Existe apenas no Stack raiz (sem espelho visível em (tabs)/)
 *  - Sem tab bar
 *  - Animação slide_from_right
 *  - SimpleHeader com botão voltar
 */

import { Stack } from 'expo-router';
import { BadgesScreen } from './screens';

export default function ConquistasRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      />
      <BadgesScreen />
    </>
  );
}
