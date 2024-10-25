/*
  Warnings:

  - Made the column `roleId` on table `CircleMember` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CircleMember" DROP CONSTRAINT "CircleMember_roleId_fkey";

-- AlterTable
ALTER TABLE "CircleMember" ALTER COLUMN "roleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
