-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "bubbleClearStats" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "bubbleClearToWin" INTEGER NOT NULL DEFAULT 0;
