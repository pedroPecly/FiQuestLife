/*
  Warnings:

  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reward_history" DROP CONSTRAINT "reward_history_source_id_fkey";

-- DropTable
DROP TABLE "notifications";

-- DropEnum
DROP TYPE "NotificationType";
