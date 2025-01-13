/*
  Warnings:

  - You are about to drop the column `angleChangePerBubble` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `angleChanged` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `holds` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `keysPerBubble` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `keysPerSecond` on the `Sprint` table. All the data in the column will be lost.
  - You are about to drop the column `keysPressed` on the `Sprint` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "angleChangePerBubble",
DROP COLUMN "angleChanged",
DROP COLUMN "holds",
DROP COLUMN "keysPerBubble",
DROP COLUMN "keysPerSecond",
DROP COLUMN "keysPressed";
