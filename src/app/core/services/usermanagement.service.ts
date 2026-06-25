import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })

export class UserManagementService {

  private api = inject(ApiService);

  GetUsersInformation(request: any) {
    return this.api.post<any>('User/GetUsersInformation', request);
  }
}
