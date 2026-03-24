CREATE TABLE `authCredentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `authCredentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `authCredentials_userId_unique` UNIQUE(`userId`)
);
