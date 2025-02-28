
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // Mock data until we have a real backend
  private categories: Category[] = [
    new Category({
      id: '1',
      name: 'Politics',
      slug: 'politics',
      description: 'Latest political news and analysis',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15')
    }),
    new Category({
      id: '2',
      name: 'Economy',
      slug: 'economy',
      description: 'Economic news, trends, and insights',
      createdAt: new Date('2023-01-20'),
      updatedAt: new Date('2023-01-20')
    }),
    new Category({
      id: '3',
      name: 'Technology',
      slug: 'technology',
      description: 'Technology news and innovations',
      createdAt: new Date('2023-02-05'),
      updatedAt: new Date('2023-02-05')
    })
  ];

  constructor() { }

  getCategories(): Observable<Category[]> {
    return of([...this.categories]);
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    const category = this.categories.find(c => c.id === id);
    return of(category);
  }

  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    const category = this.categories.find(c => c.slug === slug);
    return of(category);
  }

  addCategory(category: Category): Observable<Category> {
    const newCategory = new Category({
      ...category,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    this.categories.push(newCategory);
    return of(newCategory);
  }

  updateCategory(category: Category): Observable<Category> {
    const index = this.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      const updatedCategory = {
        ...this.categories[index],
        ...category,
        updatedAt: new Date()
      };
      this.categories[index] = updatedCategory;
      return of(updatedCategory);
    }
    return of(category);
  }

  deleteCategory(id: string): Observable<boolean> {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter(c => c.id !== id);
    return of(initialLength !== this.categories.length);
  }
}
