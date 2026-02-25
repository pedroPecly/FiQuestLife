/**
 * Mantém a rota (tabs)/badges registrada no _layout.tsx
 * para que href: null funcione sem erros no Expo Router.
 * Redireciona imediatamente para a rota standalone /conquistas.
 */

import { Redirect } from 'expo-router';
import React from 'react';

export default function BadgesTabRedirect() {
  return <Redirect href="/conquistas" />;
}
