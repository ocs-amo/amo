-- AlterTable
ALTER TABLE "User" ADD COLUMN     "instructorFlag" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CircleInstructor" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL,

    CONSTRAINT "CircleInstructor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CircleInstructor" ADD CONSTRAINT "CircleInstructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleInstructor" ADD CONSTRAINT "CircleInstructor_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
