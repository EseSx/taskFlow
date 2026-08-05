-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
