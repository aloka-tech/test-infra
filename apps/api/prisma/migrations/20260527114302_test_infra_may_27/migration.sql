-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quotes_created_at_idx" ON "quotes"("created_at" DESC);
