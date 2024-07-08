/*
  Warnings:

  - You are about to drop the column `action` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `changedAt` on the `user_training_audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `changedBy` on the `user_training_audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `oldStatus` on the `user_training_audit_logs` table. All the data in the column will be lost.
  - You are about to drop the `checkouts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `comment` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCheckedOut` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `user_training_audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `user_training_audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "checkouts" DROP CONSTRAINT "checkouts_documentId_fkey";

-- DropForeignKey
ALTER TABLE "checkouts" DROP CONSTRAINT "checkouts_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_training_audit_logs" DROP CONSTRAINT "user_training_audit_logs_changedBy_fkey";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "action",
ADD COLUMN     "comment" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "isCheckedOut" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "user_training_audit_logs" DROP COLUMN "changedAt",
DROP COLUMN "changedBy",
DROP COLUMN "oldStatus",
ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_training_steps" ADD COLUMN     "attemptsLeft" INTEGER NOT NULL DEFAULT 3;

-- DropTable
DROP TABLE "checkouts";

-- AddForeignKey
ALTER TABLE "user_training_audit_logs" ADD CONSTRAINT "user_training_audit_logs_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
