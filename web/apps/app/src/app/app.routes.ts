import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./employee/employee-list.component').then(
        (m) => m.EmployeeListComponent,
      ),
  },
  {
    path: 'employees/:employeeId/edit',
    loadComponent: () =>
      import('./employee/employee-edit.component').then(
        (m) => m.EmployeeEditComponent,
      ),
  },
];
