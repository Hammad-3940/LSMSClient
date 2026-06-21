import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginRequest } from '../models/auth.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private router = inject(Router);
  private api = inject(ApiService);

  constructor() { }

  login(payload: LoginRequest) {
    return this.api.post<any>('Account/AuthenticateUser', payload).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem(this.TOKEN_KEY, res.data.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
