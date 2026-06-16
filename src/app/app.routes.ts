import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { AppLayoutComponent } from './layout/app-layout/app-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'forgotpassword', loadComponent: () => import('./pages/forgotpassword/forgotpassword').then(m => m.ForgotpasswordComponent) },
  { path: '', component: AppLayoutComponent, canActivate: [authGuard], children: [{ path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) }] },
  { path: '**', redirectTo: 'login' }
];
