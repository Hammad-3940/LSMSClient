import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from '../../core/services/miscellaneous.service';
import { UserManagementService } from '../../core/services/usermanagement.service';
import { CommonService } from '../../shared/commonservice/common.service';
import { Onlyletterdirective } from '../../shared/directives/onlyletterdirective';
import { Phonenumberdirective } from '../../shared/directives/phonenumberdirective';
import { PaginationComponent } from '../../shared/paginationcomponent/paginationcomponent';
import { PhoneFormatPipe } from '../../shared/pipes/phone-format-pipe';

@Component({
  selector: 'app-usermanagement',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent, Onlyletterdirective, Phonenumberdirective],
  providers: [PhoneFormatPipe],
  templateUrl: './usermanagement.html',
  styleUrl: './usermanagement.scss',
})

export class UserManagementComponent implements OnInit {
  @ViewChild('userFirstName') userFirstName!: ElementRef<HTMLInputElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  userRolesList = signal<any[]>([]);
  genderList = signal<any[]>([]);
  userStatusList = signal<any[]>([]);
  userList = signal<any[]>([]);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  pageSizeOptions = [10, 25, 50, 100];

  private miscellaneousService = inject(MiscellaneousService);
  private userManagementService = inject(UserManagementService);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  getUserInfoFormGroup!: FormGroup;
  upsertUserFormGroup!: FormGroup;

  userFullName: string = '';
  userEmail: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  showPassword = false;
  showConfirmPassword = false;

  showUpsertUserModal = signal(false);
  showUpdatePasswordModal = signal(false);
  isEditing = signal(false);

  constructor(private formbuilder: FormBuilder, private elementRef: ElementRef, private phoneFormatPipe: PhoneFormatPipe) { }

  ngOnInit() {
    this.GetGender();
    this.GetUserRole();
    this.GetUserStatus();
    this.GetUserInformationFormGroup();
    this.UpsertUserFormGroup();
    this.GetUsersInformation();
  }

  GetUserInformationFormGroup() {
    this.getUserInfoFormGroup = this.formbuilder.group({
      fullName: new FormControl(''),
      email: new FormControl(''),
      statusId: new FormControl(0),
      genderId: new FormControl(0),
      roleId: new FormControl(0),
      pageNumber: new FormControl(1),
      numberOfRecords: new FormControl(10),
    });
  }

