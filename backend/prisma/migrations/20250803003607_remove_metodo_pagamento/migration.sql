/*
  Warnings:

  - You are about to drop the column `metodo_pagamento_id` on the `impulsos_eventos` table. All the data in the column will be lost.
  - You are about to drop the `metodos_pagamento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `metodo_pagamento` to the `impulsos_eventos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "impulsos_eventos" DROP CONSTRAINT "impulsos_eventos_metodo_pagamento_id_fkey";

-- AlterTable
ALTER TABLE "impulsos_eventos" DROP COLUMN "metodo_pagamento_id",
ADD COLUMN     "metodo_pagamento" TEXT NOT NULL;

-- DropTable
DROP TABLE "metodos_pagamento";
