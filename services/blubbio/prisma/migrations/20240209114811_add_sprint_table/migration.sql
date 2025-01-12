-- CreateTable
CREATE TABLE "Sprint" (
    "id" SERIAL NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "sprintTime" INTEGER NOT NULL,
    "bubblesCleared" INTEGER NOT NULL,
    "bubblesShot" INTEGER NOT NULL,
    "bubblesPerSecond" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
