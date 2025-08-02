/*
  Warnings:

  - You are about to drop the column `metodo_pagamento_id` on the `Impulso` table. All the data in the column will be lost.
  - Added the required column `metodo_pagamento_id` to the `impulsos_eventos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusPagamaneto" AS ENUM ('AGUARDANDO', 'PAGO', 'RECUSADO');

-- DropForeignKey
ALTER TABLE "Impulso" DROP CONSTRAINT "Impulso_metodo_pagamento_id_fkey";

-- AlterTable
ALTER TABLE "Impulso" DROP COLUMN "metodo_pagamento_id";

-- AlterTable
ALTER TABLE "impulsos_eventos" ADD COLUMN     "metodo_pagamento_id" TEXT NOT NULL,
ADD COLUMN     "status_pagamento" TEXT NOT NULL DEFAULT 'AGUARDANDO';

-- AddForeignKey
ALTER TABLE "impulsos_eventos" ADD CONSTRAINT "impulsos_eventos_metodo_pagamento_id_fkey" FOREIGN KEY ("metodo_pagamento_id") REFERENCES "metodos_pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
