import { Injectable } from '@angular/core';

export interface PasswordValidationResult {
  isValid: boolean;
  passwordError: string;
  confirmPasswordError: string;
  oldPasswordError: string;
}

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  isNullOrEmpty(value: any): boolean {
    // null or undefined
    if (value === null || value === undefined) {
      return true;
    }

    // string
    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    // array
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    // number (only treat NaN as "empty")
    if (typeof value === 'number') {
      return isNaN(value as number);
    }

    // object (optional: treat empty object as empty)
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }

    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  validatePassword(password: string, confirmPassword: string, oldPassword?: string): PasswordValidationResult {

    const result: PasswordValidationResult = {
      isValid: false,
      passwordError: '',
      confirmPasswordError: '',
      oldPasswordError: ''
    };

    if (oldPassword !== undefined && !oldPassword?.trim()) {
      result.oldPasswordError = 'Old Password is required.';
      return result;
    }

    if (!password?.trim()) {
      result.passwordError = 'Password is required.';
      return result;
    }

    if (!confirmPassword?.trim()) {
      result.confirmPasswordError = 'Confirm password is required.';
      return result;
    }

    if (password.length < 8) {
      result.passwordError =
        'Password must be at least 8 characters long.';
      return result;
    }

    const missingRules: string[] = [];

    if (!/[A-Z]/.test(password)) {
      missingRules.push('one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      missingRules.push('one lowercase letter');
    }

    if (!/\d/.test(password)) {
      missingRules.push('one number');
    }

    if (!/[@$!%*#?&^()_\-+=\[\]{};:\'",.<>\/\\|`~]/.test(password)) {
      missingRules.push('one special character');
    }

    if (missingRules.length > 0) {
      result.passwordError =
        `Password must contain at least ${missingRules.join(', ')}.`;
      return result;
    }

    if (password !== confirmPassword) {
      result.confirmPasswordError = 'Passwords do not match.';
      return result;
    }

    result.isValid = true;
    return result;
  }

}
