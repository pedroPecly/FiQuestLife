/**
 * ============================================
 * TIPOS DO USUÁRIO
 * ============================================
 * 
 * Definições de tipos TypeScript para o modelo User
 */

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  birthDate: string;
  bio?: string;
  avatarUrl?: string;
  xp: number;
  coins: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  notificationsEnabled: boolean;
  dailyReminderTime?: string;
  profilePublic: boolean;
  createdAt: string;
  updatedAt: string;
}
