/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Mesa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Mesa_codigo_key" ON "Mesa"("codigo");
