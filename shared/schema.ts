import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoles = ["admin", "blogger", "user"] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase UID
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: userRoles }).notNull().default("user"),
});

// Таблица за съхранение на абонаментите за автори
export const authorSubscriptions = pgTable("author_subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Firebase UID на абоната
  authorId: text("author_id").notNull(), // Firebase UID на автора
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: text("author_id").notNull(), // Firebase UID
  publishDate: timestamp("publish_date").notNull().defaultNow(),
  views: integer("views").notNull().default(0),
  likes: integer("likes").notNull().default(0),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  articleId: integer("article_id").notNull(),
  authorId: text("author_id").notNull(), // Firebase UID
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Update schemas
export const insertUserSchema = createInsertSchema(users).pick({
  uid: true,
  email: true,
  displayName: true,
  avatarUrl: true,
  role: true,
});

export const updateUserSchema = z.object({
  displayName: z.string().min(2, "Името трябва да е поне 2 символа"),
  avatarUrl: z.string().url("Невалиден URL адрес").optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Паролата трябва да е поне 6 символа"),
  newPassword: z.string().min(6, "Паролата трябва да е поне 6 символа"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Паролите не съвпадат",
  path: ["confirmPassword"],
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  content: true,
  authorId: true,
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  content: true,
  articleId: true,
  authorId: true,
});

export type User = typeof users.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;