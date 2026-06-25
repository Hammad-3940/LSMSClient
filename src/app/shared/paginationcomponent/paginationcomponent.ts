import { Component, ElementRef, HostListener, ViewChild, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-paginationcomponent',
  imports: [],
  templateUrl: './paginationcomponent.html',
  styleUrl: './paginationcomponent.scss',
})
export class PaginationComponent {

  currentPage = input.required<number>();
  pageSize = input.required<number>();
  totalRecords = input.required<number>();

  pageChanged = output<number>();
  pageSizeChanged = output<number>();

  pageSizeOptions = [10, 25, 50, 100];
  pageSizeMenuOpen = signal(false);

  @ViewChild('pageSizeDropdown')
  pageSizeDropdown!: ElementRef;

  totalPages = computed(() =>
    Math.ceil(this.totalRecords() / this.pageSize()) || 1
  );

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  setPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;

    this.pageChanged.emit(page);
  }

  setPageSize(size: number) {
    this.pageSizeMenuOpen.set(false);
    this.pageSizeChanged.emit(size);
  }

  togglePageSizeMenu() {
    this.pageSizeMenuOpen.set(!this.pageSizeMenuOpen());
  }

  min(a: number, b: number) {
    return Math.min(a, b);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.pageSizeMenuOpen() &&
      this.pageSizeDropdown &&
      !this.pageSizeDropdown.nativeElement.contains(event.target)
    ) {
      this.pageSizeMenuOpen.set(false);
    }
  }
}
