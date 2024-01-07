/*
  Warnings:

  - Added the required column `passwordHashed` to the `userSchema` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userSchema` ADD COLUMN `passwordHashed` VARCHAR(191) NOT NULL;
