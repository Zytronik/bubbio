/*
  Warnings:

  - Made the column `userId` on table `Sprint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `TokenBlacklist` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Sprint" DROP CONSTRAINT "Sprint_userId_fkey";

-- DropForeignKey
ALTER TABLE "TokenBlacklist" DROP CONSTRAINT "TokenBlacklist_userId_fkey";

-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "gameMode" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "bubblesCleared" DROP DEFAULT,
ALTER COLUMN "bubblesShot" DROP DEFAULT,
ALTER COLUMN "bubblesPerSecond" DROP DEFAULT,
ALTER COLUMN "angleChangePerBubble" DROP DEFAULT,
ALTER COLUMN "angleChanged" DROP DEFAULT,
ALTER COLUMN "gameDuration" DROP DEFAULT,
ALTER COLUMN "highestBubbleClear" DROP DEFAULT,
ALTER COLUMN "highestCombo" DROP DEFAULT,
ALTER COLUMN "holds" DROP DEFAULT,
ALTER COLUMN "keysPerBubble" DROP DEFAULT,
ALTER COLUMN "keysPerSecond" DROP DEFAULT,
ALTER COLUMN "keysPressed" DROP DEFAULT,
ALTER COLUMN "wallBounceClears" DROP DEFAULT,
ALTER COLUMN "wallBounces" DROP DEFAULT,
ALTER COLUMN "bubbleClearStats" DROP DEFAULT,
ALTER COLUMN "bubbleClearToWin" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TokenBlacklist" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TokenBlacklist" ADD CONSTRAINT "TokenBlacklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
