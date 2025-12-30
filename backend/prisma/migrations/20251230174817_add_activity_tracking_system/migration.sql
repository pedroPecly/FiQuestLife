-- CreateEnum
CREATE TYPE "TrackingType" AS ENUM ('STEPS', 'DISTANCE', 'DURATION', 'ALTITUDE', 'MANUAL');

-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "target_unit" TEXT,
ADD COLUMN     "target_value" INTEGER,
ADD COLUMN     "tracking_type" "TrackingType";

-- AlterTable
ALTER TABLE "user_challenges" ADD COLUMN     "activity_data" JSONB,
ADD COLUMN     "distance" DOUBLE PRECISION,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "steps" INTEGER;

-- CreateTable
CREATE TABLE "activity_tracking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "challenge_id" TEXT,
    "activity_type" TEXT NOT NULL,
    "steps" INTEGER,
    "distance" DOUBLE PRECISION,
    "duration" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "route_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_tracking_user_id_start_time_idx" ON "activity_tracking"("user_id", "start_time");

-- AddForeignKey
ALTER TABLE "activity_tracking" ADD CONSTRAINT "activity_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
