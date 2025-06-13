/*
  Warnings:

  - Added the required column `platform` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PLATFORM" AS ENUM ('LINKEDIN', 'INDEED', 'GLASSDOOR', 'RECOMMENDATION', 'OTHER');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "platform" "PLATFORM" NOT NULL;
