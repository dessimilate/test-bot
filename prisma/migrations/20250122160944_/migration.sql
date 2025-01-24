-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT NOT NULL,
    "data" JSONB[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegraf-sessions" (
    "key" TEXT NOT NULL,
    "session" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "telegraf-sessions_key_key" ON "telegraf-sessions"("key");
