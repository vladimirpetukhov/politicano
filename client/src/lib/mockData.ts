import { Article, User, Comment } from "@shared/schema";

export const mockUsers: User[] = [
  {
    id: 1,
    uid: "mock-1",
    email: "admin@politicalblog.com",
    displayName: null,
    avatarUrl: null,
    role: "admin",
  },
  {
    id: 2,
    uid: "mock-2",
    email: "blogger@politicalblog.com",
    displayName: null,
    avatarUrl: null,
    role: "blogger",
  },
  {
    id: 3,
    uid: "mock-3",
    email: "user@politicalblog.com",
    displayName: null,
    avatarUrl: null,
    role: "user",
  },
];

export const mockArticles: Article[] = [
  {
    id: 1,
    title: "Важни политически реформи през 2024",
    content: "Съдържание на статията за политически реформи...",
    authorId: "mock-2",
    publishDate: new Date("2024-03-01").toISOString(),
    views: 150,
    likes: 45,
  },
  {
    id: 2,
    title: "Анализ на международните отношения",
    content: "Анализ на текущите международни отношения...",
    authorId: "mock-1",
    publishDate: new Date("2024-03-05").toISOString(),
    views: 200,
    likes: 67,
  },
  {
    id: 3,
    title: "Нови икономически мерки",
    content: "Разглеждане на новите икономически мерки...",
    authorId: "mock-2",
    publishDate: new Date("2024-03-10").toISOString(),
    views: 120,
    likes: 34,
  },
];

export const mockComments: Comment[] = [
  {
    id: 1,
    content: "Много добър анализ!",
    articleId: 1,
    authorId: "mock-3",
    createdAt: new Date("2024-03-02").toISOString(),
  },
  {
    id: 2,
    content: "Интересна гледна точка.",
    articleId: 1,
    authorId: "mock-2",
    createdAt: new Date("2024-03-03").toISOString(),
  },
];