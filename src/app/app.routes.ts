import { Routes } from '@angular/router';

export const routes: Routes = [];
import { Routes } from '@angular/router';
import { UserRole } from './models/user.model';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'articles',
    loadComponent: () => import('./components/articles/article-list/article-list.component').then(m => m.ArticleListComponent)
  },
  {
    path: 'articles/:id',
    loadComponent: () => import('./components/articles/article-detail/article-detail.component').then(m => m.ArticleDetailComponent)
  },
  {
    path: 'categories/:id',
    loadComponent: () => import('./components/categories/category-articles/category-articles.component').then(m => m.CategoryArticlesComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./components/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'articles',
        pathMatch: 'full'
      },
      {
        path: 'articles',
        loadComponent: () => import('./components/admin/article-management/article-management.component').then(m => m.ArticleManagementComponent)
      },
      {
        path: 'articles/create',
        loadComponent: () => import('./components/admin/article-editor/article-editor.component').then(m => m.ArticleEditorComponent)
      },
      {
        path: 'articles/edit/:id',
        loadComponent: () => import('./components/admin/article-editor/article-editor.component').then(m => m.ArticleEditorComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./components/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/user/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'user/profile',
    loadComponent: () => import('./components/user/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
