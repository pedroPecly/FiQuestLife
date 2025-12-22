/**
 * ============================================
 * CHALLENGE INVITATION UTILS
 * ============================================
 * 
 * Utilitários para gerenciar convites de desafios
 */

import { ChallengeInvitation } from '../services/challengeInvitation';

/**
 * Verifica se um convite está expirado
 */
export const isInvitationExpired = (invitation: ChallengeInvitation): boolean => {
  const now = new Date();
  const expiresAt = new Date(invitation.expiresAt);
  return now > expiresAt;
};

/**
 * Retorna o tempo restante até a expiração do convite em formato legível
 * @returns string no formato "23h 45min" ou "Expirado"
 */
export const getTimeUntilExpiration = (invitation: ChallengeInvitation): string => {
  const now = new Date();
  const expiresAt = new Date(invitation.expiresAt);
  const diffMs = expiresAt.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Expirado';
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${minutes}min`;
};

/**
 * Retorna a porcentagem de tempo decorrido desde a criação até a expiração
 * Útil para mostrar uma barra de progresso visual
 */
export const getExpirationProgress = (invitation: ChallengeInvitation): number => {
  const createdAt = new Date(invitation.createdAt);
  const expiresAt = new Date(invitation.expiresAt);
  const now = new Date();

  const totalDuration = expiresAt.getTime() - createdAt.getTime();
  const elapsed = now.getTime() - createdAt.getTime();

  const progress = (elapsed / totalDuration) * 100;
  return Math.min(Math.max(progress, 0), 100); // Limita entre 0-100
};

/**
 * Filtra convites não expirados
 */
export const filterValidInvitations = (
  invitations: ChallengeInvitation[]
): ChallengeInvitation[] => {
  return invitations.filter((inv) => !isInvitationExpired(inv));
};

/**
 * Ordena convites por tempo de expiração (os que expiram primeiro aparecem no topo)
 */
export const sortByExpiration = (
  invitations: ChallengeInvitation[]
): ChallengeInvitation[] => {
  return [...invitations].sort((a, b) => {
    const aExpires = new Date(a.expiresAt).getTime();
    const bExpires = new Date(b.expiresAt).getTime();
    return aExpires - bExpires;
  });
};
