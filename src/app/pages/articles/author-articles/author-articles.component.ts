
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-author-articles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Author Articles</h2>
      <p>This is the author articles component.</p>
    </div>
  `,
  styles: []
})
export class AuthorArticlesComponent {
}
