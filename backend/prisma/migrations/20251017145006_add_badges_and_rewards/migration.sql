-- CreateEnum
CREATE TYPE "BadgeCategory" AS ENUM ('BEGINNER', 'CONSISTENCY', 'MILESTONE', 'SPECIAL', 'SEASONAL', 'ACHIEVEMENT');

-- CreateEnum
CREATE TYPE "BadgeRequirementType" AS ENUM ('CHALLENGES_COMPLETED', 'STREAK_DAYS', 'LEVEL_REACHED', 'XP_EARNED', 'SPECIFIC_CHALLENGE', 'CATEGORY_MASTER', 'SOCIAL_INTERACTION');

-- CreateEnum
CREATE TYPE "BadgeRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('XP', 'COINS', 'BADGE', 'ITEM');

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "category" "BadgeCategory" NOT NULL,
    "rarity" "BadgeRarity" NOT NULL,
    "requirement_type" "BadgeRequirementType" NOT NULL,
    "requirement_value" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_displayed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "RewardType" NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source_type" TEXT,
    "source_id" TEXT,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE INDEX "badges_category_idx" ON "badges"("category");

-- CreateIndex
CREATE INDEX "badges_rarity_idx" ON "badges"("rarity");

-- CreateIndex
CREATE INDEX "user_badges_user_id_idx" ON "user_badges"("user_id");

-- CreateIndex
CREATE INDEX "user_badges_earned_at_idx" ON "user_badges"("earned_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_user_id_badge_id_key" ON "user_badges"("user_id", "badge_id");

-- CreateIndex
CREATE INDEX "rewards_user_id_idx" ON "rewards"("user_id");

-- CreateIndex
CREATE INDEX "rewards_earned_at_idx" ON "rewards"("earned_at");

-- CreateIndex
CREATE INDEX "rewards_type_idx" ON "rewards"("type");

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
