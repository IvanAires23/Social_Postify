/*
  Warnings:

  - A unique constraint covering the columns `[username,title]` on the table `medias` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medias_username_title_key" ON "medias"("username", "title");
