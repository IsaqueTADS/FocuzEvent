/*
  Warnings:

  - The `status_pagamento` column on the `impulsos_eventos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "impulsos_eventos" DROP COLUMN "status_pagamento",
ADD COLUMN     "status_pagamento" "StatusPagamaneto" NOT NULL DEFAULT 'AGUARDANDO';
