-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "codigoRecuperacaoExpira" TIMESTAMP(3),
ADD COLUMN     "codigoRecuperacaoHash" TEXT;
