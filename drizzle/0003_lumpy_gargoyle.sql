CREATE TABLE `campaignRecipients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`userId` int NOT NULL,
	`sent` int NOT NULL DEFAULT 0,
	`opened` int NOT NULL DEFAULT 0,
	`clicked` int NOT NULL DEFAULT 0,
	`sentAt` timestamp,
	`openedAt` timestamp,
	`clickedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campaignRecipients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentModerations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commentId` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`flaggedBy` int NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`moderatedBy` int,
	`moderatedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contentModerations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailCampaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`createdBy` int NOT NULL,
	`status` enum('draft','scheduled','sent','failed') NOT NULL DEFAULT 'draft',
	`scheduledAt` timestamp,
	`sentAt` timestamp,
	`recipientCount` int NOT NULL DEFAULT 0,
	`openCount` int NOT NULL DEFAULT 0,
	`clickCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`articlesViewed` int NOT NULL DEFAULT 0,
	`commentsCreated` int NOT NULL DEFAULT 0,
	`ratingsGiven` int NOT NULL DEFAULT 0,
	`lastActivityAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userAnalytics_id` PRIMARY KEY(`id`)
);
