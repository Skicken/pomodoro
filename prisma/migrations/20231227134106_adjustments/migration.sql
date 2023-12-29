/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Alarm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerID` to the `Alarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alarm` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `ownerID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `userType` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    MODIFY `spotifyToken` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Alarm` ADD CONSTRAINT `Alarm_ownerID_fkey` FOREIGN KEY (`ownerID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
