-- DropForeignKey
ALTER TABLE `settingvalue` DROP FOREIGN KEY `SettingValue_settingID_fkey`;

-- AddForeignKey
ALTER TABLE `SettingValue` ADD CONSTRAINT `SettingValue_settingID_fkey` FOREIGN KEY (`settingID`) REFERENCES `SetingName`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
