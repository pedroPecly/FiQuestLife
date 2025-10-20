/**
 * ============================================
 * CONFIGURAÇÃO DO SUPABASE CLIENT
 * ============================================
 * 
 * Supabase é tipo um "Firebase do PostgreSQL".
 * Ele dá de graça:
 * - Banco de dados PostgreSQL
 * - Autenticação (login, registro, etc)
 * - Storage (pra guardar imagens/arquivos)
 * - Realtime (tipo websockets)
 * 
 * Aqui a gente configura o cliente pra usar essas features.
 * 
 * ============================================
 * DIFERENÇA ENTRE PRISMA E SUPABASE CLIENT
 * ============================================
 * 
 * - PRISMA: Usado pra fazer queries no banco (SELECT, INSERT, etc)
 * - SUPABASE: Usado pra autenticação, storage, realtime, etc
 * 
 * Dá pra usar os dois juntos de boa!
 */

import { createClient } from '@supabase/supabase-js';

// Pega as variáveis de ambiente do arquivo .env
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Chave privada com permissões de admin

// Cria e exporta o cliente do Supabase usando Service Role Key
// Isso dá permissões administrativas para fazer uploads no Storage
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * ============================================
 * COMO USAR ESSE ARQUIVO?
 * ============================================
 * 
 * Importe em qualquer arquivo:
 *   import { supabase } from './lib/supabase.js';
 * 
 * Exemplos de uso:
 * 
 * 1. Autenticação:
 *    const { data, error } = await supabase.auth.signUp({
 *      email: 'user@email.com',
 *      password: 'senha123'
 *    });
 * 
 * 2. Upload de arquivo:
 *    const { data, error } = await supabase.storage
 *      .from('avatars')
 *      .upload('profile.png', file);
 * 
 * 3. Realtime (tipo chat ao vivo):
 *    supabase
 *      .channel('messages')
 *      .on('postgres_changes', { ... })
 *      .subscribe();
 */
