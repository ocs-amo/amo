/*
  Warnings:

  - The values [notice] on the enum `TopicType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TopicType_new" AS ENUM ('thread', 'announcement');
ALTER TABLE "Topic" ALTER COLUMN "type" TYPE "TopicType_new" USING ("type"::text::"TopicType_new");
ALTER TYPE "TopicType" RENAME TO "TopicType_old";
ALTER TYPE "TopicType_new" RENAME TO "TopicType";
DROP TYPE "TopicType_old";
COMMIT;
