import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./employee/employee-list.component').then(
        (m) => m.EmployeeListComponent,
      ),
  },
];
