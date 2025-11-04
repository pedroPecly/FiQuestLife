-- CreateTable
CREATE TABLE "activity_likes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_comments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_likes_activity_id_idx" ON "activity_likes"("activity_id");

-- CreateIndex
CREATE INDEX "activity_likes_user_id_idx" ON "activity_likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_likes_user_id_activity_id_key" ON "activity_likes"("user_id", "activity_id");

-- CreateIndex
CREATE INDEX "activity_comments_activity_id_idx" ON "activity_comments"("activity_id");

-- CreateIndex
CREATE INDEX "activity_comments_user_id_idx" ON "activity_comments"("user_id");

-- AddForeignKey
ALTER TABLE "activity_likes" ADD CONSTRAINT "activity_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_comments" ADD CONSTRAINT "activity_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
