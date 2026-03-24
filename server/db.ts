import "dotenv/config";
import { eq, and, or, desc, like, sql } from "drizzle-orm";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema";
import { ENV } from './_core/env';

const DATABASE_URL = process.env.DATABASE_URL || ENV.databaseUrl || "";

function maskDatabaseUrl(url: string) {
  if (!url) return "(empty)";
  try {
    const parsed = new URL(url);
    const username = parsed.username ? `${parsed.username}:***@` : "";
    return `${parsed.protocol}//${username}${parsed.host}${parsed.pathname}`;
  } catch {
    return "(invalid-url)";
  }
}

console.log("[Database] Config URL:", maskDatabaseUrl(DATABASE_URL));

if (!DATABASE_URL) {
  throw new Error("[Database] DATABASE_URL is missing.");
}

// Create connection pool
const pool = mysql.createPool(DATABASE_URL);

// Export db instance
export const db = drizzle(pool, {
  schema,
  mode: 'default',
});

// Re-export schema types for convenience
export type User = schema.User;
export type InsertUser = schema.InsertUser;
export type AuthCredential = schema.AuthCredential;
export type InsertAuthCredential = schema.InsertAuthCredential;
export type File = schema.File;
export type InsertFile = schema.InsertFile;
export type FileShare = schema.FileShare;
export type InsertFileShare = schema.InsertFileShare;
export type Article = schema.Article;
export type InsertArticle = schema.InsertArticle;
export type Comment = schema.Comment;
export type InsertComment = schema.InsertComment;
export type Rating = schema.Rating;
export type InsertRating = schema.InsertRating;

const {
  users, authCredentials, files, fileShares, articles, comments, ratings,
  emailSubscriptions, emailNotifications, contentModerations,
  emailCampaigns, campaignRecipients, userAnalytics,
  userNotifications, userActivity, notificationPreferences
} = schema;

