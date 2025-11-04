/**
 * ============================================
 * ROTAS DE USUÁRIO (PROTEGIDAS)
 * ============================================
 *
 * Rotas que exigem autenticação JWT
 * Todas as rotas aqui precisam de token válido
 */

import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import * as feedService from '../services/feed.service.js';
import * as userActivityService from '../services/user-activity.service.js';

const user = new Hono();

/**
 * GET /user/me
 * Retorna o perfil COMPLETO do usuário logado
 * 
 * Precisa enviar o token no header:
 * Authorization: Bearer SEU_TOKEN_AQUI
 * 
 * Retorna todos os dados do perfil (exceto senha):
 * - Dados básicos (email, username, name, bio)
 * - Dados de gamificação (xp, coins, level, streaks)
 * - Configurações (notificações, privacidade)
 */
user.get('/me', authMiddleware, async (c) => {
  try {
    // O middleware já validou o token e colocou os dados em c.get('user')
    // @ts-ignore - TypeScript não reconhece variáveis customizadas no contexto
    const userData = c.get('user') as { userId: string; email: string };
    
    // Busca o perfil completo do usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userData.userId },
      select: {
        // ===== DADOS BÁSICOS =====
        id: true,
        email: true,
        username: true,
        name: true,
        birthDate: true,
        bio: true,
        avatarUrl: true,
        
        // ===== GAMIFICAÇÃO =====
        xp: true,
        coins: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
        
        // ===== CONFIGURAÇÕES =====
        notificationsEnabled: true,
        dailyReminderTime: true,
        profilePublic: true,
        
        // ===== METADADOS =====
        createdAt: true,
        updatedAt: true,
        
        // ===== SEGURANÇA =====
        password: false, // NUNCA retorna a senha!
      },
    });
    
    // Se o usuário não existir no banco (improvável, mas possível)
    if (!user) {
      return c.json({ 
        error: 'Usuário não encontrado. O token pode estar corrompido.' 
      }, 404);
    }
    
    // Retorna o perfil completo
    return c.json({
      message: 'Perfil carregado com sucesso!',
      user,
    });
    
  } catch (error) {
    // Se der erro ao buscar no banco
    console.error('Erro ao buscar perfil:', error);
    return c.json({ 
      error: 'Erro ao carregar perfil. Tente novamente.' 
    }, 500);
  }
});

/**
 * PUT /user/profile
 * Atualiza o perfil do usuário logado
 * 
 * Precisa enviar o token no header:
 * Authorization: Bearer SEU_TOKEN_AQUI
 * 
 * Body (JSON):
 * {
 *   "name": "Nome Completo",
 *   "username": "username123",
 *   "bio": "Minha bio opcional",
 *   "birthDate": "2000-01-15T00:00:00.000Z"
 * }
 */
