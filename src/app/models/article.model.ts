
import { User } from './user.model';

export class Category {
  id: string;
  name: { [key: string]: string }; // Multilingual support
  slug: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
  }
}

export class Article {
  id: string;
  title: { [key: string]: string }; // Multilingual support
  content: { [key: string]: string }; // Multilingual support
  summary: { [key: string]: string }; // Multilingual support
  author: User;
  category: Category;
  tags: string[];
  image?: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.summary = data.summary;
    this.author = data.author;
    this.category = data.category;
    this.tags = data.tags || [];
    this.image = data.image;
    this.likes = data.likes || 0;
    this.views = data.views || 0;
    this.comments = data.comments || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

export class Comment {
  id: string;
  content: string;
  user: User;
  article: Article;
  likes: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.content = data.content;
    this.user = data.user;
    this.article = data.article;
    this.likes = data.likes || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
import { User } from './user.model';
import { Category } from './category.model';

export class Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: User | null;
  category: Category | null;
  featuredImage?: string;
  tags: string[];
  viewCount: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Article> = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.slug = data.slug || '';
    this.content = data.content || '';
    this.excerpt = data.excerpt || '';
    this.author = data.author || null;
    this.category = data.category || null;
    this.featuredImage = data.featuredImage;
    this.tags = data.tags || [];
    this.viewCount = data.viewCount || 0;
    this.isPublished = data.isPublished ?? false;
    this.publishedAt = data.publishedAt;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
