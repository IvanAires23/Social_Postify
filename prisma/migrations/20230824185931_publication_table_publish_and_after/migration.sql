/*
  Warnings:

  - Added the required column `after` to the `publications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publish` to the `publications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "publications" ADD COLUMN     "after" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "publish" BOOLEAN NOT NULL;
