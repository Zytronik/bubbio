-- CreateTable
CREATE TABLE "Ranked" (
    "id" SERIAL NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId1" INTEGER NOT NULL,
    "user1Score" INTEGER NOT NULL,
    "user1HasWon" BOOLEAN NOT NULL,
    "user1EloDiff" DOUBLE PRECISION NOT NULL,
    "user1Stats" TEXT NOT NULL,
    "userId2" INTEGER NOT NULL,
    "user2Score" INTEGER NOT NULL,
    "user2HasWon" BOOLEAN NOT NULL,
    "user2EloDiff" DOUBLE PRECISION NOT NULL,
    "user2Stats" TEXT NOT NULL,

    CONSTRAINT "Ranked_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ranked" ADD CONSTRAINT "Ranked_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranked" ADD CONSTRAINT "Ranked_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
