/**
 * ============================================
 * CHALLENGE CONTROLLER - Controlador de Desafios
 * ============================================
 * 
 * Endpoints da API de desafios:
 * - GET /challenges/daily - Busca desafios diários
 * - POST /challenges/:id/complete - Completa um desafio
 * - GET /challenges/history - Histórico de desafios
 * - GET /challenges/all - Todos os desafios (admin)
 * 
 * @created 20 de outubro de 2025
 */

import type { Context } from 'hono';
import {
    assignDailyChallenges,
    completeChallenge,
    getAllChallenges,
    getChallengeHistory,
    getUserDailyChallenges,
} from '../services/challenge.service.js';

/**
 * GET /challenges/daily
 * Busca ou atribui desafios diários do usuário
 */
export const getDailyChallenges = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    // Tenta buscar desafios existentes
    let challenges = await getUserDailyChallenges(userId);

    // Se não existem, atribui novos
    if (challenges.length === 0) {
      challenges = await assignDailyChallenges(userId);
    }

    return c.json({
      success: true,
      data: challenges,
      message: `${challenges.length} desafios diários`,
    });
  } catch (error) {
    console.error('Error in getDailyChallenges:', error);
    return c.json(
      {
        error: 'Erro ao buscar desafios',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * POST /challenges/:id/complete
 * Completa um desafio e dá recompensas
 * Suporta upload de foto via multipart/form-data
 */
export const completeChallengeById = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };
    const userChallengeId = c.req.param('id');

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    if (!userChallengeId) {
      return c.json({ error: 'ID do desafio não fornecido' }, 400);
    }

    // Tentar parsear como form-data (se houver foto) ou JSON
    let photoUrl: string | undefined;
    let caption: string | undefined;

    const contentType = c.req.header('content-type');
    
    // Se for JSON, pode ser auto-complete do tracking automático
    if (contentType?.includes('application/json')) {
      const body = await c.req.json();
      caption = body.caption;
    }
    // Se for form-data, tem foto
    else if (contentType?.includes('multipart/form-data')) {
      const body = await c.req.parseBody();
      const photo = body.photo as File | undefined;
      caption = body.caption as string | undefined;

      // Se houver foto, fazer upload
      if (photo) {
        // Validar tipo de arquivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(photo.type)) {
          return c.json(
            { error: 'Tipo de arquivo inválido. Use JPEG, PNG ou WebP' },
            400
          );
        }

        // Validar tamanho (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (photo.size > maxSize) {
          return c.json(
            { error: 'Arquivo muito grande. Tamanho máximo: 5MB' },
            400
          );
        }

        // Gerar nome único para o arquivo
        const fileExt = photo.name.split('.').pop();
        const fileName = `${userId}_${userChallengeId}_${Date.now()}.${fileExt}`;
        const filePath = `challenge-photos/${fileName}`;

        // Converter File para ArrayBuffer
        const arrayBuffer = await photo.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Import do supabase (será necessário adicionar no início do arquivo)
        const { supabase } = await import('../lib/supabase.js');

        // Upload para Supabase Storage
        const { error } = await supabase.storage
          .from('challenge-photos')
          .upload(filePath, buffer, {
            contentType: photo.type,
            upsert: false,
          });

        if (error) {
          console.error('Erro ao fazer upload da foto:', error);
          return c.json({ error: 'Erro ao fazer upload da foto' }, 500);
        }

        // Obter URL pública
        const { data: publicUrlData } = supabase.storage
          .from('challenge-photos')
          .getPublicUrl(filePath);

        photoUrl = publicUrlData.publicUrl;
      }
    }

    const result = await completeChallenge(userId, userChallengeId, photoUrl, caption);

    return c.json({
      success: true,
      data: result,
      message: 'Desafio completado com sucesso!',
      // Retorna notificação para o frontend salvar localmente
      notification: result.notification || null,
    });
  } catch (error) {
    console.error('Error in completeChallengeById:', error);

    if (error instanceof Error) {
      if (error.message === 'Desafio não encontrado') {
        return c.json({ error: error.message }, 404);
      }
      if (
        error.message === 'Este desafio não pertence a você' ||
        error.message === 'Desafio já completado'
      ) {
        return c.json({ error: error.message }, 403);
      }
      if (error.message.includes('requer uma foto')) {
        return c.json({ error: error.message }, 400);
      }
    }

    return c.json(
      {
        error: 'Erro ao completar desafio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * GET /challenges/history
 * Busca histórico de desafios completados
 */
export const getHistory = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const userId = user.userId;

    // Query param para limit (padrão: 50)
    const limitParam = c.req.query('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const history = await getChallengeHistory(userId, limit);

    return c.json({
      success: true,
      data: history,
      message: `${history.length} desafios completados`,
    });
  } catch (error) {
    console.error('Error in getHistory:', error);
    return c.json(
      {
        error: 'Erro ao buscar histórico',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};

/**
 * GET /challenges/all
 * Busca todos os desafios disponíveis (admin/debug)
 */
export const getAllChallengesController = async (c: Context) => {
  try {
    const user = c.get('user') as { userId: string; email: string };

    if (!user || !user.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    //const userId = user.userId;

    const challenges = await getAllChallenges();

    return c.json({
      success: true,
      data: challenges,
      message: `${challenges.length} desafios disponíveis`,
    });
  } catch (error) {
    console.error('Error in getAllChallengesController:', error);
    return c.json(
      {
        error: 'Erro ao buscar desafios',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
};
