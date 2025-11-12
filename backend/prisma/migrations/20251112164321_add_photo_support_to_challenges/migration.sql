-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "requires_photo" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_challenges" ADD COLUMN     "caption" TEXT,
ADD COLUMN     "photo_url" TEXT;
