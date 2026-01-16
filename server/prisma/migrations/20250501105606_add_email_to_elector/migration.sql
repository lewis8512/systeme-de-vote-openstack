/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Elector` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Elector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Elector" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Elector_email_key" ON "Elector"("email");
