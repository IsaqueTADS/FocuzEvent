/*
  Warnings:

  - A unique constraint covering the columns `[uf]` on the table `estados` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "estados_uf_key" ON "estados"("uf");
