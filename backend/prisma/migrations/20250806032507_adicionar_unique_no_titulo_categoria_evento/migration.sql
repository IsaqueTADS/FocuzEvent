/*
  Warnings:

  - A unique constraint covering the columns `[titulo]` on the table `categoria_eventos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "categoria_eventos_titulo_key" ON "categoria_eventos"("titulo");
