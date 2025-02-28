
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Admin components
import { AdminComponent } from './pages/admin/admin.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { CommentsComponent } from './pages/admin/comments/comments.component';

// Guards
import { AdminGuard } from './guards/admin.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

// Services
import { AuthService } from './services/auth.service';
import { CategoryService } from './services/category.service';
import { CommentService } from './services/comment.service';

@NgModule({
  declarations: [
    AppComponent,
    // Admin components
    AdminComponent,
    UsersComponent,
    CategoriesComponent,
    CommentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    // Services
    AuthService,
    CategoryService,
    CommentService,
    // Guards
    AdminGuard,
    SuperAdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
