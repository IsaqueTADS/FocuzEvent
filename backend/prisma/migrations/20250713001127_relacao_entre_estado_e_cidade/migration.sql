/*
  Warnings:

  - Added the required column `estado_id` to the `cidades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cidades" ADD COLUMN     "estado_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "cidades" ADD CONSTRAINT "cidades_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
