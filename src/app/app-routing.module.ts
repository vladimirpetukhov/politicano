
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guards
import { AdminGuard } from './guards/admin.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

// Admin components
import { AdminComponent } from './pages/admin/admin.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { CommentsComponent } from './pages/admin/comments/comments.component';

const routes: Routes = [
  // Admin routes
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'users', component: UsersComponent, canActivate: [SuperAdminGuard] },
      { path: 'categories', component: CategoriesComponent },
      { path: 'comments', component: CommentsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
