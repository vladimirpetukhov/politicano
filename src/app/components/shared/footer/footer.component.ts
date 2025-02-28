
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService, SupportedLanguage } from '../../../services/language.service';
import { ArticleService } from '../../../services/article.service';
import { Category } from '../../../models/article.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentLanguage: SupportedLanguage = 'en';
  categories: Category[] = [];
  currentYear: number = new Date().getFullYear();
  
  constructor(
    private languageService: LanguageService,
    private articleService: ArticleService
  ) {}
  
  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    
    this.articleService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
}
