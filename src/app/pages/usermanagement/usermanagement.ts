import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './usermanagement.html',
  styleUrl: './usermanagement.scss',
})
export class UserManagementComponent {
  searchQuery = signal('');
  selectedRole = signal('All');
  selectedStatus = signal('All');
  showModal = signal(false);
  isEditing = signal(false);
  currentPage = signal(1);
  pageSize = 8;
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

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredUsers().length / this.pageSize)
  );

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
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

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
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

  roleIcon(role: string): string {
    return { Admin: 'ti-shield-star', Manager: 'ti-briefcase', Viewer: 'ti-eye' }[role] ?? 'ti-user';
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
