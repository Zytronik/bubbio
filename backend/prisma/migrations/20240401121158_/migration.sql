/*
  Warnings:

  - You are about to drop the column `glickoUserId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "glickoUserId",
ADD COLUMN     "glickoUser" TEXT NOT NULL DEFAULT '';
