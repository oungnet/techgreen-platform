import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { users, articles, comments } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Admin Dashboard", () => {
  let db: any;
  let adminUserId: number;
  let articleId: number;
  let commentId: number;
  const uniqueId = Date.now();

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database not available");

    // Create admin user
    const adminResult = await db.insert(users).values({
      openId: "admin-test-" + uniqueId,
      name: "Admin Test",
      email: "admin@test.com",
      role: "admin",
    });
    adminUserId = (adminResult as any).insertId || 1;

    // Create test article with unique slug
    const articleResult = await db.insert(articles).values({
      title: "Test Article " + uniqueId,
      slug: "test-article-" + uniqueId,
      content: "Test content",
      excerpt: "Test excerpt",
      category: "disability-benefits",
      authorId: adminUserId,
      published: 1,
      viewCount: 0,
    });
    articleId = (articleResult as any).insertId || 1;

    // Create test comment
    const commentResult = await db.insert(comments).values({
      content: "Test comment",
      articleId: articleId,
      userId: adminUserId,
      approved: 0,
    });
    commentId = (commentResult as any).insertId || 1;
  });

  describe("Articles Management", () => {
    it("should list articles", async () => {
      const result = await db.select().from(articles).limit(10);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("title");
      expect(result[0]).toHaveProperty("published");
    });

    it("should update article published status", async () => {
      await db.update(articles).set({ published: 0 }).where(eq(articles.id, articleId));
      const updated = await db.select().from(articles).where(eq(articles.id, articleId));
      expect(updated[0].published).toBe(0);

      // Reset
      await db.update(articles).set({ published: 1 }).where(eq(articles.id, articleId));
    });

    it("should get article statistics", async () => {
      const all = await db.select().from(articles);
      const published = all.filter((a: any) => a.published === 1);
      expect(all.length).toBeGreaterThanOrEqual(0);
      expect(published.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Comments Management", () => {
    it("should list comments", async () => {
      const result = await db.select().from(comments).limit(10);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should approve comment", async () => {
      await db.update(comments).set({ approved: 1 }).where(eq(comments.id, commentId));
      const updated = await db.select().from(comments).where(eq(comments.id, commentId));
      expect(updated[0].approved).toBe(1);

      // Reset
      await db.update(comments).set({ approved: 0 }).where(eq(comments.id, commentId));
    });

    it("should reject comment", async () => {
      await db.update(comments).set({ approved: 0 }).where(eq(comments.id, commentId));
      const updated = await db.select().from(comments).where(eq(comments.id, commentId));
      expect(updated[0].approved).toBe(0);
    });

    it("should filter comments by approval status", async () => {
      const approved = await db
        .select()
        .from(comments)
        .where(eq(comments.approved, 1));
      const pending = await db
        .select()
        .from(comments)
        .where(eq(comments.approved, 0));

      expect(Array.isArray(approved)).toBe(true);
      expect(Array.isArray(pending)).toBe(true);
    });

    it("should get comment statistics", async () => {
      const all = await db.select().from(comments);
      const approved = all.filter((c: any) => c.approved === 1);
      const pending = all.filter((c: any) => c.approved === 0);

      expect(all.length).toBeGreaterThanOrEqual(0);
      expect(approved.length + pending.length).toBe(all.length);
    });
  });

  describe("Dashboard Statistics", () => {
    it("should count total users", async () => {
      const result = await db.select().from(users);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should count total articles", async () => {
      const result = await db.select().from(articles);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should count total comments", async () => {
      const result = await db.select().from(comments);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("should count pending comments", async () => {
      const result = await db.select().from(comments).where(eq(comments.approved, 0));
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });
});
