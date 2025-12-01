-- Add auto-verifiable fields to challenges
ALTER TABLE "challenges" 
  ADD COLUMN IF NOT EXISTS "auto_verifiable" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "verification_event" TEXT;

-- Add social badge tracking fields to badges
ALTER TABLE "badges"
  ADD COLUMN IF NOT EXISTS "required_count" INTEGER,
  ADD COLUMN IF NOT EXISTS "event" TEXT,
  ADD COLUMN IF NOT EXISTS "requirement" TEXT,
  ADD COLUMN IF NOT EXISTS "icon" TEXT,
  ADD COLUMN IF NOT EXISTS "xp_reward" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "coins_reward" INTEGER NOT NULL DEFAULT 0;

-- Add indexes for better performance on social features
CREATE INDEX IF NOT EXISTS "user_badges_badge_id_idx" ON "user_badges"("badge_id");
CREATE INDEX IF NOT EXISTS "challenges_auto_verifiable_idx" ON "challenges"("auto_verifiable") WHERE "auto_verifiable" = true;
CREATE INDEX IF NOT EXISTS "challenges_verification_event_idx" ON "challenges"("verification_event") WHERE "verification_event" IS NOT NULL;
