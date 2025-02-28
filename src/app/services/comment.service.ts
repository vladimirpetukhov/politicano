
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comment } from '../models/comment.model';
import { User, UserRole } from '../models/user.model';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // Mock users and articles for our mock comments
  private mockUsers = [
    new User({ id: '1', username: 'john_doe', role: UserRole.User }),
    new User({ id: '2', username: 'jane_smith', role: UserRole.User }),
    new User({ id: '3', username: 'admin', role: UserRole.Admin })
  ];

  private mockArticles = [
    new Article({ id: '1', title: 'First Article Title Here', slug: 'first-article' }),
    new Article({ id: '2', title: 'Second Article About Politics', slug: 'second-article' })
  ];

  // Mock comments data until we have a real backend
  private comments: Comment[] = [
    new Comment({
      id: '1',
      content: 'This is a great article! Very informative and well-written.',
      author: this.mockUsers[0],
      article: this.mockArticles[0],
      isApproved: true,
      createdAt: new Date('2023-03-10T14:22:00')
    }),
    new Comment({
      id: '2',
      content: 'I disagree with some points in this article. Here\'s why...',
      author: this.mockUsers[1],
      article: this.mockArticles[0],
      isApproved: true,
      createdAt: new Date('2023-03-11T09:15:00')
    }),
    new Comment({
      id: '3',
      content: 'This contains some inappropriate language that should be moderated.',
      author: this.mockUsers[1],
      article: this.mockArticles[1],
      isApproved: false,
      createdAt: new Date('2023-03-12T17:45:00')
    })
  ];

  constructor() { }

  getAllComments(): Observable<Comment[]> {
    return of([...this.comments]);
  }

  getCommentsByArticle(articleId: string): Observable<Comment[]> {
    const filteredComments = this.comments
      .filter(c => c.article?.id === articleId && c.isApproved);
    return of(filteredComments);
  }

  addComment(comment: Comment): Observable<Comment> {
    const newComment = new Comment({
      ...comment,
      id: Date.now().toString(),
      isApproved: false, // New comments require approval by default
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.comments.push(newComment);
    return of(newComment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    const index = this.comments.findIndex(c => c.id === comment.id);
    if (index !== -1) {
      const updatedComment = {
        ...this.comments[index],
        ...comment,
        updatedAt: new Date()
      };
      this.comments[index] = updatedComment;
      return of(updatedComment);
    }
    return of(comment);
  }

  deleteComment(id: string): Observable<boolean> {
    const initialLength = this.comments.length;
    this.comments = this.comments.filter(c => c.id !== id);
    return of(initialLength !== this.comments.length);
  }
}
