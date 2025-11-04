-- Migration: Criar reward_history para atividades antigas sem registro
-- Isso garante que todas as atividades tenham um ID válido

-- Desafios completados sem reward_history
INSERT INTO reward_history (id, user_id, type, amount, source, source_id, description, created_at)
SELECT 
  gen_random_uuid(),
  uc.user_id,
  'XP',
  c.xp_reward,
  'CHALLENGE_COMPLETION',
  uc.id,
  'Completou: ' || c.title,
  uc.completed_at
FROM user_challenges uc
JOIN challenges c ON c.id = uc.challenge_id
WHERE uc.status = 'COMPLETED'
  AND uc.completed_at IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM reward_history rh 
    WHERE rh.source_id = uc.id 
    AND rh.source = 'CHALLENGE_COMPLETION'
  );

-- Badges conquistados sem reward_history
INSERT INTO reward_history (id, user_id, type, amount, source, source_id, description, created_at)
SELECT 
  gen_random_uuid(),
  ub.user_id,
  'BADGE',
  1,
  'BADGE_ACHIEVEMENT',
  ub.id,
  'Conquistou badge: ' || b.name,
  ub.earned_at
FROM user_badges ub
JOIN badges b ON b.id = ub.badge_id
WHERE NOT EXISTS (
  SELECT 1 FROM reward_history rh 
  WHERE rh.source_id = ub.id 
  AND rh.source = 'BADGE_ACHIEVEMENT'
);
