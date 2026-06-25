import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T = any>(endpoint: string) {
    return this.http.get<any>(`${this.baseUrl}/${endpoint}`);
  }

  post<T = any>(endpoint: string, body: any) {
    return this.http.post<any>(`${this.baseUrl}/${endpoint}`, body);
  }

  put<T = any>(endpoint: string, body: any) {
    return this.http.put<any>(`${this.baseUrl}/${endpoint}`, body);
  }

  delete<T = any>(endpoint: string) {
    return this.http.delete<any>(`${this.baseUrl}/${endpoint}`);
  }
}