user.put('/profile', authMiddleware, async (c) => {
  try {
    // @ts-ignore
    const userData = c.get('user') as { userId: string; email: string };
    const body = await c.req.json();

    // Validações
    const { name, username, bio, birthDate, profilePublic, notificationsEnabled, dailyReminderTime } = body;

    // Preparar objeto de atualização (apenas campos enviados)
    const updateData: any = {};

    // Validar e adicionar name se fornecido
    if (name !== undefined) {
      if (name.trim().length < 3) {
        return c.json({ error: 'Nome deve ter pelo menos 3 caracteres' }, 400);
      }
      updateData.name = name.trim();
    }

    // Validar e adicionar username se fornecido
    if (username !== undefined) {
      if (username.trim().length < 3) {
        return c.json({ error: 'Username deve ter pelo menos 3 caracteres' }, 400);
      }

      // Validar formato do username (apenas letras, números e underscore)
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return c.json({ error: 'Username deve conter apenas letras, números e _' }, 400);
      }

      // Verificar se o username já está em uso por outro usuário
      const existingUser = await prisma.user.findUnique({
        where: { username: username.trim() },
      });

      if (existingUser && existingUser.id !== userData.userId) {
        return c.json({ error: 'Username já está em uso por outro usuário' }, 409);
      }

      updateData.username = username.trim();
    }

    // Adicionar bio se fornecido
    if (bio !== undefined) {
      updateData.bio = bio?.trim() || null;
    }

    // Adicionar birthDate se fornecido
    if (birthDate !== undefined) {
      updateData.birthDate = new Date(birthDate);
    }

    // Adicionar configurações se fornecidas
    if (profilePublic !== undefined) {
      updateData.profilePublic = profilePublic;
    }

    if (notificationsEnabled !== undefined) {
      updateData.notificationsEnabled = notificationsEnabled;
    }

    if (dailyReminderTime !== undefined) {
      updateData.dailyReminderTime = dailyReminderTime;
    }

    // Atualizar perfil
    const updatedUser = await prisma.user.update({
      where: { id: userData.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        birthDate: true,
        bio: true,
        avatarUrl: true,
        xp: true,
        coins: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
        notificationsEnabled: true,
        dailyReminderTime: true,
        profilePublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({
      message: 'Perfil atualizado com sucesso!',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return c.json({ 
      error: 'Erro ao atualizar perfil. Tente novamente.' 
    }, 500);
  }
});

/**
 * POST /user/avatar
 * Upload de foto de perfil (avatar)
 * 
 * Precisa enviar o token no header:
 * Authorization: Bearer SEU_TOKEN_AQUI
 * 
 * Body (multipart/form-data):
 * - avatar: arquivo de imagem (JPG, PNG, WEBP)
 */
user.post('/avatar', authMiddleware, async (c) => {
  try {
    // @ts-ignore
    const userData = c.get('user') as { userId: string; email: string };
    
    // Parse do FormData
    const body = await c.req.parseBody();
    const avatarFile = body['avatar'];

    if (!avatarFile || typeof avatarFile === 'string') {
      return c.json({ error: 'Arquivo de imagem não fornecido' }, 400);
    }

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(avatarFile.type)) {
      return c.json({ 
        error: 'Tipo de arquivo inválido. Use JPG, PNG ou WEBP.' 
      }, 400);
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB em bytes
    if (avatarFile.size > maxSize) {
      return c.json({ 
        error: 'Arquivo muito grande. Tamanho máximo: 5MB' 
      }, 400);
    }

    // Importa o cliente do Supabase
    const { supabase } = await import('../lib/supabase.js');

    // Gera nome único para o arquivo
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${userData.userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Converte File para Buffer para upload
    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Faz upload para o Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, buffer, {
        contentType: avatarFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('❌ Erro ao fazer upload no Supabase:');
      console.error('   Mensagem:', uploadError.message);
      console.error('   Detalhes:', JSON.stringify(uploadError, null, 2));
      console.error('   Bucket:', 'user-avatars');
      console.error('   Path:', filePath);
      return c.json({ 
        error: `Erro ao fazer upload da imagem: ${uploadError.message}` 
      }, 500);
    }

    // Gera URL pública da imagem
    const { data: urlData } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    // Atualiza o avatarUrl do usuário no banco
    const updatedUser = await prisma.user.update({
      where: { id: userData.userId },
      data: { avatarUrl },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        birthDate: true,
        bio: true,
        avatarUrl: true,
        xp: true,
        coins: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
        notificationsEnabled: true,
        dailyReminderTime: true,
        profilePublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({
      message: 'Foto de perfil atualizada com sucesso!',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Erro ao fazer upload do avatar:', error);
    return c.json({ 
      error: 'Erro ao atualizar foto de perfil. Tente novamente.' 
    }, 500);
  }
});

/**
 * DELETE /user/avatar
 * Remove foto de perfil do usuário
 * 
 * Precisa enviar o token no header:
 * Authorization: Bearer SEU_TOKEN_AQUI
 */
user.delete('/avatar', authMiddleware, async (c) => {
  try {
    // @ts-ignore
    const userData = c.get('user') as { userId: string; email: string };

    // Atualiza o avatarUrl do usuário para null
    const updatedUser = await prisma.user.update({
      where: { id: userData.userId },
      data: { avatarUrl: null },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        birthDate: true,
        bio: true,
        avatarUrl: true,
        xp: true,
        coins: true,
        level: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
        notificationsEnabled: true,
        dailyReminderTime: true,
        profilePublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({
      message: 'Foto de perfil removida com sucesso!',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Erro ao remover avatar:', error);
    return c.json({ 
      error: 'Erro ao remover foto de perfil. Tente novamente.' 
    }, 500);
  }
});

/**
 * GET /user/my-activity
 * Retorna atividades do próprio usuário
 */
user.get('/my-activity', authMiddleware, async (c) => {
  try {
    // @ts-ignore - Context type issue
    const userId = c.get('userId');
    const limit = parseInt(c.req.query('limit') || '20', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);

    console.log('[USER ACTIVITY] Buscando atividades - userId:', userId, 'limit:', limit, 'offset:', offset);

    const activities = await userActivityService.getUserOwnActivity(String(userId), limit, offset);

    console.log('[USER ACTIVITY] Atividades encontradas:', activities.length);

    // Buscar stats de curtidas/comentários para as atividades
    const activityIds = activities.map((a: any) => a.id);
    const stats = await feedService.getActivityStats(activityIds, String(userId)) as Record<string, { likesCount: number; commentsCount: number; isLikedByUser: boolean }>;

    // Adicionar stats às atividades
    const activitiesWithStats = activities.map((activity: any) => ({
      ...activity,
      likesCount: stats[activity.id]?.likesCount || 0,
      commentsCount: stats[activity.id]?.commentsCount || 0,
      isLikedByUser: stats[activity.id]?.isLikedByUser || false,
    }));

    return c.json({
      success: true,
      data: activitiesWithStats,
    });
  } catch (error: any) {
    console.error('[USER ACTIVITY] Erro ao buscar atividades:', error);
    console.error('[USER ACTIVITY] Stack:', error.stack);
    return c.json({ 
      success: false, 
      message: error.message || 'Erro ao buscar atividades',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, 500);
  }
});


export default user;