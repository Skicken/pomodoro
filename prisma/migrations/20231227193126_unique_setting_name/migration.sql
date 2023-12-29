/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SetingName` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SetingName_name_key` ON `SetingName`(`name`);
