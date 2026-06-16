import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    // Replace with real API call
    if (username === 'admin' && password === '1234') {
      localStorage.setItem(this.TOKEN_KEY, 'dummy-token');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return true;
  }
}
