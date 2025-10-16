/**
 * ============================================
 * VALIDATORS - Validadores de Formulário
 * ============================================
 * 
 * Funções utilitárias para validação de dados de entrada.
 * Centralizadas para reutilização em toda a aplicação.
 */

/**
 * Valida formato de email
 * @param email - Email a ser validado
 * @returns true se válido, false caso contrário
 * 
 * @example
 * validateEmail('user@example.com') // true
 * validateEmail('invalid') // false
 */
export const validateEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) {
    return false;
  }
  
  // Regex simples para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida username (letras, números e underscore)
 * @param username - Username a ser validado
 * @returns true se válido, false caso contrário
 * 
 * @example
 * validateUsername('john_doe123') // true
 * validateUsername('jo') // false (muito curto)
 * validateUsername('john@doe') // false (caractere inválido)
 */
export const validateUsername = (username: string): boolean => {
  if (!username || username.trim().length < 3) {
    return false;
  }
  
  // Apenas letras, números e underscore, mínimo 3 caracteres
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username.trim());
};

/**
 * Valida senha (mínimo 6 caracteres)
 * @param password - Senha a ser validada
 * @returns true se válida, false caso contrário
 * 
 * @example
 * validatePassword('secret123') // true
 * validatePassword('12345') // false (muito curta)
 */
export const validatePassword = (password: string): boolean => {
  if (!password) {
    return false;
  }
  
  return password.length >= 6;
};

/**
 * Valida senha forte (requisitos mais rigorosos)
 * - Mínimo 8 caracteres
 * - Pelo menos uma letra maiúscula
 * - Pelo menos uma letra minúscula
 * - Pelo menos um número
 * 
 * @param password - Senha a ser validada
 * @returns true se válida, false caso contrário
 */
export const validateStrongPassword = (password: string): boolean => {
  if (!password || password.length < 8) {
    return false;
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Valida nome completo (mínimo 2 palavras)
 * @param name - Nome a ser validado
 * @returns true se válido, false caso contrário
 * 
 * @example
 * validateFullName('John Doe') // true
 * validateFullName('John') // false (apenas um nome)
 */
export const validateFullName = (name: string): boolean => {
  if (!name || name.trim().length === 0) {
    return false;
  }
  
  const parts = name.trim().split(' ').filter(part => part.length > 0);
  return parts.length >= 2;
};

/**
 * Valida número de telefone brasileiro
 * @param phone - Telefone a ser validado (pode incluir máscara)
 * @returns true se válido, false caso contrário
 * 
 * @example
 * validatePhoneBR('(11) 98765-4321') // true
 * validatePhoneBR('11987654321') // true
 */
export const validatePhoneBR = (phone: string): boolean => {
  if (!phone) {
    return false;
  }
  
  // Remove caracteres não numéricos
  const numbersOnly = phone.replace(/\D/g, '');
  
  // Verifica se tem 10 ou 11 dígitos (com ou sem 9 na frente)
  return numbersOnly.length === 10 || numbersOnly.length === 11;
};
