/*
  Warnings:

  - You are about to drop the column `data_fim` on the `impulsos_eventos` table. All the data in the column will be lost.
  - Added the required column `data_hora_fim` to the `impulsos_eventos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "impulsos_eventos" DROP COLUMN "data_fim",
ADD COLUMN     "data_hora_fim" TIMESTAMP(3) NOT NULL;
