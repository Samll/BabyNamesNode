-- CreateTable
CREATE TABLE `Parent` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `displayName` VARCHAR(191) NOT NULL,
  `preferences` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Parent_email_key` (`email`)
);

-- CreateTable
CREATE TABLE `Couple` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `parents` JSON NOT NULL,
  `namePool` JSON NOT NULL,
  `currentRound` INT NOT NULL,
  `superMatches` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Couple_code_key` (`code`)
);

-- CreateTable
CREATE TABLE `RoundVote` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `coupleId` VARCHAR(191) NOT NULL,
  `parentId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `round` INT NOT NULL,
  `vote` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `RoundVote_coupleId_idx` (`coupleId`),
  CONSTRAINT `RoundVote_coupleId_fkey` FOREIGN KEY (`coupleId`) REFERENCES `Couple`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
