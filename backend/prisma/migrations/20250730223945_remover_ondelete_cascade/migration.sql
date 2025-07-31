-- DropForeignKey
ALTER TABLE "eventos" DROP CONSTRAINT "eventos_usuario_id_fkey";

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