export async function getDb() {
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, any> = {};

    const textFields = ["name", "email", "loginMethod", "bio", "avatar", "phone", "address"] as const;

    textFields.forEach(field => {
      if (user[field] !== undefined) {
        values[field] = user[field];
        updateSet[field] = user[field];
      }
    });

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
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUserPasswordHash(userId: number, passwordHash: string) {
  await db
    .insert(authCredentials)
    .values({ userId, passwordHash })
    .onDuplicateKeyUpdate({
      set: {
        passwordHash,
        updatedAt: new Date(),
      },
    });
}

export async function getUserPasswordHash(userId: number): Promise<string | null> {
  const result = await db
    .select({ passwordHash: authCredentials.passwordHash })
    .from(authCredentials)
    .where(eq(authCredentials.userId, userId))
    .limit(1);
  return result[0]?.passwordHash ?? null;
}

// File Management Queries
export async function createFile(file: InsertFile): Promise<File | undefined> {
  try {
    await db.insert(files).values(file);
    const insertedFile = await db.select().from(files).where(eq(files.fileKey, file.fileKey)).limit(1);
    return insertedFile.length > 0 ? insertedFile[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to create file:", error);
    throw error;
  }
}

export async function getFileById(fileId: number): Promise<File | undefined> {
  const result = await db.select().from(files).where(eq(files.id, fileId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserFiles(userId: number): Promise<File[]> {
  return await db.select().from(files)
    .where(eq(files.userId, userId))
    .orderBy(desc(files.createdAt));
}

export async function deleteFile(fileId: number, userId: number): Promise<boolean> {
  const file = await getFileById(fileId);
  if (!file || file.userId !== userId) {
    throw new Error("Unauthorized: file not found or user is not the owner");
  }

  await db.delete(fileShares).where(eq(fileShares.fileId, fileId));
  await db.delete(files).where(eq(files.id, fileId));
  return true;
}

export async function updateFile(fileId: number, userId: number, updates: Partial<File>): Promise<File | undefined> {
  const file = await getFileById(fileId);
  if (!file || file.userId !== userId) {
    throw new Error("Unauthorized: file not found or user is not the owner");
  }

  await db.update(files).set(updates).where(eq(files.id, fileId));
  return getFileById(fileId);
}

const fallbackArticles: Article[] = [
  {
    id: 1,
    title: "Smart Farming IoT",
    slug: "smart-farming-iot",
    content: "Using IoT sensors to optimize irrigation and crop productivity.",
    excerpt: "Using IoT in agriculture",
    category: "Tech",
    authorId: 1,
    coverImage: null,
    viewCount: 120,
    published: 1,
    createdAt: new Date("2026-01-10T09:00:00.000Z"),
    updatedAt: new Date("2026-01-10T09:00:00.000Z"),
  },
  {
    id: 2,
    title: "Carbon Credit Thailand",
    slug: "carbon-credit-thailand",
    content: "How ESG and carbon credit mechanisms are evolving in Thailand.",
    excerpt: "ESG and sustainability",
    category: "ESG",
    authorId: 1,
    coverImage: null,
    viewCount: 87,
    published: 1,
    createdAt: new Date("2026-01-18T09:00:00.000Z"),
    updatedAt: new Date("2026-01-18T09:00:00.000Z"),
  },
  {
    id: 3,
    title: "Green AI in Industry",
    slug: "green-ai-industry",
    content: "Applying efficient AI models to reduce energy consumption in factories.",
    excerpt: "Efficient AI and sustainability",
    category: "Innovation",
    authorId: 1,
    coverImage: null,
    viewCount: 64,
    published: 1,
    createdAt: new Date("2026-02-02T09:00:00.000Z"),
    updatedAt: new Date("2026-02-02T09:00:00.000Z"),
  },
];

function isConnectionError(error: unknown) {
  const topLevelCode = (error as { code?: string })?.code;
  const nestedCode = (error as { cause?: { code?: string } })?.cause?.code;
  const code = topLevelCode ?? nestedCode;
  return code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT";
}

function getFallbackPublishedArticles(filters: {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  tag?: string;
}) {
  const search = filters.search?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();
  const tag = filters.tag?.trim().replace(/^#/, "").toLowerCase();

  let result = fallbackArticles.filter((article) => article.published === 1);

  if (category && category !== "all") {
    result = result.filter((article) => article.category.toLowerCase() === category);
  }

  if (search) {
    result = result.filter((article) => {
      const haystack = `${article.title} ${article.excerpt ?? ""} ${article.content} ${article.category}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  if (tag) {
    result = result.filter((article) => {
      const haystack = `${article.title} ${article.excerpt ?? ""} ${article.content}`.toLowerCase();
      return haystack.includes(`#${tag}`) || haystack.includes(tag);
    });
  }

  result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const limit = filters.limit ?? 10;
  const offset = filters.offset ?? 0;
  return result.slice(offset, offset + limit);
}

// Article Management Queries
export async function createArticle(article: InsertArticle): Promise<Article | undefined> {
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
  try {
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    if (isConnectionError(error)) {
      return fallbackArticles.find((article) => article.slug === slug);
    }
    throw error;
  }
}

export async function getPublishedArticles(filters: {
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  tag?: string;
}) {
  try {
    let query = db.select().from(articles).where(eq(articles.published, 1));

    if (filters.category) {
      query = db.select().from(articles).where(and(eq(articles.published, 1), eq(articles.category, filters.category))) as any;
    }

    if (filters.search) {
      query = db.select().from(articles).where(and(eq(articles.published, 1), or(like(articles.title, `%${filters.search}%`), like(articles.content, `%${filters.search}%`)))) as any;
    }

    return await (query as any).limit(filters.limit || 10).offset(filters.offset || 0).orderBy(desc(articles.createdAt));
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn("[Database] Cannot get articles from MySQL, using in-memory fallback.");
      return getFallbackPublishedArticles(filters);
    }
    throw error;
  }
}

export async function getPublishedArticleCategories() {
  try {
    const result = await db.select({ category: articles.category })
      .from(articles)
      .where(eq(articles.published, 1))
      .groupBy(articles.category);
    return result.map(r => r.category);
  } catch (error) {
    if (isConnectionError(error)) {
      const unique = Array.from(new Set(fallbackArticles.map((article) => article.category)));
      return unique;
    }
    throw error;
  }
}

export async function getPublishedArticleTags(limit: number = 50) {
  try {
    return [];
  } catch (error) {
    if (isConnectionError(error)) {
      return [];
    }
    throw error;
  }
}

export async function getPublishedArticlesPage(filters: {
  limit: number;
  offset: number;
  search?: string;
  category?: string;
  tag?: string;
}) {
  const items = await getPublishedArticles(filters);
  let total = 0;

  try {
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(articles).where(eq(articles.published, 1));
    total = totalResult[0]?.count || 0;
  } catch (error) {
    if (isConnectionError(error)) {
      total = getFallbackPublishedArticles({ ...filters, limit: 10000, offset: 0 }).length;
    } else {
      throw error;
    }
  }

  return {
    items,
    total,
    limit: filters.limit,
    offset: filters.offset,
  };
}

// Comments & Ratings
export async function createComment(comment: InsertComment) {
  await db.insert(comments).values(comment);
  return await db.select().from(comments).orderBy(desc(comments.createdAt)).limit(1).then(r => r[0]);
}

export async function getArticleComments(articleId: number) {
  return await db.select().from(comments).where(and(eq(comments.articleId, articleId), eq(comments.approved, 1))).orderBy(desc(comments.createdAt));
}

export async function createOrUpdateRating(rating: InsertRating) {
  await db.insert(ratings).values(rating).onDuplicateKeyUpdate({
    set: { score: rating.score, updatedAt: new Date() }
  });
  return await db.select().from(ratings).where(and(eq(ratings.articleId, rating.articleId), eq(ratings.userId, rating.userId))).limit(1).then(r => r[0]);
}

export async function getArticleRating(articleId: number) {
  const result = await db.select({
    average: sql<number>`avg(${ratings.score})`,
    count: sql<number>`count(*)`
  }).from(ratings).where(eq(ratings.articleId, articleId));

  return {
    average: Number(result[0]?.average || 0),
    count: result[0]?.count || 0
  };
}

// User Activity & Notifications
export async function logUserActivity(activity: schema.InsertUserActivity) {
  await db.insert(userActivity).values(activity);
}

export async function getUserActivities(userId: number, limit: number = 10) {
  return await db.select().from(userActivity).where(eq(userActivity.userId, userId)).orderBy(desc(userActivity.createdAt)).limit(limit);
}

export async function getUserNotifications(userId: number) {
  return await db.select().from(userNotifications).where(eq(userNotifications.userId, userId)).orderBy(desc(userNotifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number, userId: number) {
  await db.update(userNotifications).set({ isRead: 1, readAt: new Date() }).where(and(eq(userNotifications.id, notificationId), eq(userNotifications.userId, userId)));
}

export async function getDashboardStats(userId: number) {
  const [articlesRead, commentsMade, filesUploaded] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(userActivity).where(and(eq(userActivity.userId, userId), eq(userActivity.activityType, 'view_article'))),
    db.select({ count: sql<number>`count(*)` }).from(comments).where(eq(comments.userId, userId)),
    db.select({ count: sql<number>`count(*)` }).from(files).where(eq(files.userId, userId)),
  ]);

  return {
    articlesRead: articlesRead[0]?.count || 0,
    commentsMade: commentsMade[0]?.count || 0,
    filesUploaded: filesUploaded[0]?.count || 0,
  };
}

export async function shareFile(share: InsertFileShare): Promise<FileShare | undefined> {
  try {
    await db.insert(fileShares).values(share);
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
  return await db.select().from(fileShares).where(eq(fileShares.fileId, fileId));
}

export async function deleteFileShare(shareId: number, userId: number): Promise<boolean> {
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
}

// Analytics
export async function getArticleStats() {
  const [total, published, views] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(articles),
    db.select({ count: sql<number>`count(*)` }).from(articles).where(eq(articles.published, 1)),
    db.select({ count: sql<number>`sum(${articles.viewCount})` }).from(articles),
  ]);
  return { total: total[0]?.count || 0, published: published[0]?.count || 0, views: views[0]?.count || 0 };
}

export async function getCommentStats() {
  const [total, pending] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(comments),
    db.select({ count: sql<number>`count(*)` }).from(comments).where(eq(comments.approved, 0)),
  ]);
  return { total: total[0]?.count || 0, pending: pending[0]?.count || 0 };
}

export async function getUserStats() {
  const [total, admins] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'admin')),
  ]);
  return { total: total[0]?.count || 0, admins: admins[0]?.count || 0 };
}

