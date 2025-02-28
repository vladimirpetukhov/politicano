
export enum UserRole {
  User = 'User',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin'
}

export class User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  bio?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<User> = {}) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password;
    this.role = data.role || UserRole.User;
    this.bio = data.bio;
    this.avatar = data.avatar;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  get isAdmin(): boolean {
    return this.role === UserRole.Admin || this.role === UserRole.SuperAdmin;
  }

  get isSuperAdmin(): boolean {
    return this.role === UserRole.SuperAdmin;
  }
}
