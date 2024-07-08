/*
  Warnings:

  - You are about to drop the `_DocumentToGroupName` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `code` to the `functional_areas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `group_names` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DocumentToGroupName" DROP CONSTRAINT "_DocumentToGroupName_A_fkey";

-- DropForeignKey
ALTER TABLE "_DocumentToGroupName" DROP CONSTRAINT "_DocumentToGroupName_B_fkey";

-- DropForeignKey
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_documentId_fkey";

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "groupNameId" INTEGER;

-- AlterTable
ALTER TABLE "functional_areas" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "group_names" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "trainings" ALTER COLUMN "documentId" DROP NOT NULL;

-- DropTable
DROP TABLE "_DocumentToGroupName";

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_groupNameId_fkey" FOREIGN KEY ("groupNameId") REFERENCES "group_names"("id") ON DELETE SET NULL ON UPDATE CASCADE;
