/*
  Warnings:

  - You are about to drop the column `questions` on the `TestStats` table. All the data in the column will be lost.
  - Added the required column `shuffled_questions` to the `TestStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestStats" DROP COLUMN "questions",
ADD COLUMN     "shuffled_questions" JSONB NOT NULL;
