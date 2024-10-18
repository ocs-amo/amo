-- CreateTable
CREATE TABLE "CircleTag" (
    "id" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,

    CONSTRAINT "CircleTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CircleTag_circleId_idx" ON "CircleTag"("circleId");

-- AddForeignKey
ALTER TABLE "CircleTag" ADD CONSTRAINT "CircleTag_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
