import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  constructor(private router: Router) { }
  login() {
    // if (this.authService.login(this.username, this.password)) {
    this.router.navigate(['/dashboard']);
    // } else {
    //   this.errorMsg = 'Invalid credentials';
    // }
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }
}
