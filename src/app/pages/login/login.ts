import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.Service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  username = '';
  password = '';
  isLoading = false;
  constructor() { }
  // login() {
  //   // if (this.authService.login(this.username, this.password)) {
  //   // this.router.navigate(['/dashboard']);
  //   this.toastr.info('Welcome!', 'Login Successful');
  //   // } else {
  //   //   this.errorMsg = 'Invalid credentials';
  //   // }
  // }

  login() {
    this.isLoading = true;

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res.message, 'Login Successful');
            this.router.navigate(['/dashboard']);
          } else {
            this.toastr.error(res.message, 'Login Failed');
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.toastr.error(err.error?.message || 'Server error', 'Error');
          this.isLoading = false;
        }
      });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }
}
