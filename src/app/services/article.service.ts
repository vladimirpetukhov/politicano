
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Article, Category, Comment } from '../models/article.model';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  // Mock data until we have a real backend
  private mockCategories: Category[] = [
    new Category({ 
      id: '1', 
      name: { 
        en: 'Politics', 
        bg: 'Политика', 
        ru: 'Политика', 
        es: 'Política' 
      }, 
      slug: 'politics' 
    }),
    new Category({ 
      id: '2', 
      name: { 
        en: 'Technology', 
        bg: 'Технологии', 
        ru: 'Технологии', 
        es: 'Tecnología' 
      }, 
      slug: 'technology' 
    }),
    new Category({ 
      id: '3', 
      name: { 
        en: 'Sports', 
        bg: 'Спорт', 
        ru: 'Спорт', 
        es: 'Deportes' 
      }, 
      slug: 'sports' 
    }),
    new Category({ 
      id: '4', 
      name: { 
        en: 'Culture', 
        bg: 'Култура', 
        ru: 'Культура', 
        es: 'Cultura' 
      }, 
      slug: 'culture' 
    })
  ];

  private mockUsers: User[] = [
    new User({ 
      id: '1', 
      username: 'superadmin', 
      email: 'superadmin@blog.com', 
      password: 'password', 
      role: UserRole.SuperAdmin
    }),
    new User({ 
      id: '2', 
      username: 'admin', 
      email: 'admin@blog.com', 
      password: 'password', 
      role: UserRole.Admin
    })
  ];

  private mockArticles: Article[] = [];

  constructor() {
    // Generate some mock articles
    for (let i = 1; i <= 20; i++) {
      const category = this.mockCategories[Math.floor(Math.random() * this.mockCategories.length)];
      const author = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      this.mockArticles.push(new Article({
        id: i.toString(),
        title: {
          en: `Article ${i} Title in English`,
          bg: `Заглавие на статия ${i} на български`,
          ru: `Заголовок статьи ${i} на русском`,
          es: `Título del artículo ${i} en español`
        },
        summary: {
          en: `This is a summary of article ${i} in English.`,
          bg: `Това е резюме на статия ${i} на български.`,
          ru: `Это краткое содержание статьи ${i} на русском.`,
          es: `Este es un resumen del artículo ${i} en español.`
        },
        content: {
          en: `This is the content of article ${i} in English. It contains multiple paragraphs with detailed information.`,
          bg: `Това е съдържанието на статия ${i} на български. Съдържа няколко параграфа с подробна информация.`,
          ru: `Это содержание статьи ${i} на русском. Оно содержит несколько абзацев с подробной информацией.`,
          es: `Este es el contenido del artículo ${i} en español. Contiene varios párrafos con información detallada.`
        },
        author: author,
        category: category,
        tags: ['tag1', 'tag2'],
        image: `https://source.unsplash.com/random/800x600?sig=${i}`,
        likes: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 20),
        createdAt: date,
        updatedAt: date
      }));
    }
  }

  getAllArticles(): Observable<Article[]> {
    return of(this.mockArticles);
  }

  getRecentArticles(count: number = 8): Observable<Article[]> {
    const sorted = [...this.mockArticles].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
    return of(sorted.slice(0, count));
  }

  getMostViewedArticles(count: number = 4): Observable<Article[]> {
    const sorted = [...this.mockArticles].sort((a, b) => b.views - a.views);
    return of(sorted.slice(0, count));
  }

  getMostLikedArticles(count: number = 4): Observable<Article[]> {
    const sorted = [...this.mockArticles].sort((a, b) => b.likes - a.views);
    return of(sorted.slice(0, count));
  }

  getMostCommentedArticles(count: number = 4): Observable<Article[]> {
    const sorted = [...this.mockArticles].sort((a, b) => b.comments - a.comments);
    return of(sorted.slice(0, count));
  }

  getArticlesByCategory(categoryId: string): Observable<Article[]> {
    return of(this.mockArticles.filter(article => article.category.id === categoryId));
  }

  getArticlesByAuthor(authorId: string): Observable<Article[]> {
    return of(this.mockArticles.filter(article => article.author.id === authorId));
  }

  getArticleById(id: string): Observable<Article | undefined> {
    return of(this.mockArticles.find(article => article.id === id));
  }

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories);
  }

  searchArticles(query: string, categoryId?: string, authorId?: string, startDate?: Date, endDate?: Date): Observable<Article[]> {
    let filtered = [...this.mockArticles];
    
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(article => 
        Object.values(article.title).some(title => title.toLowerCase().includes(lowercaseQuery)) ||
        Object.values(article.content).some(content => content.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    if (categoryId) {
      filtered = filtered.filter(article => article.category.id === categoryId);
    }
    
    if (authorId) {
      filtered = filtered.filter(article => article.author.id === authorId);
    }
    
    if (startDate) {
      filtered = filtered.filter(article => article.createdAt >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(article => article.createdAt <= endDate);
    }
    
    return of(filtered);
  }
}
