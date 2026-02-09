import { media, type Media, type InsertMedia } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getMedia(): Promise<Media[]>;
  createMedia(item: InsertMedia): Promise<Media>;
}

export class DatabaseStorage implements IStorage {
  async getMedia(): Promise<Media[]> {
    return await db.select().from(media);
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const [item] = await db.insert(media).values(insertMedia).returning();
    return item;
  }
}

export const storage = new DatabaseStorage();
