import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from '../../core/services/miscellaneous.service';
import { UserManagementService } from '../../core/services/usermanagement.service';
import { CommonService } from '../../shared/commonservice/common.service';
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginationComponent],
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
  showModal = signal(false);
  isEditing = signal(false);
  editingUser: Partial<User> = {};

  constructor(private formbuilder: FormBuilder, private elementRef: ElementRef) { }

  ngOnInit() {
    this.GetGender();
    this.GetUserRole();
    this.GetUserStatus();
    this.GetUserInformationFormGroup();
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

  saveUser() {

  }

  deleteUser(id: number) {
  }
}
