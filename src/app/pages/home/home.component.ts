import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../../models/article.model';
import { ArticleService } from '../../services/article.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  latestArticles: Article[] = [];
  mostReadArticles: Article[] = [];
  mostDiscussedArticles: Article[] = [];
  mostLikedArticles: Article[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadLatestArticles();
    this.loadMostReadArticles();
    this.loadMostDiscussedArticles();
    this.loadMostLikedArticles();
  }

  loadLatestArticles(): void {
    this.articleService.getLatestArticles(8).subscribe(
      articles => this.latestArticles = articles
    );
  }

  loadMostReadArticles(): void {
    this.articleService.getMostReadArticles().subscribe(
      articles => this.mostReadArticles = articles
    );
  }

  loadMostDiscussedArticles(): void {
    this.articleService.getMostDiscussedArticles().subscribe(
      articles => this.mostDiscussedArticles = articles
    );
  }

  loadMostLikedArticles(): void {
    this.articleService.getMostLikedArticles().subscribe(
      articles => this.mostLikedArticles = articles
    );
  }
}