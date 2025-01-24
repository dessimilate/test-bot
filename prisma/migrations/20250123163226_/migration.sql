/*
  Warnings:

  - You are about to drop the column `filename` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Test` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filepath` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "filename",
DROP COLUMN "userId",
ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "filepath" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TestStats" (
    "correct" INTEGER NOT NULL,
    "testId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TestStats_pkey" PRIMARY KEY ("testId","userId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestStats" ADD CONSTRAINT "TestStats_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestStats" ADD CONSTRAINT "TestStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
