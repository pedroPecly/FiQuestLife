/**
 * ============================================
 * ROTA STANDALONE: LOJA & MOCHILA
 * ============================================
 *
 * Tela de Loja e Inventário como página independente,
 * fora da barra de navegação inferior.
 *
 * Padrão idêntico a history.tsx e edit-profile.tsx:
 *  - Existe apenas no Stack raiz (sem espelho em (tabs)/)
 *  - Sem tab bar
 *  - Animação slide_from_right
 *  - SimpleHeader com botão voltar
 */

import { Stack } from 'expo-router';
import ShopAndInventoryScreen from './screens/ShopAndInventoryScreen';

export default function LojaRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      />
      <ShopAndInventoryScreen />
    </>
  );
}
