/*
  Warnings:

  - The primary key for the `Metrics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Metrics` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Metrics_id_key";

-- AlterTable
ALTER TABLE "Metrics" DROP CONSTRAINT "Metrics_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Metrics_pkey" PRIMARY KEY ("username");
