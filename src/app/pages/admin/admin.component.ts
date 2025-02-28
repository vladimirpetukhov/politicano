
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isSuperAdmin = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (!user || (user.role !== UserRole.SuperAdmin && user.role !== UserRole.Admin)) {
        this.router.navigate(['/login']);
        return;
      }
      
      this.isSuperAdmin = user.role === UserRole.SuperAdmin;
    });
  }
}
