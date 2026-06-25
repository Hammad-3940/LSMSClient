import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService } from '../../core/services/miscellaneous.service';
import { UserManagementService } from '../../core/services/usermanagement.service';
import { CommonService } from '../../shared/common.service';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usermanagement.html',
  styleUrl: './usermanagement.scss',
})
export class UserManagementComponent implements OnInit {
  @ViewChild('pageSizeDropdown') pageSizeDropdown!: ElementRef;
  userRolesList = signal<any[]>([]);
  genderList = signal<any[]>([]);
  userStatusList = signal<any[]>([]);
  userList = signal<any[]>([]);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);
  pageSizeOptions = [10, 25, 50, 100];
  pageSizeMenuOpen = signal(false);

  private miscellaneousService = inject(MiscellaneousService);
  private userManagementService = inject(UserManagementService);
  private toastr = inject(ToastrService);
  private commonService = inject(CommonService);

  getUserInfoFormGroup!: FormGroup;

  searchQuery = signal('');
  selectedRole = signal('All');
  selectedStatus = signal('All');
  showModal = signal(false);
  isEditing = signal(false);
  searchName = signal('');
  searchEmail = signal('');

  roles = ['All', 'Admin', 'Manager', 'Viewer'];
  statuses = ['All', 'Active', 'Inactive'];

  editingUser: Partial<User> = {};

  users = signal<User[]>([
    { id: 1, name: 'Ahmed Raza', email: 'ahmed@lsms.pk', role: 'Admin', status: 'Active', createdAt: '2024-01-10' },
    { id: 2, name: 'Sara Khan', email: 'sara@lsms.pk', role: 'Manager', status: 'Active', createdAt: '2024-02-14' },
    { id: 3, name: 'Bilal Mehmood', email: 'bilal@lsms.pk', role: 'Viewer', status: 'Inactive', createdAt: '2024-03-05' },
    { id: 4, name: 'Fatima Ali', email: 'fatima@lsms.pk', role: 'Manager', status: 'Active', createdAt: '2024-03-20' },
    { id: 5, name: 'Usman Tariq', email: 'usman@lsms.pk', role: 'Viewer', status: 'Active', createdAt: '2024-04-01' },
    { id: 6, name: 'Ayesha Noor', email: 'ayesha@lsms.pk', role: 'Admin', status: 'Active', createdAt: '2024-04-15' },
    { id: 7, name: 'Hassan Malik', email: 'hassan@lsms.pk', role: 'Viewer', status: 'Inactive', createdAt: '2024-05-02' },
    { id: 8, name: 'Zara Ahmed', email: 'zara@lsms.pk', role: 'Manager', status: 'Active', createdAt: '2024-05-18' },
    { id: 9, name: 'Omar Sheikh', email: 'omar@lsms.pk', role: 'Viewer', status: 'Active', createdAt: '2024-06-01' },
    { id: 10, name: 'Nadia Iqbal', email: 'nadia@lsms.pk', role: 'Manager', status: 'Inactive', createdAt: '2024-06-10' },
  ]);

  constructor(private formbuilder: FormBuilder, private elementRef: ElementRef) { }

  ngOnInit() {
    this.GetGender();
    this.GetUserRole();
    this.GetUserStatus();
    this.GetUserInformationFormGroup();
    this.GetUsersInformation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.pageSizeMenuOpen() && this.pageSizeDropdown && !this.pageSizeDropdown.nativeElement.contains(event.target)) {
      this.pageSizeMenuOpen.set(false);
    }
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
    if (page < 1 || page > this.totalPages()) return; // disabled clicks ko ignore karega

    this.currentPage.set(page);
    this.getUserInfoFormGroup.patchValue({ pageNumber: page });
    this.GetUsersInformation();
  }

  togglePageSizeMenu() {
    this.pageSizeMenuOpen.set(!this.pageSizeMenuOpen());
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.pageSizeMenuOpen.set(false);

    this.getUserInfoFormGroup.patchValue({
      numberOfRecords: size,
      pageNumber: 1
    });
    this.GetUsersInformation();
  }

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()) || 1);

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2; // current ke aage/peechay kitne page numbers dikhane hain
    const pages: number[] = [];

    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

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
    if (!this.editingUser.name || !this.editingUser.email) return;

    if (this.isEditing()) {
      this.users.update(list =>
        list.map(u => u.id === this.editingUser.id ? { ...u, ...this.editingUser } as User : u)
      );
    } else {
      const newUser: User = {
        id: Date.now(),
        name: this.editingUser.name!,
        email: this.editingUser.email!,
        role: this.editingUser.role as User['role'] ?? 'Viewer',
        status: this.editingUser.status as User['status'] ?? 'Active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      this.users.update(list => [...list, newUser]);
    }
    this.showModal.set(false);
  }

  deleteUser(id: number) {
    this.users.update(list => list.filter(u => u.id !== id));
  }

  toggleStatus(user: User) {
    this.users.update(list =>
      list.map(u => u.id === user.id
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
        : u
      )
    );
  }

  roleBadge(role: string): string {
    return { Admin: 's-quar', Manager: 's-sale', Viewer: 's-active' }[role] ?? 's-active';
  }

  countByRole(role: string): number {
    return this.users().filter(u => u.role === role).length;
  }

  countByStatus(status: string): number {
    return this.users().filter(u => u.status === status).length;
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  filteredUsers = computed(() => {
    return this.users().filter(u => {
      const matchName = u.name.toLowerCase().includes(this.searchName().toLowerCase());
      const matchEmail = u.email.toLowerCase().includes(this.searchEmail().toLowerCase());
      const matchRole = this.selectedRole() === 'All' || u.role === this.selectedRole();
      const matchStatus = this.selectedStatus() === 'All' || u.status === this.selectedStatus();
      return matchName && matchEmail && matchRole && matchStatus;
    });
  });

  applyFilters() {
    this.currentPage.set(1);
  }

  clearFilters() {
    this.searchName.set('');
    this.searchEmail.set('');
    this.selectedRole.set('All');
    this.selectedStatus.set('All');
    this.currentPage.set(1);
  }
}
