/*
  Warnings:

  - Added the required column `firstTo` to the `Ranked` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matchId` to the `Ranked` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ranked" ADD COLUMN     "firstTo" INTEGER NOT NULL,
ADD COLUMN     "matchId" TEXT NOT NULL;
