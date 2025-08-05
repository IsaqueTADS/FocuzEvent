-- AlterTable
ALTER TABLE "eventos" ADD COLUMN     "email_contato" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "telefone_contato" TEXT;

-- AlterTable
ALTER TABLE "impulsos_eventos" ADD COLUMN     "acessos" INTEGER NOT NULL DEFAULT 0;
