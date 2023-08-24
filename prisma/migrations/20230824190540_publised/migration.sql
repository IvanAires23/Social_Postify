/*
  Warnings:

  - You are about to drop the column `publish` on the `publications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "publications" DROP COLUMN "publish",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
