import { describe, it, expect, beforeEach, vi } from "vitest";
import { db } from "./db";
import {
  createArticle,
  getArticleBySlug,
  getPublishedArticles,
  searchArticles,
  createComment,
  getArticleComments,
  createOrUpdateRating,
  getArticleRating,
} from "./db";

describe("Articles API", () => {
  describe("Article Management", () => {
    it("should create an article", async () => {
      const article = await createArticle({
        title: "Test Article",
        slug: "test-article",
        excerpt: "Test excerpt",
        content: "Test content",
        category: "benefits",
        published: true,
        authorId: 1,
      });

      expect(article).toBeDefined();
      expect(article?.title).toBe("Test Article");
      expect(article?.authorId).toBe(1);
    });

    it("should get article by slug", async () => {
      const article = await getArticleBySlug("test-article");
      if (article) {
        expect(article.slug).toBe("test-article");
      }
    });

    it("should get published articles", async () => {
      const articles = await getPublishedArticles(10, 0);
      expect(Array.isArray(articles)).toBe(true);
      articles.forEach((article) => {
        expect(article.published).toBe(1);
      });
    });

    it("should search articles by keyword", async () => {
      const results = await searchArticles("test", 10, 0);
      expect(Array.isArray(results)).toBe(true);
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
      const comments = await getArticleComments(1);
      expect(Array.isArray(comments)).toBe(true);
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
      const rating = await getArticleRating(1);
      expect(rating).toBeDefined();
      if (rating && rating.average) {
        expect(rating.average).toBeGreaterThanOrEqual(0);
        expect(rating.average).toBeLessThanOrEqual(5);
      }
    });
  });
});
