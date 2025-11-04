-- Índices para otimizar queries do feed
-- Executa muito mais rápido com esses índices

-- Índice composto para reward_history (mais importante)
CREATE INDEX IF NOT EXISTS idx_reward_history_feed 
ON reward_history(user_id, source, created_at DESC);

-- Índice para friendship lookups
CREATE INDEX IF NOT EXISTS idx_friendships_user 
ON friendships(user_id);

-- Índice para activity_likes (feed interactions)
CREATE INDEX IF NOT EXISTS idx_activity_likes_activity 
ON activity_likes(activity_id);

-- Índice para activity_comments (feed interactions)
CREATE INDEX IF NOT EXISTS idx_activity_comments_activity 
ON activity_comments(activity_id);

-- Índice para notificações não lidas
CREATE INDEX IF NOT EXISTS idx_notifications_unread 
ON notifications(user_id, read, created_at DESC);
