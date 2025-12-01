-- CreateEnum
CREATE TYPE "ChallengeInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "challenge_invitations" (
    "id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "user_challenge_id" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ChallengeInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "challenge_invitations_user_challenge_id_key" ON "challenge_invitations"("user_challenge_id");

-- CreateIndex
CREATE INDEX "challenge_invitations_to_user_id_status_idx" ON "challenge_invitations"("to_user_id", "status");

-- CreateIndex
CREATE INDEX "challenge_invitations_from_user_id_idx" ON "challenge_invitations"("from_user_id");

-- CreateIndex
CREATE INDEX "challenge_invitations_date_idx" ON "challenge_invitations"("date");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_invitations_from_user_id_to_user_id_challenge_id__key" ON "challenge_invitations"("from_user_id", "to_user_id", "challenge_id", "date");

-- AddForeignKey
ALTER TABLE "challenge_invitations" ADD CONSTRAINT "challenge_invitations_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_invitations" ADD CONSTRAINT "challenge_invitations_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_invitations" ADD CONSTRAINT "challenge_invitations_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_invitations" ADD CONSTRAINT "challenge_invitations_user_challenge_id_fkey" FOREIGN KEY ("user_challenge_id") REFERENCES "user_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
