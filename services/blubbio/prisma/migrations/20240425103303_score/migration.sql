-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "bpsGraph" TEXT NOT NULL DEFAULT '[]',
    "bubblesCleared" INTEGER NOT NULL,
    "bubblesShot" INTEGER NOT NULL,
    "bubblesPerSecond" DOUBLE PRECISION NOT NULL,
    "gameDuration" INTEGER NOT NULL,
    "highestBubbleClear" INTEGER NOT NULL,
    "wallBounces" INTEGER NOT NULL,
    "wallBounceClears" INTEGER NOT NULL,
    "highestCombo" INTEGER NOT NULL,
    "bubbleClearToWin" INTEGER NOT NULL,
    "clear3" INTEGER NOT NULL DEFAULT 0,
    "clear4" INTEGER NOT NULL DEFAULT 0,
    "clear5" INTEGER NOT NULL DEFAULT 0,
    "clear3wb" INTEGER NOT NULL DEFAULT 0,
    "clear4wb" INTEGER NOT NULL DEFAULT 0,
    "clear5wb" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
