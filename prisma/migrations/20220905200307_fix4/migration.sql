-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "provider" DROP NOT NULL,
ALTER COLUMN "providerAccountId" DROP NOT NULL;
