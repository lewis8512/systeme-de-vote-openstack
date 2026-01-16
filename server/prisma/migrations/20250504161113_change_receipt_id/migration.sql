/*
  Warnings:

  - The primary key for the `Receipt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Receipt` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Receipt_voteHash_key";

-- AlterTable
ALTER TABLE "Receipt" DROP CONSTRAINT "Receipt_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY ("voteHash");
