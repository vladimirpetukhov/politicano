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
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h1>Welcome to News Blog</h1>
      <div class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-body">
              <h2 class="card-title">Latest News</h2>
              <p class="card-text">Here you will find the latest political news and analysis.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Categories</h3>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Politics</li>
                <li class="list-group-item">Economics</li>
                <li class="list-group-item">International Relations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {
}
