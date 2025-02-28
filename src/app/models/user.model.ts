
export enum UserRole {
  SuperAdmin = 'superAdmin',
  Admin = 'admin',
  User = 'user'
}

export class User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  bio?: string;
  profilePicture?: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || UserRole.User;
    this.bio = data.bio;
    this.profilePicture = data.profilePicture;
    this.createdAt = data.createdAt || new Date();
  }
}
