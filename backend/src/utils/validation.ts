/**
 * ============================================
 * VALIDATION UTILITIES
 * ============================================
 * 
 * Funções de validação e sanitização
 * 
 * @created 2 de novembro de 2025
 */

/**
 * Valida se uma string é um UUID válido (v4)
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitiza uma string de busca
 * - Remove caracteres especiais perigosos
 * - Limita tamanho
 * - Remove espaços extras
 */
export function sanitizeSearchTerm(term: string, maxLength = 50): string {
  return term
    .trim()
    .replace(/[<>"';(){}[\]]/g, '') // Remove caracteres perigosos
    .substring(0, maxLength)
    .trim();
}

/**
 * Valida termo de busca
 * - Mínimo 3 caracteres
 * - Máximo 50 caracteres
 */
export function validateSearchTerm(term: string): {
  valid: boolean;
  error?: string;
  sanitized?: string;
} {
  if (!term || term.trim().length < 3) {
    return {
      valid: false,
      error: 'Busca deve ter pelo menos 3 caracteres',
    };
  }

  if (term.length > 50) {
    return {
      valid: false,
      error: 'Busca muito longa (máximo 50 caracteres)',
    };
  }

  const sanitized = sanitizeSearchTerm(term);

  if (sanitized.length < 3) {
    return {
      valid: false,
      error: 'Busca inválida após sanitização',
    };
  }

  return {
    valid: true,
    sanitized,
  };
}

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida username
 * - 3-20 caracteres
 * - Apenas letras, números e underscore
 */
export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (!username || username.length < 3) {
    return {
      valid: false,
      error: 'Username deve ter pelo menos 3 caracteres',
    };
  }

  if (username.length > 20) {
    return {
      valid: false,
      error: 'Username deve ter no máximo 20 caracteres',
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      error: 'Username deve conter apenas letras, números e _',
    };
  }

  return {
    valid: true,
  };
}
