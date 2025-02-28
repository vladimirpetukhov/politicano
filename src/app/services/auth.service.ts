
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Mock data until we have a real backend
  private users: User[] = [
    new User({ 
      id: '1', 
      username: 'superadmin', 
      email: 'superadmin@politicano.com', 
      password: 'password', 
      role: UserRole.SuperAdmin,
      bio: 'Blog creator and super administrator',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }),
    new User({ 
      id: '2', 
      username: 'admin', 
      email: 'admin@politicano.com', 
      password: 'password', 
      role: UserRole.Admin,
      bio: 'Blog author and administrator',
      isActive: true,
      createdAt: new Date('2023-01-05'),
      updatedAt: new Date('2023-01-05')
    }),
    new User({ 
      id: '3', 
      username: 'user', 
      email: 'user@example.com', 
      password: 'password', 
      role: UserRole.User,
      isActive: true,
      createdAt: new Date('2023-01-10'),
      updatedAt: new Date('2023-01-10')
    })
  ];

  constructor() {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(new User(JSON.parse(storedUser)));
    }
  }

  login(email: string, password: string): Observable<User> {
    const user = this.users.find(u => 
      u.email === email && 
      u.password === password &&
      u.isActive
    );
    
    if (user) {
      // Clone user and remove password
      const userToReturn = new User({...user});
      delete userToReturn.password;
      
      // Update last login
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index].lastLogin = new Date();
      }
      
      // Store in local storage
      localStorage.setItem('currentUser', JSON.stringify(userToReturn));
      
      // Update the subject
      this.currentUserSubject.next(userToReturn);
      
      return of(userToReturn);
    }
    
    return throwError(() => new Error('Invalid email or password'));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(user: Partial<User>): Observable<User> {
    // Check if email already exists
    if (this.users.some(u => u.email === user.email)) {
      return throwError(() => new Error('Email already in use'));
    }
    
    // Check if username already exists
    if (this.users.some(u => u.username === user.username)) {
      return throwError(() => new Error('Username already in use'));
    }
    
    const newUser = new User({
      ...user,
      id: Date.now().toString(),
      role: UserRole.User, // Default role for new registrations
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.users.push(newUser);
    
    // Return a copy without password
    const userToReturn = new User({...newUser});
    delete userToReturn.password;
    
    return of(userToReturn);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // Methods for user management (admin only)
  getAllUsers(): Observable<User[]> {
    // Return all users without passwords
    return of(this.users.map(user => {
      const userCopy = new User({...user});
      delete userCopy.password;
      return userCopy;
    }));
  }

  getUserById(id: string): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      const userCopy = new User({...user});
      delete userCopy.password;
      return of(userCopy);
    }
    return of(undefined);
  }

  addUser(user: User): Observable<User> {
    // Check if email already exists
    if (this.users.some(u => u.email === user.email)) {
      return throwError(() => new Error('Email already in use'));
    }
    
    // Check if username already exists
    if (this.users.some(u => u.username === user.username)) {
      return throwError(() => new Error('Username already in use'));
    }
    
    const newUser = new User({
      ...user,
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.users.push(newUser);
    
    // Return a copy without password
    const userToReturn = new User({...newUser});
    delete userToReturn.password;
    
    return of(userToReturn);
  }

  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }
    
    // Check email uniqueness if it's changed
    if (user.email !== this.users[index].email && 
        this.users.some(u => u.email === user.email)) {
      return throwError(() => new Error('Email already in use'));
    }
    
    // Check username uniqueness if it's changed
    if (user.username !== this.users[index].username && 
        this.users.some(u => u.username === user.username)) {
      return throwError(() => new Error('Username already in use'));
    }
    
    // If no password provided, keep the existing one
    if (!user.password) {
      user.password = this.users[index].password;
    }
    
    const updatedUser = new User({
      ...this.users[index],
      ...user,
      updatedAt: new Date()
    });
    
    this.users[index] = updatedUser;
    
    // Return a copy without password
    const userToReturn = new User({...updatedUser});
    delete userToReturn.password;
    
    // If this is the current user, update currentUserSubject and localStorage
    if (this.currentUserSubject.value?.id === user.id) {
      this.currentUserSubject.next(userToReturn);
      localStorage.setItem('currentUser', JSON.stringify(userToReturn));
    }
    
    return of(userToReturn);
  }

  deleteUser(id: string): Observable<boolean> {
    // Don't allow deletion of the last SuperAdmin
    const superAdmins = this.users.filter(u => u.role === UserRole.SuperAdmin);
    const userToDelete = this.users.find(u => u.id === id);
    
    if (superAdmins.length === 1 && userToDelete?.role === UserRole.SuperAdmin) {
      return throwError(() => new Error('Cannot delete the last Super Admin'));
    }
    
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    
    // If deleted user is the current user, log out
    if (this.currentUserSubject.value?.id === id) {
      this.logout();
    }
    
    return of(initialLength !== this.users.length);
  }
}
