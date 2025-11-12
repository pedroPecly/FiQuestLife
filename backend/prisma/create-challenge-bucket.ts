/**
 * Script para criar o bucket de fotos de desafios no Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createChallengeBucket() {
  console.log('🪣 Criando bucket challenge-photos...\n');

  // Verificar se o bucket já existe
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('❌ Erro ao listar buckets:', listError);
    process.exit(1);
  }

  const bucketExists = buckets?.some((bucket) => bucket.name === 'challenge-photos');

  if (bucketExists) {
    console.log('✅ Bucket challenge-photos já existe!');
    return;
  }

  // Criar o bucket
  const { data, error } = await supabase.storage.createBucket('challenge-photos', {
    public: true, // Fotos públicas
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  });

  if (error) {
    console.error('❌ Erro ao criar bucket:', error);
    process.exit(1);
  }

  console.log('✅ Bucket challenge-photos criado com sucesso!');
  console.log('📋 Configuração:');
  console.log('   - Público: Sim');
  console.log('   - Tamanho máximo: 5MB');
  console.log('   - Tipos permitidos: JPEG, PNG, WebP');
}

createChallengeBucket()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
