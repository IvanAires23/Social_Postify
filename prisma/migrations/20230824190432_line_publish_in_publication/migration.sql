-- AlterTable
ALTER TABLE "publications" ALTER COLUMN "after" DROP NOT NULL,
ALTER COLUMN "publish" SET DEFAULT false;
