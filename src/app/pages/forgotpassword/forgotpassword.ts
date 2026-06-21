import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForgotpasswordService } from '../../core/services/forgotpassword.service';
import { CommonService } from '../../shared/common.service';

@Component({
  selector: 'app-forgotpassword',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgotpassword.html',
  styleUrl: './forgotpassword.scss',
})
export class ForgotpasswordComponent implements OnInit, AfterViewInit {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  @ViewChildren('otpBox') otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  private forgotpasswordService = inject(ForgotpasswordService);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  forgotForm!: FormGroup;
  otpForm!: FormGroup;
  sectionEnable: string = "forgotPassword";
  userEmail: string = "";
  code!: string;
  passwordError: string = '';
  confirmPasswordError: string = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(private router: Router, private formbuilder: FormBuilder) { }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.forgotForm = this.formbuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/)
      ])
    });
    this.otpform();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 200);
  }

  // ─── Forgot Password ──────────────────────────────────────
  sendResetLink(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.forgotpasswordService.confirmUserEmail(this.forgotForm.value)
      .subscribe({
        next: (res) => {
          if (res.success) {
            setTimeout(() => {
              this.SendVerificationCode();
            }, 500);
          }
          else {
            this.toastr.error(res.responseMessage);
          }
        }
      });
  }

  SendVerificationCode() {

    const payload = {
      email: !this.commonService.isNullOrEmpty(this.forgotForm.get('email')?.value) ? this.forgotForm.get('email')?.value : this.userEmail
    }

    this.forgotpasswordService.sendVerificationCode(payload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res?.responseMessage);
            if (!this.commonService.isNullOrEmpty(this.forgotForm.get('email')?.value))
              this.userEmail = this.forgotForm.get('email')?.value;
            this.forgotForm.reset();
            this.sectionEnable = "verifyOtp";
            setTimeout(() => {
              this.otpBoxes.toArray()[0].nativeElement.focus();
            }, 200);
          } else {
            this.toastr.error(res.responseMessage);
          }
        }
      });
  }

  // ─── Verify Otp ──────────────────────────────────────

  otpform() {
    this.otpForm = this.formbuilder.group({
      otp: this.formbuilder.array(
        Array(6).fill('').map(() => new FormControl(''))
      )
    });
  }

  get otpArray(): FormArray {
    return this.otpForm.get('otp') as FormArray;
  }

  getOtpValue(): string {
    return this.otpArray.value.join('');
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;

    this.otpArray.at(index).setValue(value);

    if (value && index < this.otpBoxes.length - 1) {
      this.otpBoxes.toArray()[index + 1].nativeElement.focus();
    }

    const allFilled = this.otpArray.controls.every(
      control => control.value && control.value.toString().length === 1
    );

    if (allFilled) {
      this.verifyOtp();
    }
  }
  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Move back on backspace
    if (
      event.key === 'Backspace' &&
      !input.value &&
      index > 0
    ) {
      this.otpBoxes.toArray()[index - 1].nativeElement.focus();
    }
  }

  verifyOtp(): void {
    const otp = this.getOtpValue();
    const payload = {
      email: this.userEmail,
      otpCode: otp
    };

    this.forgotpasswordService.verifyOtpCode(payload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res?.responseMessage);
            this.code = res?.data;
            this.otpForm.reset();
            this.sectionEnable = "resetPassword";

            setTimeout(() => {
              if (this.password?.nativeElement) {
                this.password.nativeElement.focus();
              }
            }, 200);
          } else {
            this.toastr.error(res.responseMessage);
          }
        },
        error: (err) => {
          this.toastr.error('Something went wrong. Please try again.');
        }
      });
  }

  navigateToForgotPassword(): void {
    this.sectionEnable = "forgotPassword";
  }

  // ─── Reset Password ──────────────────────────────────────

  resetPassword(password: string, confirmPassword: string): void {

    if (!this.validatePassword(password, confirmPassword)) return;

    const payload = {
      email: this.userEmail,
      token: this.code,
      password: password,
      confirmPassword: confirmPassword
    }

    this.forgotpasswordService.resetPassword(payload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res?.responseMessage);
            this.router.navigate(['/login']);
          } else {
            this.toastr.error(res.responseMessage);
          }
        }
      });
  }

  validatePassword(password: string, confirmPassword: string): boolean {
    // Clear previous errors
    this.clearErrors();

    // Password required
    if (!password?.trim()) {
      this.passwordError = 'Password is required.';
      return false;
    }

    // Confirm password required
    if (!confirmPassword?.trim()) {
      this.confirmPasswordError =
        'Confirm password is required.';
      return false;
    }

    // Minimum 8 characters
    if (password.length < 8) {
      this.passwordError =
        'Password must be at least 8 characters long.';
      return false;
    }

    // Must contain letter, number and special character
    const strongPasswordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=\[\]{};:'",.<>\/\\|`~]).+$/;

    if (!strongPasswordRegex.test(password)) {
      this.passwordError =
        'Password must contain letters, numbers and special characters.';
      return false;
    }

    // Password match check
    if (password !== confirmPassword) {
      this.confirmPasswordError =
        'Passwords do not match.';
      return false;
    }

    return true;
  }

  clearErrors(): void {
    this.passwordError = '';
    this.confirmPasswordError = '';
  }
}
