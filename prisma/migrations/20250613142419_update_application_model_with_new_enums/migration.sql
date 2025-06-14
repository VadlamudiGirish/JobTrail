/*
  Warnings:

  - Added the required column `interviewRound` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `applicationMethod` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `applicationStatus` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Method" AS ENUM ('REFERRAL', 'EMAIL', 'PHONE', 'ONLINE', 'OTHER');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('APPLIED', 'INTERVIEWED', 'REJECTED', 'OFFER', 'ACCEPTED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "interviewRound" INTEGER NOT NULL,
DROP COLUMN "applicationMethod",
ADD COLUMN     "applicationMethod" "Method" NOT NULL,
DROP COLUMN "applicationStatus",
ADD COLUMN     "applicationStatus" "STATUS" NOT NULL;
