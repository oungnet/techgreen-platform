import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InsertArticle, InsertComment, InsertRating } from "./db";
import {
  createArticle,
  createComment,
  createOrUpdateRating,
  getArticleBySlug,
  getArticleComments,
  getArticleRating,
  getPublishedArticles,
  searchArticles,
} from "./db";

type InMemoryArticle = InsertArticle & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

type InMemoryComment = InsertComment & {
  id: number;
  approved: number;
  createdAt: Date;
  updatedAt: Date;
};

type InMemoryRating = InsertRating & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

const state: {
  articles: InMemoryArticle[];
  comments: InMemoryComment[];
  ratings: InMemoryRating[];
  ids: { article: number; comment: number; rating: number };
} = {
  articles: [],
  comments: [],
  ratings: [],
  ids: { article: 1, comment: 1, rating: 1 },
};

vi.mock("./db", () => {
  return {
    createArticle: vi.fn(async (article: InsertArticle) => {
      const now = new Date();
      const row: InMemoryArticle = {
        ...article,
        id: state.ids.article++,
        createdAt: now,
        updatedAt: now,
      };
      state.articles.push(row);
      return row;
    }),
    getArticleBySlug: vi.fn(async (slug: string) => {
      return state.articles.find((article) => article.slug === slug);
    }),
    getPublishedArticles: vi.fn(async (filters: { limit?: number; offset?: number; search?: string }) => {
      const limit = filters.limit ?? 10;
      const offset = filters.offset ?? 0;
      const search = filters.search?.toLowerCase().trim();
      const published = state.articles.filter((article) => article.published === 1);
      const filtered = search
        ? published.filter((article) => article.title.toLowerCase().includes(search) || article.content.toLowerCase().includes(search))
        : published;
      return filtered.slice(offset, offset + limit);
    }),
    searchArticles: vi.fn(async (query: string, limit: number = 10, offset: number = 0) => {
      const normalized = query.toLowerCase().trim();
      const items = state.articles
        .filter((article) => article.published === 1)
        .filter((article) => article.title.toLowerCase().includes(normalized) || article.content.toLowerCase().includes(normalized))
        .slice(offset, offset + limit);
      return {
        items,
        total: items.length,
      };
    }),
    createComment: vi.fn(async (comment: InsertComment) => {
      const now = new Date();
      const row: InMemoryComment = {
        ...comment,
        id: state.ids.comment++,
        approved: 1,
        createdAt: now,
        updatedAt: now,
      };
      state.comments.push(row);
      return row;
    }),
    getArticleComments: vi.fn(async (articleId: number) => {
      return state.comments.filter((comment) => comment.articleId === articleId && comment.approved === 1);
    }),
    createOrUpdateRating: vi.fn(async (rating: InsertRating) => {
      const existing = state.ratings.find((row) => row.articleId === rating.articleId && row.userId === rating.userId);
      if (existing) {
        existing.score = rating.score;
        existing.updatedAt = new Date();
        return existing;
      }
      const now = new Date();
      const row: InMemoryRating = {
        ...rating,
        id: state.ids.rating++,
        createdAt: now,
        updatedAt: now,
      };
      state.ratings.push(row);
      return row;
    }),
    getArticleRating: vi.fn(async (articleId: number) => {
      const rows = state.ratings.filter((rating) => rating.articleId === articleId);
      if (rows.length === 0) {
        return { average: 0, count: 0 };
      }
      const total = rows.reduce((sum, row) => sum + row.score, 0);
      return {
        average: total / rows.length,
        count: rows.length,
      };
    }),
  };
});

describe("Articles API", () => {
  beforeEach(() => {
    state.articles = [];
    state.comments = [];
    state.ratings = [];
    state.ids = { article: 1, comment: 1, rating: 1 };
  });

  describe("Article Management", () => {
    it("should create an article", async () => {
      const article = await createArticle({
        title: "Test Article",
        slug: "test-article",
        excerpt: "Test excerpt",
        content: "Test content",
        category: "benefits",
        published: 1,
        authorId: 1,
      });

      expect(article).toBeDefined();
      expect(article?.title).toBe("Test Article");
      expect(article?.authorId).toBe(1);
    });

    it("should get article by slug", async () => {
      await createArticle({
        title: "Test Article",
        slug: "test-article",
        excerpt: "Test excerpt",
        content: "Test content",
        category: "benefits",
        published: 1,
        authorId: 1,
      });

      const article = await getArticleBySlug("test-article");
      expect(article?.slug).toBe("test-article");
    });

    it("should get published articles", async () => {
      await createArticle({
        title: "Published",
        slug: "published",
        excerpt: "Published excerpt",
        content: "Published content",
        category: "benefits",
        published: 1,
        authorId: 1,
      });
      await createArticle({
        title: "Draft",
        slug: "draft",
        excerpt: "Draft excerpt",
        content: "Draft content",
        category: "benefits",
        published: 0,
        authorId: 1,
      });

      const articles = await getPublishedArticles({ limit: 10, offset: 0 });
      expect(Array.isArray(articles)).toBe(true);
      articles.forEach((article) => {
        expect(article.published).toBe(1);
      });
    });

    it("should search articles by keyword", async () => {
      await createArticle({
        title: "Test keyword",
        slug: "search-me",
        excerpt: "Test excerpt",
        content: "searchable content",
        category: "benefits",
        published: 1,
        authorId: 1,
      });

      const results = await searchArticles("test", 10, 0);
      expect(Array.isArray(results.items)).toBe(true);
      expect(results.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Comments", () => {
    it("should create a comment", async () => {
      const comment = await createComment({
        articleId: 1,
        userId: 1,
        content: "Great article!",
      });

      expect(comment).toBeDefined();
      expect(comment?.content).toBe("Great article!");
      expect(comment?.userId).toBe(1);
    });

    it("should get article comments", async () => {
      await createComment({
        articleId: 1,
        userId: 1,
        content: "Great article!",
      });
      const comments = await getArticleComments(1);
      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBe(1);
    });
  });

  describe("Ratings", () => {
    it("should create or update rating", async () => {
      const rating = await createOrUpdateRating({
        articleId: 1,
        userId: 1,
        score: 5,
      });

      expect(rating).toBeDefined();
      expect(rating?.score).toBe(5);
    });

    it("should get article rating", async () => {
      await createOrUpdateRating({
        articleId: 1,
        userId: 1,
        score: 4,
      });
      await createOrUpdateRating({
        articleId: 1,
        userId: 2,
        score: 5,
      });

      const rating = await getArticleRating(1);
      expect(rating).toBeDefined();
      expect(rating.average).toBeGreaterThanOrEqual(0);
      expect(rating.average).toBeLessThanOrEqual(5);
      expect(rating.count).toBe(2);
    });
  });
});
