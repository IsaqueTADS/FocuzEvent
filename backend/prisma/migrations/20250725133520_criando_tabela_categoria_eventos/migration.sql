/*
  Warnings:

  - Added the required column `categoria_evento_id` to the `eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizado_em` to the `impulsos_eventos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "eventos" ADD COLUMN     "categoria_evento_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "impulsos_eventos" ADD COLUMN     "atualizado_em" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "categoria_eventos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_eventos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_categoria_evento_id_fkey" FOREIGN KEY ("categoria_evento_id") REFERENCES "categoria_eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
