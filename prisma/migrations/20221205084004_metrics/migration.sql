-- CreateTable
CREATE TABLE "Metrics" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "url" TEXT,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "following" INTEGER NOT NULL DEFAULT 0,
    "latestFollowers" INTEGER[],
    "latestFollowing" INTEGER[],
    "fetchedFollowers" TIMESTAMP(3)[],
    "fetchedFollowing" TIMESTAMP(3)[],

    CONSTRAINT "Metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metrics_id_key" ON "Metrics"("id");
