import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from '../../core/services/miscellaneous.service';
import { UserManagementService } from '../../core/services/usermanagement.service';
import { CommonService } from '../../shared/commonservice/common.service';
import { Onlyletterdirective } from '../../shared/directives/onlyletterdirective';
import { Phonenumberdirective } from '../../shared/directives/phonenumberdirective';
import { PaginationComponent } from '../../shared/paginationcomponent/paginationcomponent';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

@Component({
  selector: 'app-usermanagement',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent, Onlyletterdirective, Phonenumberdirective],
  templateUrl: './usermanagement.html',
  styleUrl: './usermanagement.scss',
})

export class UserManagementComponent implements OnInit {
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

  passwordError: string = '';
  confirmPasswordError: string = '';
  showPassword = false;
  showConfirmPassword = false;

  showModal = signal(false);
  isEditing = signal(false);
  editingUser: Partial<User> = {};

  constructor(private formbuilder: FormBuilder, private elementRef: ElementRef) { }

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
      phoneNumber: new FormControl(''),
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
    this.isEditing.set(false);
    this.editingUser = { role: 'Viewer', status: 'Active' };
    this.showModal.set(true);
  }

  openEditModal(user: User) {
    this.isEditing.set(true);
    this.editingUser = { ...user };
    this.showModal.set(true);
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

    this.userManagementService.RegisterUser(this.upsertUserFormGroup.value)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toastr.success(res?.responseMessage);
            this.showModal.set(false);
            this.GetUsersInformation(true);
            this.clearErrors();
            this.upsertUserFormGroup.reset();
          } else {
            this.toastr.error(res.responseMessage);
          }
        }
      });

  }

  closeUpsertUserModel() {
    this.showModal.set(false);
    this.upsertUserFormGroup.reset();
  }

  clearErrors(): void {
    this.passwordError = '';
    this.confirmPasswordError = '';
  }

  deleteUser(id: number) {
  }
}
