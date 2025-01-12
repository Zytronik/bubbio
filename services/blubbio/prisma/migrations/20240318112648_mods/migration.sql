/*
  Warnings:

  - You are about to drop the column `gameMmodsode` on the `Sprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "gameMmodsode",
ADD COLUMN     "mods" TEXT NOT NULL DEFAULT '';
