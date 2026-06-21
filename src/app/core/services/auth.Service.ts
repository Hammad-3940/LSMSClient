import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private router = inject(Router);
  private api = inject(ApiService);

  constructor() { }

  login(request: any) {
    return this.api.post<any>('Account/AuthenticateUser', request);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }
}
