import { eq, and, desc, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, files, fileShares, File, InsertFile, FileShare, InsertFileShare, articles, Article, InsertArticle, comments, Comment, InsertComment, ratings, Rating, InsertRating, emailSubscriptions, EmailSubscription, InsertEmailSubscription, emailNotifications, EmailNotification, InsertEmailNotification, contentModerations, ContentModeration, InsertContentModeration, emailCampaigns, EmailCampaign, InsertEmailCampaign, campaignRecipients, CampaignRecipient, InsertCampaignRecipient, userAnalytics, UserAnalytic, InsertUserAnalytic, userNotifications, UserNotification, InsertUserNotification, userActivity, UserActivity, InsertUserActivity, notificationPreferences, NotificationPreference, InsertNotificationPreference } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// File Management Queries

export async function createFile(file: InsertFile): Promise<File | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create file: database not available");
    return undefined;
  }

  try {
    await db.insert(files).values(file);
    // Fetch the file by fileKey which is unique
    const insertedFile = await db.select().from(files).where(eq(files.fileKey, file.fileKey)).limit(1);
    return insertedFile.length > 0 ? insertedFile[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create file:", error);
    throw error;
  }
}

export async function getFileById(fileId: number): Promise<File | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get file: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(files).where(eq(files.id, fileId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get file:", error);
    throw error;
  }
}

export async function getUserFiles(userId: number): Promise<File[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user files: database not available");
    return [];
  }

  try {
    const result = await db.select().from(files)
      .where(eq(files.userId, userId))
      .orderBy(desc(files.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get user files:", error);
    throw error;
  }
}

export async function deleteFile(fileId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete file: database not available");
    return false;
  }

  try {
    // Verify ownership
    const file = await getFileById(fileId);
    if (!file || file.userId !== userId) {
      throw new Error("Unauthorized: file not found or user is not the owner");
    }

    // Delete file shares first
    await db.delete(fileShares).where(eq(fileShares.fileId, fileId));

    // Delete file
    await db.delete(files).where(eq(files.id, fileId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete file:", error);
    throw error;
  }
}

export async function updateFile(fileId: number, userId: number, updates: Partial<File>): Promise<File | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update file: database not available");
    return undefined;
  }

  try {
    // Verify ownership
    const file = await getFileById(fileId);
    if (!file || file.userId !== userId) {
      throw new Error("Unauthorized: file not found or user is not the owner");
    }

    await db.update(files).set(updates).where(eq(files.id, fileId));
    return getFileById(fileId);
  } catch (error) {
    console.error("[Database] Failed to update file:", error);
    throw error;
  }
}

export async function shareFile(share: InsertFileShare): Promise<FileShare | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot share file: database not available");
    return undefined;
  }

  try {
    await db.insert(fileShares).values(share);
    // Fetch the share by shareToken if available, or by fileId and sharedWithUserId
    const query = share.shareToken
      ? await db.select().from(fileShares).where(eq(fileShares.shareToken, share.shareToken)).limit(1)
      : await db.select().from(fileShares)
          .where(and(eq(fileShares.fileId, share.fileId), eq(fileShares.sharedWithUserId, share.sharedWithUserId)))
          .orderBy(desc(fileShares.createdAt))
          .limit(1);
    return query.length > 0 ? query[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to share file:", error);
    throw error;
  }
}

export async function getFileShares(fileId: number): Promise<FileShare[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get file shares: database not available");
    return [];
  }

  try {
    const result = await db.select().from(fileShares).where(eq(fileShares.fileId, fileId));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get file shares:", error);
    throw error;
  }
}

export async function deleteFileShare(shareId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete file share: database not available");
    return false;
  }

  try {
    const share = await db.select().from(fileShares).where(eq(fileShares.id, shareId)).limit(1);
    if (share.length === 0) {
      throw new Error("Share not found");
    }

    const fileId = share[0].fileId;
    const file = await getFileById(fileId);
    if (!file || file.userId !== userId) {
      throw new Error("Unauthorized: cannot delete share");
    }

    await db.delete(fileShares).where(eq(fileShares.id, shareId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete file share:", error);
    throw error;
  }
}

// Article Management Queries

export async function createArticle(article: InsertArticle): Promise<Article | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create article: database not available");
    return undefined;
  }

  try {
    await db.insert(articles).values(article);
    const result = await db.select().from(articles).where(eq(articles.slug, article.slug)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create article:", error);
    throw error;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get article: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get article:", error);
    throw error;
  }
}

export async function getPublishedArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get articles: database not available");
    return [];
  }

  try {
    const result = await db.select().from(articles)
      .where(eq(articles.published, 1))
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get articles:", error);
    throw error;
  }
}

