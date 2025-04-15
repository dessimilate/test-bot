/*
  Warnings:

  - The primary key for the `TestStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `TestStats` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "TestStats" DROP CONSTRAINT "TestStats_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "TestStats_pkey" PRIMARY KEY ("id");
