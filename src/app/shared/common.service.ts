import { Injectable } from '@angular/core';

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
}
