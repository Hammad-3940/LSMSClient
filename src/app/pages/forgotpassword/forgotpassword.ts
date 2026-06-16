import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  imports: [CommonModule],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.scss',
})
export class ForgotpasswordComponent {

  sectionEnable: string = "forgotPassword";

  constructor(private router: Router) { }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  sendResetLink(): void {
    this.sectionEnable = "verifyOtp";
  }

  verifyOtp(): void {
    // verify otp api call
  }

  resendOtp(): void {
    // resend otp api call
  }

  navigateToForgotPassword(): void {
    this.sectionEnable = "forgotPassword";
  }
}
