import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })

export class MiscellaneousService {

  private api = inject(ApiService);

  GetGender() {
    return this.api.get<any>('Miscellaneous/GetGender');
  }

  GetUserStatus() {
    return this.api.get<any>('Miscellaneous/GetUserStatus');
  }

  GetUserRole() {
    return this.api.get<any>('Miscellaneous/GetUserRole');
  }
}
