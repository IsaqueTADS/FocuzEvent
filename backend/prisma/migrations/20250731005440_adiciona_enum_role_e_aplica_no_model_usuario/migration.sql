/*
  Warnings:

  - The `role` column on the `usuarios` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USUARIO', 'ADMIN');

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USUARIO';