export async function searchArticles(query: string, limit: number = 10): Promise<Article[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search articles: database not available");
    return [];
  }

  try {
    const result = await db.select().from(articles)
      .where(and(
        eq(articles.published, 1),
        like(articles.title, `%${query}%`)
      ))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("[Database] Failed to search articles:", error);
    throw error;
  }
}

// Comment Management Queries

export async function createComment(comment: InsertComment): Promise<Comment | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create comment: database not available");
    return undefined;
  }

  try {
    await db.insert(comments).values(comment);
    const result = await db.select().from(comments)
      .where(and(eq(comments.articleId, comment.articleId), eq(comments.userId, comment.userId)))
      .orderBy(desc(comments.createdAt))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create comment:", error);
    throw error;
  }
}

export async function getArticleComments(articleId: number): Promise<Comment[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get comments: database not available");
    return [];
  }

  try {
    const result = await db.select().from(comments)
      .where(and(eq(comments.articleId, articleId), eq(comments.approved, 1)))
      .orderBy(desc(comments.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get comments:", error);
    throw error;
  }
}

// Rating Management Queries

export async function createOrUpdateRating(rating: InsertRating): Promise<Rating | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create rating: database not available");
    return undefined;
  }

  try {
    const existing = await db.select().from(ratings)
      .where(and(eq(ratings.articleId, rating.articleId), eq(ratings.userId, rating.userId)))
      .limit(1);

    if (existing.length > 0) {
      await db.update(ratings).set({ score: rating.score }).where(eq(ratings.id, existing[0].id));
      return await db.select().from(ratings).where(eq(ratings.id, existing[0].id)).limit(1).then(r => r[0]);
    } else {
      await db.insert(ratings).values(rating);
      const result = await db.select().from(ratings)
        .where(and(eq(ratings.articleId, rating.articleId), eq(ratings.userId, rating.userId)))
        .limit(1);
      return result.length > 0 ? result[0] : undefined;
    }
  } catch (error) {
    console.error("[Database] Failed to create/update rating:", error);
    throw error;
  }
}

export async function getArticleRating(articleId: number): Promise<{ average: number; count: number }> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get rating: database not available");
    return { average: 0, count: 0 };
  }

  try {
    const result = await db.select().from(ratings).where(eq(ratings.articleId, articleId));
    if (result.length === 0) return { average: 0, count: 0 };
    const average = result.reduce((sum, r) => sum + r.score, 0) / result.length;
    return { average, count: result.length };
  } catch (error) {
    console.error("[Database] Failed to get rating:", error);
    throw error;
  }
}

// Email Subscription Queries

export async function getOrCreateEmailSubscription(userId: number): Promise<EmailSubscription | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get email subscription: database not available");
    return undefined;
  }

  try {
    const existing = await db.select().from(emailSubscriptions).where(eq(emailSubscriptions.userId, userId)).limit(1);
    if (existing.length > 0) return existing[0];

    const newSub: InsertEmailSubscription = { userId, subscribeToNewArticles: 1, subscribeToUpdates: 1, subscribeToPolicy: 1 };
    await db.insert(emailSubscriptions).values(newSub);
    const result = await db.select().from(emailSubscriptions).where(eq(emailSubscriptions.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get/create email subscription:", error);
    throw error;
  }
}

export async function updateEmailSubscription(userId: number, updates: Partial<EmailSubscription>): Promise<EmailSubscription | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update email subscription: database not available");
    return undefined;
  }

  try {
    await db.update(emailSubscriptions).set(updates).where(eq(emailSubscriptions.userId, userId));
    const result = await db.select().from(emailSubscriptions).where(eq(emailSubscriptions.userId, userId)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to update email subscription:", error);
    throw error;
  }
}

// Email Notification Queries

export async function createEmailNotification(notification: InsertEmailNotification): Promise<EmailNotification | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create email notification: database not available");
    return undefined;
  }

  try {
    await db.insert(emailNotifications).values(notification);
    const result = await db.select().from(emailNotifications)
      .where(eq(emailNotifications.userId, notification.userId))
      .orderBy(desc(emailNotifications.createdAt))
      .limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create email notification:", error);
    throw error;
  }
}

