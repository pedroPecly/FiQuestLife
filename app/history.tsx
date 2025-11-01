/**
 * ============================================
 * ROTA: HISTÓRICO DE RECOMPENSAS
 * ============================================
 *
 * Rota para a tela de histórico de recompensas
 */

import { Stack } from 'expo-router';
import RewardHistoryScreen from './screens/RewardHistoryScreen';

export default function HistoryRoute() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <RewardHistoryScreen />
    </>
  );
}
