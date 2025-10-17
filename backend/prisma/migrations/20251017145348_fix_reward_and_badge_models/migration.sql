/*
  Warnings:

  - You are about to drop the `rewards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."rewards" DROP CONSTRAINT "rewards_user_id_fkey";

-- DropIndex
DROP INDEX "public"."badges_category_idx";

-- DropIndex
DROP INDEX "public"."badges_rarity_idx";

-- AlterTable
ALTER TABLE "badges" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "rarity" SET DEFAULT 'COMMON';

-- DropTable
DROP TABLE "public"."rewards";

-- CreateTable
CREATE TABLE "reward_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "RewardType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "source_id" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reward_history_user_id_created_at_idx" ON "reward_history"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "reward_history" ADD CONSTRAINT "reward_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
