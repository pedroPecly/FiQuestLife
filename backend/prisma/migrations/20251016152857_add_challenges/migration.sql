-- CreateEnum
CREATE TYPE "ChallengeCategory" AS ENUM ('PHYSICAL_ACTIVITY', 'NUTRITION', 'HYDRATION', 'MENTAL_HEALTH', 'SLEEP', 'SOCIAL', 'PRODUCTIVITY', 'MINDFULNESS');

-- CreateEnum
CREATE TYPE "ChallengeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "ChallengeFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ChallengeCategory" NOT NULL,
    "difficulty" "ChallengeDifficulty" NOT NULL,
    "xp_reward" INTEGER NOT NULL,
    "coins_reward" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "frequency" "ChallengeFrequency" NOT NULL DEFAULT 'DAILY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_challenges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'PENDING',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "user_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_challenges_user_id_status_idx" ON "user_challenges"("user_id", "status");

-- CreateIndex
CREATE INDEX "user_challenges_assigned_at_idx" ON "user_challenges"("assigned_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_challenges_user_id_challenge_id_assigned_at_key" ON "user_challenges"("user_id", "challenge_id", "assigned_at");

-- AddForeignKey
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