  UpsertUserFormGroup() {
    this.upsertUserFormGroup = this.formbuilder.group({
      firstName: new FormControl('', [Validators.required]),
      middleName: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/)]),
      phoneNumber: new FormControl('', [Validators.required]),
      statusId: new FormControl(null),
      genderId: new FormControl(null),
      roleId: new FormControl(null, [Validators.required]),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      isApproved: new FormControl(false),
    });
  }

  GetUsersInformation(reset?: boolean) {
    if (reset) this.GetUserInformationFormGroup();
    this.userManagementService.GetUsersInformation(this.getUserInfoFormGroup.value).subscribe({
      next: (res) => {
        if (res?.success && !this.commonService.isNullOrEmpty(res?.data) && res?.data?.length > 0) {
          this.userList.set(res.data);
          this.totalRecords.set(res.data[0].totalRecords);
        } else {
          this.userList.set([]);
          this.totalRecords.set(0);
        }
      }
    });
  }

  GetGender() {
    this.miscellaneousService.GetGender().subscribe({
      next: (res) => {
        if (res?.success && !this.commonService.isNullOrEmpty(res?.data) && res?.data?.length > 0) {
          this.genderList.set(res.data);
        } else {
          this.genderList.set([]);
        }
      }
    });
  }

  GetUserStatus() {
    this.miscellaneousService.GetUserStatus().subscribe({
      next: (res) => {
        if (res?.success && !this.commonService.isNullOrEmpty(res?.data) && res?.data?.length > 0) {
          this.userStatusList.set(res.data);
        } else {
          this.userStatusList.set([]);
        }
      }
    });
  }

  GetUserRole() {
    this.miscellaneousService.GetUserRole().subscribe({
      next: (res) => {
        if (res?.success && !this.commonService.isNullOrEmpty(res?.data) && res?.data?.length > 0) {
          this.userRolesList.set(res.data);
        } else {
          this.userRolesList.set([]);
        }
      }
    });
  }

  setPage(page: number) {
    this.currentPage.set(page);

    this.getUserInfoFormGroup.patchValue({
      pageNumber: page
    });

    this.GetUsersInformation();
  }

  setPageSize(size: number) {

    this.pageSize.set(size);
    this.currentPage.set(1);

    this.getUserInfoFormGroup.patchValue({
      numberOfRecords: size,
      pageNumber: 1
    });

    this.GetUsersInformation();
  }

  openAddModal() {
    this.resetPasswordValidations();
    setTimeout(() => {
      this.userFirstName.nativeElement.focus();
    }, 100);
    this.isEditing.set(false);
    this.showUpsertUserModal.set(true);
    this.upsertUserFormGroup.get('email')?.enable();
  }

  openEditModal(user: any) {
    this.upsertUserFormGroup.patchValue(user);
    this.upsertUserFormGroup.patchValue({
      phoneNumber: this.phoneFormatPipe.transform(user.phoneNumber)
    });
    this.isEditing.set(true);
    this.showUpsertUserModal.set(true);
    this.upsertUserFormGroup.get('email')?.disable();
    setTimeout(() => {
      this.userFirstName.nativeElement.focus();
    }, 100);
  }

  RegisterUser() {
    if (this.upsertUserFormGroup.invalid) {
      this.upsertUserFormGroup.markAllAsTouched();
      return;
    }

    const validation = this.commonService.validatePassword(this.upsertUserFormGroup.value.password, this.upsertUserFormGroup.value.confirmPassword);

    if (!validation.isValid) {
      this.passwordError = validation?.passwordError;
      this.confirmPasswordError = validation?.confirmPasswordError;
      return
    }

    const payload = {
      ...this.upsertUserFormGroup.getRawValue(),
      phoneNumber: this.upsertUserFormGroup.value.phoneNumber?.replace(/-/g, '')
    };

    this.userManagementService.RegisterUser(payload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res?.responseMessage);
            this.closeModal('updatePassword');
            this.GetUsersInformation(true);
            this.clearErrors();
          } else {
            this.toastr.error(res.responseMessage);
          }
        }
      });

  }

  UpdateUser() {
    if (this.upsertUserFormGroup.invalid) {
      this.upsertUserFormGroup.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.upsertUserFormGroup.getRawValue(),
      phoneNumber: this.upsertUserFormGroup.value.phoneNumber?.replace(/-/g, '')
    };

    this.userManagementService.UpdateUser(payload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res?.responseMessage);
            this.closeModal('upsertUser');
            this.GetUsersInformation(true);
          } else {
            this.toastr.error(res.responseMessage);
          }
        }
      });

  }

  closeModal(modal: string) {
    if (modal == 'upsertUser') {
      this.showUpsertUserModal.set(false);
      this.upsertUserFormGroup.reset();
    }
    if (modal == 'updatePassword') {
      this.showUpdatePasswordModal.set(false);
    }

  }

  clearErrors(): void {
    this.passwordError = '';
    this.confirmPasswordError = '';
  }

  openUpdatePasswordModal(user: any) {
    this.resetPasswordValidations();
    this.showUpdatePasswordModal.set(true);
    this.userEmail = user?.email;
    this.userFullName = user?.fullName;
    setTimeout(() => {
      this.password.nativeElement.focus();
    }, 100);
  }

  ChangePassword(password: string, confirmPassword: string) {
    const validation = this.commonService.validatePassword(password, confirmPassword);

    if (!validation.isValid) {
      this.passwordError = validation?.passwordError;
      this.confirmPasswordError = validation?.confirmPasswordError;
      return
    }

    const payload = {
      email: this.userEmail,
      password: password,
      confirmPassword: confirmPassword,
    };

    this.userManagementService.ChangePassword(payload)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res?.responseMessage);
            this.closeModal('updatePassword');
            this.GetUsersInformation(true);
          } else {
            this.toastr.error(res.responseMessage);
          }
        }
      });
  }

  resetPasswordValidations() {
    this.clearErrors();
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  deleteUser(id: number) {
  }
}
