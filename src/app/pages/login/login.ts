import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.Service';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  username = 'hammad3940@gmail.com';
  password = 'Hammad123@';

  showPassword = false;

  constructor() { }

  login() {
    this.authService.login({ email: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          if (res.success) {
            //this.toastr.success('Login Successful');
            this.router.navigate(['/dashboard']);
          } else {
            this.toastr.error(res.message, 'Login Failed');
          }
        }
      });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }
}
