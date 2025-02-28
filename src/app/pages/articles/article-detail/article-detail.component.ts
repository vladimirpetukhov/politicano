
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Article Details</h2>
      <p>This is the article detail component.</p>
    </div>
  `,
  styles: []
})
export class ArticleDetailComponent {
}
