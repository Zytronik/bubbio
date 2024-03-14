/*
  Warnings:

  - You are about to drop the column `sprintTime` on the `Sprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "sprintTime",
ADD COLUMN     "currentTime" INTEGER NOT NULL DEFAULT 0;
