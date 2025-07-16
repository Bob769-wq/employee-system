import { Route } from '@angular/router';

import { EmployeeListComponent } from './employee/employee-list.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: EmployeeListComponent,
  },
];
