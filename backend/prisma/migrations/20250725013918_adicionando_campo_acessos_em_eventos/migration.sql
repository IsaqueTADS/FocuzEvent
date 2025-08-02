/*
  Warnings:

  - You are about to drop the column `valor` on the `impulsos_eventos` table. All the data in the column will be lost.
  - Added the required column `acessos` to the `eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_total` to the `impulsos_eventos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "eventos" ADD COLUMN     "acessos" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "impulsos_eventos" DROP COLUMN "valor",
ADD COLUMN     "valor_total" DECIMAL(65,30) NOT NULL;
