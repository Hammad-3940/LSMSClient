import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  activeRoute: string = 'dashboard';
  constructor(private router: Router) { }

  route(route: string) {
    this.activeRoute = route;
    this.router.navigate([route]);
  }
}