// Search
export async function searchArticles(query: string, limit: number = 10, offset: number = 0, category?: string, tag?: string) {
  let whereClause = and(eq(articles.published, 1), or(like(articles.title, `%${query}%`), like(articles.content, `%${query}%`)));
  if (category) {
    whereClause = and(whereClause, eq(articles.category, category));
  }
  const items = await db.select().from(articles).where(whereClause).limit(limit).offset(offset).orderBy(desc(articles.createdAt));
  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(articles).where(whereClause);
  return { items, total: totalResult[0]?.count || 0 };
}

// Campaigns
export async function createEmailCampaign(campaign: any) {
  await db.insert(emailCampaigns).values(campaign);
  return await db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt)).limit(1).then(r => r[0]);
}

export async function getCampaigns() {
  return await db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
}

export async function updateCampaignStatus(campaignId: number, status: any) {
  await db.update(emailCampaigns).set({ status, updatedAt: new Date() }).where(eq(emailCampaigns.id, campaignId));
}

export async function addCampaignRecipient(campaignId: number, userId: number) {
  await db.insert(campaignRecipients).values({ campaignId, userId });
}

// Dashboard & Notifications
export async function getUserActivityStats(userId: number) {
  return await getDashboardStats(userId);
}

export async function getUnreadNotificationCount(userId: number) {
  const result = await db.select({ count: sql<number>`count(*)` }).from(userNotifications).where(and(eq(userNotifications.userId, userId), eq(userNotifications.isRead, 0)));
  return result[0]?.count || 0;
}

