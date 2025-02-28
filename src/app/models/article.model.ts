
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
