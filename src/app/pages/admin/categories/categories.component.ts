
import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  categoryForm: Partial<Category> = {};
  formMode: 'add' | 'edit' = 'add';
  
  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
  
  addCategory(): void {
    this.formMode = 'add';
    this.categoryForm = {};
    this.selectedCategory = null;
  }
  
  editCategory(category: Category): void {
    this.formMode = 'edit';
    this.selectedCategory = category;
    this.categoryForm = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description
    };
  }
  
  saveCategory(): void {
    if (!this.categoryForm.name) return;
    
    // Generate slug if not provided
    if (!this.categoryForm.slug) {
      this.categoryForm.slug = this.categoryForm.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    if (this.formMode === 'add') {
      this.categoryService.addCategory(this.categoryForm as Category).subscribe(() => {
        this.loadCategories();
        this.resetForm();
      });
    } else {
      this.categoryService.updateCategory(this.categoryForm as Category).subscribe(() => {
        this.loadCategories();
        this.resetForm();
      });
    }
  }
  
  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete category: ${category.name}?`)) {
      this.categoryService.deleteCategory(category.id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
  
  resetForm(): void {
    this.categoryForm = {};
    this.selectedCategory = null;
  }
}
