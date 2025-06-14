/*
  Warnings:

  - Added the required column `location` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "location" TEXT NOT NULL,
ALTER COLUMN "contactPerson" DROP NOT NULL;
