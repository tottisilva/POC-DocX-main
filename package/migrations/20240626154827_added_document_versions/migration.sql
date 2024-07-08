/*
  Warnings:

  - You are about to drop the column `version` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `trainings` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `trainings` table. All the data in the column will be lost.
  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserTrainingStepStatus" AS ENUM ('Pending', 'Completed', 'Failed');

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_trainingId_fkey";

-- DropForeignKey
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_documentId_fkey";

-- DropForeignKey
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_typeId_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "version";

-- AlterTable
ALTER TABLE "trainings" DROP COLUMN "documentId",
DROP COLUMN "typeId";

-- DropTable
DROP TABLE "Answer";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Quiz";

-- CreateTable
CREATE TABLE "training_steps" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "documentId" INTEGER,

    CONSTRAINT "training_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versions" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "documentId" INTEGER NOT NULL,

    CONSTRAINT "versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "minScore" INTEGER NOT NULL,
    "trainingStepId" INTEGER NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_training_steps" (
    "userId" INTEGER NOT NULL,
    "trainingStepId" INTEGER NOT NULL,
    "stepStatus" "UserTrainingStepStatus" NOT NULL DEFAULT 'Pending',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_training_steps_pkey" PRIMARY KEY ("userId","trainingStepId")
);

-- CreateTable
CREATE TABLE "user_quiz_answers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "training_steps_id_stepNumber_key" ON "training_steps"("id", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_trainingStepId_key" ON "quizzes"("trainingStepId");

-- CreateIndex
CREATE UNIQUE INDEX "user_quiz_answers_userId_questionId_key" ON "user_quiz_answers"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "training_steps" ADD CONSTRAINT "training_steps_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_steps" ADD CONSTRAINT "training_steps_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_steps" ADD CONSTRAINT "training_steps_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "training_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versions" ADD CONSTRAINT "versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_trainingStepId_fkey" FOREIGN KEY ("trainingStepId") REFERENCES "training_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_training_steps" ADD CONSTRAINT "user_training_steps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_training_steps" ADD CONSTRAINT "user_training_steps_trainingStepId_fkey" FOREIGN KEY ("trainingStepId") REFERENCES "training_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_answers" ADD CONSTRAINT "user_quiz_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_answers" ADD CONSTRAINT "user_quiz_answers_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_answers" ADD CONSTRAINT "user_quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_answers" ADD CONSTRAINT "user_quiz_answers_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
