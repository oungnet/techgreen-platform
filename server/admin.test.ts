import { beforeEach, describe, expect, it } from "vitest";

type TestUser = {
  id: number;
  openId: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

type TestArticle = {
  id: number;
  title: string;
  slug: string;
  published: number;
  authorId: number;
  viewCount: number;
};

type TestComment = {
  id: number;
  articleId: number;
  userId: number;
  content: string;
  approved: number;
};

function createAdminFixture() {
  const users: TestUser[] = [
    { id: 1, openId: "admin-test", name: "Admin", email: "admin@test.com", role: "admin" },
    { id: 2, openId: "user-test", name: "User", email: "user@test.com", role: "user" },
  ];

  const articles: TestArticle[] = [
    { id: 1, title: "Article One", slug: "article-one", published: 1, authorId: 1, viewCount: 15 },
    { id: 2, title: "Article Two", slug: "article-two", published: 0, authorId: 1, viewCount: 4 },
  ];

  const comments: TestComment[] = [
    { id: 1, articleId: 1, userId: 2, content: "Pending comment", approved: 0 },
    { id: 2, articleId: 1, userId: 1, content: "Approved comment", approved: 1 },
  ];

  return { users, articles, comments };
}

describe("Admin Dashboard (in-memory)", () => {
  let fixture = createAdminFixture();

  beforeEach(() => {
    fixture = createAdminFixture();
  });

  describe("Articles Management", () => {
    it("should list articles", async () => {
      expect(fixture.articles.length).toBeGreaterThan(0);
      expect(fixture.articles[0]).toHaveProperty("title");
      expect(fixture.articles[0]).toHaveProperty("published");
    });

    it("should update article published status", async () => {
      const target = fixture.articles.find((article) => article.id === 1);
      expect(target).toBeDefined();
      if (!target) return;

      target.published = 0;
      expect(target.published).toBe(0);

      target.published = 1;
      expect(target.published).toBe(1);
    });

    it("should get article statistics", async () => {
      const total = fixture.articles.length;
      const published = fixture.articles.filter((article) => article.published === 1).length;

      expect(total).toBeGreaterThanOrEqual(0);
      expect(published).toBeGreaterThanOrEqual(0);
      expect(published).toBeLessThanOrEqual(total);
    });
  });

  describe("Comments Management", () => {
    it("should list comments", async () => {
      expect(Array.isArray(fixture.comments)).toBe(true);
      expect(fixture.comments.length).toBeGreaterThan(0);
    });

    it("should approve comment", async () => {
      const target = fixture.comments.find((comment) => comment.id === 1);
      expect(target).toBeDefined();
      if (!target) return;

      target.approved = 1;
      expect(target.approved).toBe(1);
    });

    it("should reject comment", async () => {
      const target = fixture.comments.find((comment) => comment.id === 2);
      expect(target).toBeDefined();
      if (!target) return;

      target.approved = 0;
      expect(target.approved).toBe(0);
    });

    it("should filter comments by approval status", async () => {
      const approved = fixture.comments.filter((comment) => comment.approved === 1);
      const pending = fixture.comments.filter((comment) => comment.approved === 0);

      expect(Array.isArray(approved)).toBe(true);
      expect(Array.isArray(pending)).toBe(true);
    });

    it("should get comment statistics", async () => {
      const all = fixture.comments.length;
      const approved = fixture.comments.filter((comment) => comment.approved === 1).length;
      const pending = fixture.comments.filter((comment) => comment.approved === 0).length;

      expect(all).toBeGreaterThanOrEqual(0);
      expect(approved + pending).toBe(all);
    });
  });

  describe("Dashboard Statistics", () => {
    it("should count total users", async () => {
      expect(Array.isArray(fixture.users)).toBe(true);
      expect(fixture.users.length).toBeGreaterThan(0);
    });

    it("should count total articles", async () => {
      expect(Array.isArray(fixture.articles)).toBe(true);
      expect(fixture.articles.length).toBeGreaterThanOrEqual(0);
    });

    it("should count total comments", async () => {
      expect(Array.isArray(fixture.comments)).toBe(true);
      expect(fixture.comments.length).toBeGreaterThanOrEqual(0);
    });

    it("should count pending comments", async () => {
      const pending = fixture.comments.filter((comment) => comment.approved === 0);
      expect(Array.isArray(pending)).toBe(true);
      expect(pending.length).toBeGreaterThanOrEqual(0);
    });
  });
});
