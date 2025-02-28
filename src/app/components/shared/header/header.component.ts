
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LanguageService, SupportedLanguage } from '../../../services/language.service';
import { ArticleService } from '../../../services/article.service';
import { Category } from '../../../models/article.model';
import { User, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  currentUser: User | null = null;
  currentLanguage: SupportedLanguage = 'en';
  searchQuery: string = '';
  
  private subscriptions: Subscription[] = [];
  
  constructor(
    private authService: AuthService,
    private languageService: LanguageService,
    private articleService: ArticleService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      }),
      
      this.languageService.currentLanguage$.subscribe(lang => {
        this.currentLanguage = lang;
      }),
      
      this.articleService.getCategories().subscribe(categories => {
        this.categories = categories;
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
  switchLanguage(lang: SupportedLanguage): void {
    this.languageService.setLanguage(lang);
  }
  
  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery }});
    }
  }
  
  hasRole(role: UserRole): boolean {
    return this.authService.hasRole(role);
  }
}
