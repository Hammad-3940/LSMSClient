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

  // ─── Forgot Password ──────────────────────────────────────
  sendResetLink(): void {
    this.sectionEnable = "verifyOtp";
  }

  // ─── Verify Otp ──────────────────────────────────────
  verifyOtp(): void {
    this.sectionEnable = "resetPassword";
  }

  resendOtp(): void {
    // resend otp api call
  }

  navigateToForgotPassword(): void {
    this.sectionEnable = "forgotPassword";
  }

  // ─── Reset Password ──────────────────────────────────────
  resetPassword(): void {
    // Call reset password API

    // Success
    this.router.navigate(['/login']);
  }
}
