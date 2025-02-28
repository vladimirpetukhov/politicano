
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ArticleService } from '../../services/article.service';
import { LanguageService, SupportedLanguage } from '../../services/language.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  recentArticles: Article[] = [];
  mostViewedArticles: Article[] = [];
  mostLikedArticles: Article[] = [];
  mostCommentedArticles: Article[] = [];
  currentLanguage: SupportedLanguage = 'en';
  
  private subscriptions: Subscription[] = [];
  
  constructor(
    private articleService: ArticleService,
    private languageService: LanguageService
  ) {}
  
  ngOnInit(): void {
    this.subscriptions.push(
      this.languageService.currentLanguage$.subscribe(lang => {
        this.currentLanguage = lang;
      }),
      
      this.articleService.getRecentArticles(8).subscribe(articles => {
        this.recentArticles = articles;
      }),
      
      this.articleService.getMostViewedArticles(4).subscribe(articles => {
        this.mostViewedArticles = articles;
      }),
      
      this.articleService.getMostLikedArticles(4).subscribe(articles => {
        this.mostLikedArticles = articles;
      }),
      
      this.articleService.getMostCommentedArticles(4).subscribe(articles => {
        this.mostCommentedArticles = articles;
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
