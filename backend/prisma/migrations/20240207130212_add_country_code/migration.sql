/*
  Warnings:

  - A unique constraint covering the columns `[tokenJTI]` on the table `TokenBlacklist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TokenBlacklist_tokenJTI_key" ON "TokenBlacklist"("tokenJTI");
