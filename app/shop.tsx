/**
 * Redireciona /shop → /loja para evitar ambiguidade com (tabs)/shop.
 * A rota canônica standalone é app/loja.tsx.
 */

import { Redirect } from 'expo-router';
import React from 'react';

export default function ShopRedirect() {
  return <Redirect href="/loja" />;
}
