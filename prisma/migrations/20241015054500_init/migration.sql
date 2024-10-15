-- CreateTable
CREATE TABLE "Circle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imagePath" TEXT,

    CONSTRAINT "Circle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Circle_name_idx" ON "Circle"("name");
