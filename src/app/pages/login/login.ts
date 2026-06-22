import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.Service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loginForm!: FormGroup;

  showPassword = false;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit() {
    this.loginFormGroup();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 200);
  }

  loginFormGroup() {
    this.loginForm = this.formbuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/)]),
      password: new FormControl('', [Validators.required]),
      rememberMe: [false]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm?.value)
      .subscribe({
        next: (res) => {
          if (res.success) {
            const formValue = this.loginForm?.value;
            if (res?.data?.days > 30) {
              this.router.navigate(['/forgotpassword'], {
                state: { userEmail: formValue.email, sectionEnable: 'expirePassword' }
              });
              return
            }

            if (formValue?.rememberMe) {
              localStorage.setItem(`pwd_${formValue?.email}`, formValue?.password);
            }
            localStorage.setItem('token', res?.data?.jwtToken);
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);
          } else {
            this.toastr.error(res?.responseMessage);
          }
        }
      });
  }

  checkPasswordByEmail() {
    const email = this.loginForm.get('email')?.value;

    if (!email) return;

    const savedPassword = localStorage.getItem(`pwd_${email}`);

    if (savedPassword) {
      this.loginForm.patchValue({
        password: savedPassword,
        rememberMe: true
      }, { emitEvent: false });
    } else {
      this.loginForm.patchValue({
        password: '',
        rememberMe: false
      }, { emitEvent: false });
    }
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }
}
