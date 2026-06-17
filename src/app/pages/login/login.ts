import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private toastr = inject(ToastrService);
  constructor(private router: Router) { }
  login() {
    // if (this.authService.login(this.username, this.password)) {
    // this.router.navigate(['/dashboard']);
    this.toastr.info('Welcome!', 'Login Successful');
    // } else {
    //   this.errorMsg = 'Invalid credentials';
    // }
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }
}
