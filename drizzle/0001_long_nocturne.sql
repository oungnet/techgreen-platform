CREATE TABLE `fileShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fileId` int NOT NULL,
	`sharedWithUserId` int NOT NULL,
	`permission` enum('view','download','edit') NOT NULL DEFAULT 'view',
	`shareToken` varchar(100),
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fileShares_id` PRIMARY KEY(`id`),
	CONSTRAINT `fileShares_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileSize` int NOT NULL,
	`category` varchar(50) NOT NULL DEFAULT 'general',
	`description` text,
	`isPublic` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `files_id` PRIMARY KEY(`id`),
	CONSTRAINT `files_fileKey_unique` UNIQUE(`fileKey`)
);
