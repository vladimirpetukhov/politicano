
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-articles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Category Articles</h2>
      <p>This is the category articles component.</p>
    </div>
  `,
  styles: []
})
export class CategoryArticlesComponent {
}
