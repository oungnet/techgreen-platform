import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createFile,
  deleteFile,
  deleteFileShare,
  getFileById,
  getFileShares,
  getUserFiles,
  shareFile,
  updateFile,
} from "../db";
import { storagePut, storageGet } from "../storage";
import { TRPCError } from "@trpc/server";

// Validation schemas
const uploadFileSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileData: z.string(), // base64 encoded
  mimeType: z.string().min(1).max(100),
  fileSize: z.number().min(1).max(52428800), // 50MB max
  category: z.enum(["general", "disability", "tax", "resources", "innovation", "partnership"]).default("general"),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(false),
});

const shareFileSchema = z.object({
  fileId: z.number(),
  sharedWithUserId: z.number(),
  permission: z.enum(["view", "download", "edit"]).default("view"),
  expiresAt: z.date().optional(),
});

const updateFileSchema = z.object({
  fileId: z.number(),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().optional(),
  category: z.enum(["general", "disability", "tax", "resources", "innovation", "partnership"]).optional(),
});

export const filesRouter = router({
  // Upload a file
  upload: protectedProcedure
    .input(uploadFileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Decode base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Generate unique file key
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const fileKey = `${ctx.user.id}-files/${input.fileName}-${timestamp}-${randomSuffix}`;

        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.mimeType);

        // Save file metadata to database
        const file = await createFile({
          userId: ctx.user.id,
          fileName: input.fileName,
          fileKey,
          fileUrl: url,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
          category: input.category,
          description: input.description,
          isPublic: input.isPublic ? 1 : 0,
        });

        if (!file) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save file metadata",
          });
        }

        return file;
      } catch (error) {
        console.error("[Files] Upload error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "File upload failed",
        });
      }
    }),

  // List user's files
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getUserFiles(ctx.user.id);
    } catch (error) {
      console.error("[Files] List error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch files",
      });
    }
  }),

  // Get file details
  getById: protectedProcedure
    .input(z.object({ fileId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const file = await getFileById(input.fileId);

        if (!file) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found",
          });
        }

        // Check access: owner or shared with user
        if (file.userId !== ctx.user.id && !file.isPublic) {
          const shares = await getFileShares(file.id);
          const hasAccess = shares.some(
            (share) =>
              share.sharedWithUserId === ctx.user.id &&
              (!share.expiresAt || share.expiresAt > new Date())
          );

          if (!hasAccess) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have access to this file",
            });
          }
        }

        return file;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Files] GetById error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch file",
        });
      }
    }),

  // Delete a file
  delete: protectedProcedure
    .input(z.object({ fileId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const success = await deleteFile(input.fileId, ctx.user.id);

        if (!success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found or you do not have permission to delete it",
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Files] Delete error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to delete file",
        });
      }
    }),

  // Update file metadata
  update: protectedProcedure
    .input(updateFileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { fileId, ...updates } = input;
        const file = await updateFile(fileId, ctx.user.id, {
          ...updates,
          isPublic: updates.isPublic ? 1 : 0,
        });

        if (!file) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found or you do not have permission to update it",
          });
        }

        return file;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Files] Update error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to update file",
        });
      }
    }),

  // Share a file with another user
  share: protectedProcedure
    .input(shareFileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        // Verify file ownership
        const file = await getFileById(input.fileId);
        if (!file || file.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to share this file",
          });
        }

        // Generate share token
        const shareToken = `share_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        const share = await shareFile({
          fileId: input.fileId,
          sharedWithUserId: input.sharedWithUserId,
          permission: input.permission,
          shareToken,
          expiresAt: input.expiresAt,
        });

        if (!share) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create share",
          });
        }

        return share;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Files] Share error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to share file",
        });
      }
    }),

  // Get file shares
  getShares: protectedProcedure
    .input(z.object({ fileId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        // Verify file ownership
        const file = await getFileById(input.fileId);
        if (!file || file.userId !== ctx.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to view shares for this file",
          });
        }

        return await getFileShares(input.fileId);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Files] GetShares error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch shares",
        });
      }
    }),

  // Delete a file share
  deleteShare: protectedProcedure
    .input(z.object({ shareId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const success = await deleteFileShare(input.shareId, ctx.user.id);

        if (!success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Share not found or you do not have permission to delete it",
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Files] DeleteShare error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to delete share",
        });
      }
    }),

  // Get download URL for a file
  getDownloadUrl: protectedProcedure
    .input(z.object({ fileId: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const file = await getFileById(input.fileId);

        if (!file) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found",
          });
        }

        // Check access
        if (file.userId !== ctx.user.id && !file.isPublic) {
          const shares = await getFileShares(file.id);
          const hasAccess = shares.some(
            (share) =>
              share.sharedWithUserId === ctx.user.id &&
              (share.permission === "download" || share.permission === "edit") &&
              (!share.expiresAt || share.expiresAt > new Date())
          );

          if (!hasAccess) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have download permission for this file",
            });
          }
        }

        const { url } = await storageGet(file.fileKey);
        return { url };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[Files] GetDownloadUrl error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get download URL",
        });
      }
    }),
});
