/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tweet_id_userId_key";

-- DropIndex
DROP INDEX "Tweet_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_id_key" ON "Tweet"("id");
