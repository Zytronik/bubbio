-- AlterTable
ALTER TABLE "User" ALTER COLUMN "LastDisconnectedAt" DROP NOT NULL,
ALTER COLUMN "LastDisconnectedAt" DROP DEFAULT;
