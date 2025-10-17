/**
 * ============================================
 * DATE UTILS - Utilitários de Data
 * ============================================
 * 
 * Funções para formatação e cálculos com datas.
 */

/**
 * Formata uma data para o padrão brasileiro
 * @param dateString - String de data ISO ou timestamp
 * @returns Data formatada em pt-BR
 * 
 * @example
 * formatDateBR('2025-10-16T10:00:00Z') // '16 de outubro de 2025'
 */
export const formatDateBR = (dateString: string): string => {
  if (!dateString) return 'Data não disponível';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    return 'Data não disponível';
  }
};

/**
 * Formata uma data para o formato curto (dd/mm/yyyy)
 * @param dateString - String de data ISO ou timestamp
 * @returns Data formatada em dd/mm/yyyy
 * 
 * @example
 * formatDateShort('2025-10-16T10:00:00Z') // '16/10/2025'
 */
export const formatDateShort = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Calcula diferença em dias entre uma data e agora
 * @param dateString - Data inicial
 * @returns Número de dias desde a data
 * 
 * @example
 * getDaysSince('2025-10-01T00:00:00Z') // 15
 */
export const getDaysSince = (dateString: string): number => {
  if (!dateString) return 0;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return 0;
    }
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    return 0;
  }
};

/**
 * Calcula diferença em horas entre uma data e agora
 * @param dateString - Data inicial
 * @returns Número de horas desde a data
 */
export const getHoursSince = (dateString: string): number => {
  if (!dateString) return 0;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return 0;
    }
    
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    return diffHours;
  } catch (error) {
    return 0;
  }
};

/**
 * Retorna tempo relativo (ex: "há 2 dias", "há 3 horas")
 * @param dateString - Data para calcular
 * @returns String de tempo relativo
 * 
 * @example
 * getRelativeTime('2025-10-14T10:00:00Z') // 'há 2 dias'
 */
export const getRelativeTime = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    const diffTime = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffYears > 0) {
      return `há ${diffYears} ${diffYears === 1 ? 'ano' : 'anos'}`;
    }
    if (diffMonths > 0) {
      return `há ${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
    }
    if (diffDays > 0) {
      return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    }
    if (diffHours > 0) {
      return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    }
    if (diffMinutes > 0) {
      return `há ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    return 'agora mesmo';
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Verifica se uma data é hoje
 * @param dateString - Data para verificar
 * @returns true se for hoje, false caso contrário
 */
export const isToday = (dateString: string): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
};

/**
 * Verifica se uma data é esta semana
 * @param dateString - Data para verificar
 * @returns true se for esta semana, false caso contrário
 */
export const isThisWeek = (dateString: string): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return date >= weekAgo && date <= today;
  } catch (error) {
    return false;
  }
};

/**
 * Formata uma data ISO para exibição no formato DD/MM/YYYY
 * @param dateString - Data ISO (YYYY-MM-DD) ou objeto Date
 * @returns Data formatada DD/MM/YYYY
 * 
 * @example
 * formatDateForDisplay('2000-05-15') // '15/05/2000'
 */
export const formatDateForDisplay = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Usar UTC para evitar problemas de timezone
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return '';
  }
};

/**
 * Converte data do input (DD/MM/YYYY) para objeto Date
 * @param dateInput - Data no formato DD/MM/YYYY
 * @returns Objeto Date ou null se inválido
 * 
 * @example
 * parseDateFromInput('15/05/2000') // Date object
 */
export const parseDateFromInput = (dateInput: string): Date | null => {
  if (!dateInput || dateInput.length !== 10) return null;
  
  try {
    const parts = dateInput.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexed
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (day < 1 || day > 31) return null;
    if (month < 0 || month > 11) return null;
    if (year < 1900 || year > new Date().getFullYear()) return null;
    
    const date = new Date(year, month, day);
    
    // Verificar se a data é válida
    if (
      date.getDate() !== day ||
      date.getMonth() !== month ||
      date.getFullYear() !== year
    ) {
      return null;
    }
    
    return date;
  } catch (error) {
    return null;
  }
};
