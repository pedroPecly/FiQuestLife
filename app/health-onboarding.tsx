/**
 * 🏥 Health Onboarding Route
 * 
 * Rota acessível via:
 * - Configurações > Conectar Apple Health / Google Fit
 * - URL: /health-onboarding
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { HealthOnboardingScreen } from './screens';

export default function HealthOnboardingRoute() {
  const router = useRouter();

  return (
    <HealthOnboardingScreen
      onComplete={() => router.back()}
      onSkip={() => router.back()}
    />
  );
}
