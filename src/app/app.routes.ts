import { Routes } from '@angular/router';
import { Transactions } from './pages/transactions/transactions';
import { Budgets } from './pages/budgets/budgets';
import { Reports } from './pages/reports/reports';
import { Dashboard } from './pages/dashboard/dashboard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(
        (m) => m.Dashboard,
      ),
  },
  {
    path: 'transactions',
    component: Transactions,
  },
  {
    path: 'budgets',
    loadComponent: () =>
      import('./pages/budgets/budgets').then(
        (m) => m.Budgets,
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/reports/reports').then(
        (m) => m.Reports,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'transactions', component: Transactions },
  { path: 'budgets', component: Budgets },
  { path: 'reports', component: Reports }
];