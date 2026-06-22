import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })

export class ForgotpasswordService {

  private api = inject(ApiService);

  confirmUserEmail(email: any) {
    return this.api.post<any>('Account/ConfirmUserEmail', email);
  }

  sendVerificationCode(email: any) {
    return this.api.post<any>('Account/SendVerificationCode', email);
  }

  verifyOtpCode(request: any) {
    return this.api.post<any>('Account/VerifyOtpCode', request);
  }

  resetPassword(request: any) {
    return this.api.post<any>('Account/ResetPassword', request);
  }

  resetExpiredPassword(request: any) {
    return this.api.post<any>('Account/ResetExpiredPassword', request);
  }
}
