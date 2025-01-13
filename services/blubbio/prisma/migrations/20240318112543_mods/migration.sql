/*
  Warnings:

  - You are about to drop the column `gameMode` on the `Sprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "gameMode",
ADD COLUMN     "gameMmodsode" TEXT NOT NULL DEFAULT '';