export async function getUserEmailNotifications(userId: number): Promise<EmailNotification[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get email notifications: database not available");
    return [];
  }

  try {
    const result = await db.select().from(emailNotifications)
      .where(eq(emailNotifications.userId, userId))
      .orderBy(desc(emailNotifications.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get email notifications:", error);
    throw error;
  }
}

export async function updateEmailNotificationStatus(notificationId: number, sent: boolean): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update email notification: database not available");
    return;
  }

  try {
    await db.update(emailNotifications)
      .set({ sent: sent ? 1 : 0, sentAt: sent ? new Date() : null })
      .where(eq(emailNotifications.id, notificationId));
  } catch (error) {
    console.error("[Database] Failed to update email notification:", error);
    throw error;
  }
}


// ============================================
// Analytics Query Helpers
// ============================================

export async function getArticleStats(): Promise<{ total: number; published: number; totalViews: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.select().from(articles);
    const published = result.filter(a => a.published === 1).length;
    const totalViews = result.reduce((sum, a) => sum + (a.viewCount || 0), 0);
    return { total: result.length, published, totalViews };
  } catch (error) {
    console.error("[Database] Failed to get article stats:", error);
    throw error;
  }
}

export async function getCommentStats(): Promise<{ total: number; approved: number; pending: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.select().from(comments);
    const approved = result.filter(c => c.approved === 1).length;
    const pending = result.filter(c => c.approved === 0).length;
    return { total: result.length, approved, pending };
  } catch (error) {
    console.error("[Database] Failed to get comment stats:", error);
    throw error;
  }
}

export async function getUserStats(): Promise<{ total: number; admins: number; users: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.select().from(users);
    const admins = result.filter(u => u.role === 'admin').length;
    const userCount = result.filter(u => u.role === 'user').length;
    return { total: result.length, admins, users: userCount };
  } catch (error) {
    console.error("[Database] Failed to get user stats:", error);
    throw error;
  }
}

// ============================================
// User Management Query Helpers
// ============================================

export async function updateUserRole(userId: number, role: 'admin' | 'user'): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update user role:", error);
    throw error;
  }
}

export async function deactivateUser(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Mark user as inactive by setting a flag or deleting related data
    // For now, we'll just update the user record
    await db.update(users).set({ updatedAt: new Date() }).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to deactivate user:", error);
    throw error;
  }
}

// ============================================
// Content Moderation Query Helpers
// ============================================

export async function flagComment(commentId: number, reason: string, flaggedBy: number): Promise<ContentModeration> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(contentModerations).values({
      commentId,
      reason,
      flaggedBy,
      status: 'pending',
    });

    const moderation = await db.select().from(contentModerations)
      .where(eq(contentModerations.id, (result as any).insertId));
    return moderation[0];
  } catch (error) {
    console.error("[Database] Failed to flag comment:", error);
    throw error;
  }
}

export async function getModerationQueue(): Promise<ContentModeration[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    return await db.select().from(contentModerations)
      .where(eq(contentModerations.status, 'pending'));
  } catch (error) {
    console.error("[Database] Failed to get moderation queue:", error);
    throw error;
  }
}

export async function approveModerationItem(moderationId: number, moderatedBy: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(contentModerations)
      .set({ status: 'approved', moderatedBy, moderatedAt: new Date() })
      .where(eq(contentModerations.id, moderationId));
  } catch (error) {
    console.error("[Database] Failed to approve moderation:", error);
    throw error;
  }
}

export async function rejectModerationItem(moderationId: number, moderatedBy: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(contentModerations)
      .set({ status: 'rejected', moderatedBy, moderatedAt: new Date() })
      .where(eq(contentModerations.id, moderationId));
  } catch (error) {
    console.error("[Database] Failed to reject moderation:", error);
    throw error;
  }
}

// ============================================
// Email Campaign Query Helpers
// ============================================

export async function createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(emailCampaigns).values(campaign);
    const created = await db.select().from(emailCampaigns)
      .where(eq(emailCampaigns.id, (result as any).insertId));
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create email campaign:", error);
    throw error;
  }
}

export async function getCampaigns(): Promise<EmailCampaign[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    return await db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get campaigns:", error);
    throw error;
  }
}

export async function updateCampaignStatus(campaignId: number, status: 'draft' | 'scheduled' | 'sent' | 'failed'): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const updateData: any = { status };
    if (status === 'sent') {
      updateData.sentAt = new Date();
    }
    await db.update(emailCampaigns).set(updateData).where(eq(emailCampaigns.id, campaignId));
  } catch (error) {
    console.error("[Database] Failed to update campaign status:", error);
    throw error;
  }
}

export async function addCampaignRecipient(campaignId: number, userId: number): Promise<CampaignRecipient> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(campaignRecipients).values({
      campaignId,
      userId,
    });

    const recipient = await db.select().from(campaignRecipients)
      .where(eq(campaignRecipients.id, (result as any).insertId));
    return recipient[0];
  } catch (error) {
    console.error("[Database] Failed to add campaign recipient:", error);
    throw error;
  }
}