export async function markAllNotificationsAsRead(userId: number) {
  await db.update(userNotifications).set({ isRead: 1, readAt: new Date() }).where(eq(userNotifications.userId, userId));
}

export async function deleteUserNotification(notificationId: number) {
  await db.delete(userNotifications).where(eq(userNotifications.id, notificationId));
}

export async function getUserActivity(userId: number, limit: number = 10) {
  return await db.select().from(userActivity).where(eq(userActivity.userId, userId)).orderBy(desc(userActivity.createdAt)).limit(limit);
}

export async function getOrCreateNotificationPreferences(userId: number) {
  const existing = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];

  await db.insert(notificationPreferences).values({ userId });
  return await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, userId)).limit(1).then(r => r[0]);
}

export async function updateNotificationPreferences(userId: number, prefs: any) {
  await db.update(notificationPreferences).set({ ...prefs, updatedAt: new Date() }).where(eq(notificationPreferences.userId, userId));
}

// Subscriptions
export async function getOrCreateEmailSubscription(userId: number) {
  const existing = await db.select().from(emailSubscriptions).where(eq(emailSubscriptions.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];

  await db.insert(emailSubscriptions).values({ userId });
  return await db.select().from(emailSubscriptions).where(eq(emailSubscriptions.userId, userId)).limit(1).then(r => r[0]);
}

export async function updateEmailSubscription(userId: number, updates: any) {
  await db.update(emailSubscriptions).set({ ...updates, updatedAt: new Date() }).where(eq(emailSubscriptions.userId, userId));
  return await getOrCreateEmailSubscription(userId);
}

export async function getUserEmailNotifications(userId: number) {
  return await db.select().from(emailNotifications).where(eq(emailNotifications.userId, userId)).orderBy(desc(emailNotifications.createdAt));
}

// Moderation
export async function flagComment(commentId: number, reason: string, flaggedBy: number) {
  await db.insert(contentModerations).values({ commentId, reason, flaggedBy });
}

export async function getModerationQueue() {
  return await db.select().from(contentModerations).where(eq(contentModerations.status, 'pending')).orderBy(desc(contentModerations.createdAt));
}

export async function approveModerationItem(moderationId: number, moderatedBy: number) {
  const item = await db.select().from(contentModerations).where(eq(contentModerations.id, moderationId)).limit(1).then(r => r[0]);
  if (!item) return;

  await db.update(contentModerations).set({ status: 'approved', moderatedBy, moderatedAt: new Date() }).where(eq(contentModerations.id, moderationId));
  await db.update(comments).set({ approved: 1 }).where(eq(comments.id, item.commentId));
}

export async function rejectModerationItem(moderationId: number, moderatedBy: number) {
  await db.update(contentModerations).set({ status: 'rejected', moderatedBy, moderatedAt: new Date() }).where(eq(contentModerations.id, moderationId));
}

export async function getOrCreateUserAnalytics(userId: number) {
  const existing = await db.select().from(userAnalytics).where(eq(userAnalytics.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];

  await db.insert(userAnalytics).values({ userId });
  return await db.select().from(userAnalytics).where(eq(userAnalytics.userId, userId)).limit(1).then(r => r[0]);
}
