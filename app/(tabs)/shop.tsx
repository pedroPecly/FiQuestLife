/**
 * Este arquivo mantém a rota /(tabs)/shop registrada no _layout.tsx
 * (necessário para href: null funcionar no Expo Router),
 * mas redireciona imediatamente para a rota standalone /loja
 * que não possui a barra de navegação inferior.
 */

import { Redirect } from 'expo-router';
import React from 'react';

export default function ShopTabRedirect() {
  return <Redirect href="/loja" />;
}
