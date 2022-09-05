-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "provider" DROP NOT NULL,
ALTER COLUMN "providerAccountId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VerificationToken" ALTER COLUMN "identifier" DROP NOT NULL;
