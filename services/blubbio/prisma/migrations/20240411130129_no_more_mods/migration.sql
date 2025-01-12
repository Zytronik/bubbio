/*
  Warnings:

  - You are about to drop the column `mods` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `mods` on the `Sprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "mods";

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "mods";
