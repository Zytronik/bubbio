/*
  Warnings:

  - You are about to drop the column `bubbleClearStats` on the `Sprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "bubbleClearStats",
ADD COLUMN     "clear3" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clear3wb" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clear4" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clear4wb" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clear5" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clear5wb" INTEGER NOT NULL DEFAULT 0;