// ============================================
// User Analytics Query Helpers
// ============================================

export async function getOrCreateUserAnalytics(userId: number): Promise<UserAnalytic> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const existing = await db.select().from(userAnalytics)
      .where(eq(userAnalytics.userId, userId));

    if (existing.length > 0) {
      return existing[0];
    }

    const result = await db.insert(userAnalytics).values({ userId });
    const created = await db.select().from(userAnalytics)
      .where(eq(userAnalytics.id, (result as any).insertId));
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to get or create user analytics:", error);
    throw error;
  }
}

export async function updateUserAnalytics(userId: number, updates: Partial<InsertUserAnalytic>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const updateData: any = { ...updates, lastActivityAt: new Date() };
    await db.update(userAnalytics)
      .set(updateData)
      .where(eq(userAnalytics.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to update user analytics:", error);
    throw error;
  }
}


// ============================================
// User Notifications Query Helpers
// ============================================
export async function createUserNotification(notification: InsertUserNotification): Promise<UserNotification> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(userNotifications).values(notification);
    const created = await db.select().from(userNotifications)
      .where(eq(userNotifications.id, (result as any).insertId));
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to create user notification:", error);
    throw error;
  }
}

export async function getUserNotifications(userId: number, limit: number = 20): Promise<UserNotification[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    return await db.select().from(userNotifications)
      .where(eq(userNotifications.userId, userId))
      .orderBy(desc(userNotifications.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get user notifications:", error);
    throw error;
  }
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.select().from(userNotifications)
      .where(and(eq(userNotifications.userId, userId), eq(userNotifications.isRead, 0)));
    return result.length;
  } catch (error) {
    console.error("[Database] Failed to get unread notification count:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.update(userNotifications)
      .set({ isRead: 1, readAt: new Date() })
      .where(eq(userNotifications.id, notificationId));
  } catch (error) {
    console.error("[Database] Failed to mark notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.update(userNotifications)
      .set({ isRead: 1, readAt: new Date() })
      .where(eq(userNotifications.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to mark all notifications as read:", error);
    throw error;
  }
}

export async function deleteUserNotification(notificationId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.delete(userNotifications)
      .where(eq(userNotifications.id, notificationId));
  } catch (error) {
    console.error("[Database] Failed to delete user notification:", error);
    throw error;
  }
}

// ============================================
// User Activity Query Helpers
// ============================================
export async function logUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const result = await db.insert(userActivity).values(activity);
    const created = await db.select().from(userActivity)
      .where(eq(userActivity.id, (result as any).insertId));
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to log user activity:", error);
    throw error;
  }
}

export async function getUserActivity(userId: number, limit: number = 50): Promise<UserActivity[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    return await db.select().from(userActivity)
      .where(eq(userActivity.userId, userId))
      .orderBy(desc(userActivity.createdAt))
      .limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get user activity:", error);
    throw error;
  }
}

export async function getUserActivityStats(userId: number): Promise<{ views: number; comments: number; uploads: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const activities = await db.select().from(userActivity)
      .where(eq(userActivity.userId, userId));
    
    const stats = {
      views: activities.filter(a => a.activityType === 'view_article').length,
      comments: activities.filter(a => a.activityType === 'create_comment').length,
      uploads: activities.filter(a => a.activityType === 'upload_file').length,
    };
    return stats;
  } catch (error) {
    console.error("[Database] Failed to get user activity stats:", error);
    throw error;
  }
}

// ============================================
// Notification Preferences Query Helpers
// ============================================
export async function getOrCreateNotificationPreferences(userId: number): Promise<NotificationPreference> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const existing = await db.select().from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));
    if (existing.length > 0) {
      return existing[0];
    }
    const result = await db.insert(notificationPreferences).values({ userId });
    const created = await db.select().from(notificationPreferences)
      .where(eq(notificationPreferences.id, (result as any).insertId));
    return created[0];
  } catch (error) {
    console.error("[Database] Failed to get or create notification preferences:", error);
    throw error;
  }
}

export async function updateNotificationPreferences(userId: number, preferences: Partial<InsertNotificationPreference>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    const existing = await db.select().from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));
    
    if (existing.length === 0) {
      await db.insert(notificationPreferences).values({ userId, ...preferences });
    } else {
      await db.update(notificationPreferences)
        .set(preferences)
        .where(eq(notificationPreferences.userId, userId));
    }
  } catch (error) {
    console.error("[Database] Failed to update notification preferences:", error);
    throw error;
  }
}
