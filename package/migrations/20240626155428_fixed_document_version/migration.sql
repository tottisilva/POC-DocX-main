/*
  Warnings:

  - Added the required column `createdBy` to the `versions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "versions" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "versions" ADD CONSTRAINT "versions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
