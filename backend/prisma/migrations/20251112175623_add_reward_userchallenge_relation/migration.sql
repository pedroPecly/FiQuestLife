-- AddForeignKey
ALTER TABLE "reward_history" ADD CONSTRAINT "reward_history_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "user_challenges"("id") ON DELETE SET NULL ON UPDATE CASCADE;
