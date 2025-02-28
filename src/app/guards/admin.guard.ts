
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    
    if (user && (user.role === UserRole.Admin || user.role === UserRole.SuperAdmin)) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
