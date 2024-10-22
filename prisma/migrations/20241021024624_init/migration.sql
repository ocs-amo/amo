-- DropForeignKey
ALTER TABLE "CircleMember" DROP CONSTRAINT "CircleMember_roleId_fkey";

-- AlterTable
ALTER TABLE "CircleMember" ALTER COLUMN "roleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
