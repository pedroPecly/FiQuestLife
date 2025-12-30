/**
 * ============================================
 * USE APP STATE HOOK
 * ============================================
 * 
 * Hook para detectar mudanças no estado do app (foreground/background).
 * Útil para disparar sincronizações quando o usuário volta ao app.
 * 
 * Estados:
 * - 'active': App está em foreground e ativo
 * - 'background': App está em background
 * - 'inactive': App está em transição
 * 
 * @created 30/12/2025
 */

import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook para detectar quando o app volta ao foreground
 * 
 * @returns Estado atual do app ('active' | 'background' | 'inactive')
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const appState = useAppState();
 *   
 *   useEffect(() => {
 *     if (appState === 'active') {
 *       // App voltou ao foreground
 *       syncData();
 *     }
 *   }, [appState]);
 * }
 * ```
 */
export function useAppState(): AppStateStatus {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('[APP STATE] Mudança detectada:', appState, '→', nextAppState);
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return appState;
}
