-- AddColumn expiresAt to ChallengeInvitation
-- Convites expiram em 24h ou quando o desafio do remetente expirar

-- Adiciona coluna com valor temporário
ALTER TABLE "challenge_invitations" ADD COLUMN "expires_at" TIMESTAMP(3);

-- Define expiresAt para convites existentes (24h após createdAt ou fim do dia, o que for menor)
UPDATE "challenge_invitations"
SET "expires_at" = CASE
  WHEN "created_at" + INTERVAL '24 hours' < DATE_TRUNC('day', "created_at") + INTERVAL '1 day' - INTERVAL '1 second'
  THEN "created_at" + INTERVAL '24 hours'
  ELSE DATE_TRUNC('day', "created_at") + INTERVAL '1 day' - INTERVAL '1 second'
END
WHERE "expires_at" IS NULL;

-- Torna a coluna NOT NULL após popular os dados existentes
ALTER TABLE "challenge_invitations" ALTER COLUMN "expires_at" SET NOT NULL;

-- Marca convites pendentes que já expiraram como EXPIRED
UPDATE "challenge_invitations"
SET "status" = 'EXPIRED'
WHERE "status" = 'PENDING' AND "expires_at" < NOW();
