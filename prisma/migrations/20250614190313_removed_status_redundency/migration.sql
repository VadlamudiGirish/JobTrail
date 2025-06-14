/*
  Warnings:

  - The values [OFFER] on the enum `STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "STATUS_new" AS ENUM ('APPLIED', 'INTERVIEWED', 'REJECTED', 'ACCEPTED');
ALTER TABLE "Application" ALTER COLUMN "applicationStatus" TYPE "STATUS_new" USING ("applicationStatus"::text::"STATUS_new");
ALTER TYPE "STATUS" RENAME TO "STATUS_old";
ALTER TYPE "STATUS_new" RENAME TO "STATUS";
DROP TYPE "STATUS_old";
COMMIT;
