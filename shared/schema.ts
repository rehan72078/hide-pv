import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export * from "./models/auth";

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'photo' or 'video'
  title: text("title").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMediaSchema = createInsertSchema(media).omit({ 
  id: true, 
  createdAt: true 
});

export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
