/*
  Warnings:

  - Added the required column `questions` to the `TestStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionsAmount` to the `TestStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestStats" ADD COLUMN     "isDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "questions" JSONB NOT NULL,
ADD COLUMN     "questionsAmount" INTEGER NOT NULL;
