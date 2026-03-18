import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, files, fileShares, File, InsertFile, FileShare, InsertFileShare } from "../drizzle/schema";
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
