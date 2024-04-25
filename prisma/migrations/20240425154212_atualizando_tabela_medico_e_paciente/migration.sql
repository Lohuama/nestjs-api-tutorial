/*
  Warnings:

  - You are about to drop the column `description` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `medicos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `medicos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `medicos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "medicos" DROP CONSTRAINT "medicos_userId_fkey";

-- AlterTable
ALTER TABLE "medicos" DROP COLUMN "description",
DROP COLUMN "link",
DROP COLUMN "title",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT;

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "pacientes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "medicoId" INTEGER NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medicos_email_key" ON "medicos"("email");

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
