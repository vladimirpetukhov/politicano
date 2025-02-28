
import { User } from './user.model';
import { Article } from './article.model';

export class Comment {
  id: string;
  content: string;
  author: User | null;
  article: Article | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Comment> = {}) {
    this.id = data.id || '';
    this.content = data.content || '';
    this.author = data.author || null;
    this.article = data.article || null;
    this.isApproved = data.isApproved ?? false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}
