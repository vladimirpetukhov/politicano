
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { User, UserRole } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isSuperAdmin = false;
  selectedUser: User | null = null;
  userForm: Partial<User> = {};
  formMode: 'add' | 'edit' = 'add';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    
    this.authService.currentUser$.subscribe(user => {
      if (!user || user.role !== UserRole.SuperAdmin) {
        this.router.navigate(['/admin']);
        return;
      }
      
      this.isSuperAdmin = true;
    });
  }
  
  loadUsers(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }
  
  addUser(): void {
    this.formMode = 'add';
    this.userForm = {
      role: UserRole.User
    };
    this.selectedUser = null;
  }
  
  editUser(user: User): void {
    this.formMode = 'edit';
    this.selectedUser = user;
    this.userForm = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio
    };
  }
  
  saveUser(): void {
    if (this.formMode === 'add') {
      this.authService.addUser(this.userForm as User).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    } else {
      this.authService.updateUser(this.userForm as User).subscribe(() => {
        this.loadUsers();
        this.resetForm();
      });
    }
  }
  
  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.authService.deleteUser(user.id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
  
  toggleUserStatus(user: User): void {
    const updatedUser = { ...user, isActive: !user.isActive };
    this.authService.updateUser(updatedUser).subscribe(() => {
      this.loadUsers();
    });
  }
  
  resetForm(): void {
    this.userForm = {};
    this.selectedUser = null;
  }
  
  getRoleBadgeClass(role: UserRole): string {
    switch(role) {
      case UserRole.SuperAdmin:
        return 'bg-danger';
      case UserRole.Admin:
        return 'bg-warning';
      case UserRole.User:
      default:
        return 'bg-info';
    }
  }
}
