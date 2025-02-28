
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Mock data until we have a real backend
  private mockUsers: User[] = [
    new User({ 
      id: '1', 
      username: 'superadmin', 
      email: 'superadmin@blog.com', 
      password: 'password', 
      role: UserRole.SuperAdmin,
      bio: 'Blog creator and super administrator' 
    }),
    new User({ 
      id: '2', 
      username: 'admin', 
      email: 'admin@blog.com', 
      password: 'password', 
      role: UserRole.Admin,
      bio: 'Blog author and administrator' 
    }),
    new User({ 
      id: '3', 
      username: 'user', 
      email: 'user@example.com', 
      password: 'password', 
      role: UserRole.User
    })
  ];

  constructor() {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(new User(JSON.parse(storedUser)));
    }
  }

  login(email: string, password: string): Observable<User | null> {
    // Find user by email and password
    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      // Store user details in local storage
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    }
    return of(null);
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(user: User): Observable<User> {
    // In a real app, this would call an API
    user.id = (this.mockUsers.length + 1).toString();
    user.role = UserRole.User;
    user.createdAt = new Date();
    
    this.mockUsers.push(user);
    return of(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    
    if (role === UserRole.SuperAdmin) {
      return user.role === UserRole.SuperAdmin;
    } else if (role === UserRole.Admin) {
      return user.role === UserRole.SuperAdmin || user.role === UserRole.Admin;
    }
    
    return true; // All users have User role by default
  }
}
