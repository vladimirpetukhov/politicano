import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  {
    path: 'articles',
    children: [
      { path: 'category/:id', loadComponent: () => import('./pages/articles/category-articles/category-articles.component').then(m => m.CategoryArticlesComponent) },
      { path: 'author/:id', loadComponent: () => import('./pages/articles/author-articles/author-articles.component').then(m => m.AuthorArticlesComponent) },
      { path: ':id', loadComponent: () => import('./pages/articles/article-detail/article-detail.component').then(m => m.ArticleDetailComponent) }
    ]
  },
  {
    path: 'authors',
    children: [
      { path: ':id', loadComponent: () => import('./pages/authors/author-profile/author-profile.component').then(m => m.AuthorProfileComponent) }
    ]
  },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) }
    ]
  },
  { path: '**', redirectTo: '/home' }
];