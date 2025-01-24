/*
  Warnings:

  - You are about to drop the column `data` on the `Test` table. All the data in the column will be lost.
  - Added the required column `questions` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "data",
ADD COLUMN     "questions" JSONB NOT NULL;
