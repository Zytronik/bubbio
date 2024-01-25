/*
  Warnings:

  - A unique constraint covering the columns `[tokenJTI]` on the table `TokenBlacklist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenJTI` to the `TokenBlacklist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TokenBlacklist_token_key";

-- AlterTable
ALTER TABLE "TokenBlacklist" ADD COLUMN     "tokenJTI" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TokenBlacklist_tokenJTI_key" ON "TokenBlacklist"("tokenJTI");
