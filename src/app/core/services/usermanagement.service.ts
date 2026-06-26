import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })

export class UserManagementService {

  private api = inject(ApiService);

  GetUsersInformation(request: any) {
    return this.api.post<any>('User/GetUsersInformation', request);
  }

  RegisterUser(request: any) {
    return this.api.post<any>('User/RegisterUser', request);
  }

  UpdateUser(request: any) {
    return this.api.post<any>('User/UpdateUser', request);
  }

  DeleteUser(email: string) {
    return this.api.post<any>(`User/DeleteUser?email=${encodeURIComponent(email)}`, {});
  }

  ChangePassword(request: any) {
    return this.api.post<any>('User/ChangePassword', request);
  }
}
