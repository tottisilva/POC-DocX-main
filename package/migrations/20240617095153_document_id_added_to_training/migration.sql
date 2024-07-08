/*
  Warnings:

  - You are about to drop the column `date` on the `trainings` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `trainings` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `trainings` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `trainings` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTraining` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_training_audit_log` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `documentId` to the `trainings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserTraining" DROP CONSTRAINT "UserTraining_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "UserTraining" DROP CONSTRAINT "UserTraining_trainingId_fkey";

-- DropForeignKey
ALTER TABLE "UserTraining" DROP CONSTRAINT "UserTraining_userId_fkey";

-- DropForeignKey
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_typeId_fkey";

-- DropForeignKey
ALTER TABLE "user_training_audit_log" DROP CONSTRAINT "user_training_audit_log_changedBy_fkey";

-- DropForeignKey
ALTER TABLE "user_training_audit_log" DROP CONSTRAINT "user_training_audit_log_userId_trainingId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- AlterTable
ALTER TABLE "trainings" DROP COLUMN "date",
DROP COLUMN "file",
DROP COLUMN "hours",
DROP COLUMN "status",
ADD COLUMN     "documentId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "TrainingType";

-- DropTable
DROP TABLE "UserTraining";

-- DropTable
DROP TABLE "user_training_audit_log";

-- DropEnum
DROP TYPE "TrainingCategory";

-- DropEnum
DROP TYPE "TrainingStatus";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_types" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_trainings" (
    "userId" INTEGER NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "status" "UserTrainingStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "user_trainings_pkey" PRIMARY KEY ("userId","trainingId")
);

-- CreateTable
CREATE TABLE "user_training_audit_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "oldStatus" "UserTrainingStatus" NOT NULL,
    "newStatus" "UserTrainingStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" INTEGER NOT NULL,

    CONSTRAINT "user_training_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "functionalAreaId" INTEGER,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkouts" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "checkedOut" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_names" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "group_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "functional_areas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "functional_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "minScore" INTEGER NOT NULL,
    "trainingId" INTEGER NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocumentToGroupName" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "group_names_name_key" ON "group_names"("name");

-- CreateIndex
CREATE UNIQUE INDEX "functional_areas_name_key" ON "functional_areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_trainingId_key" ON "Quiz"("trainingId");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentToGroupName_AB_unique" ON "_DocumentToGroupName"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentToGroupName_B_index" ON "_DocumentToGroupName"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "training_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trainings" ADD CONSTRAINT "user_trainings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trainings" ADD CONSTRAINT "user_trainings_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trainings" ADD CONSTRAINT "user_trainings_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_training_audit_logs" ADD CONSTRAINT "user_training_audit_logs_userId_trainingId_fkey" FOREIGN KEY ("userId", "trainingId") REFERENCES "user_trainings"("userId", "trainingId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_training_audit_logs" ADD CONSTRAINT "user_training_audit_logs_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_functionalAreaId_fkey" FOREIGN KEY ("functionalAreaId") REFERENCES "functional_areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToGroupName" ADD CONSTRAINT "_DocumentToGroupName_A_fkey" FOREIGN KEY ("A") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentToGroupName" ADD CONSTRAINT "_DocumentToGroupName_B_fkey" FOREIGN KEY ("B") REFERENCES "group_names"("id") ON DELETE CASCADE ON UPDATE CASCADE;
