import { Routes } from '@angular/router';

import { EmployeeListComponent } from './employee-list.component';
import { EmployeeSystemComponent } from './employee-system.component';
import { FormArrayComponent } from './form-array/form-array.component';
import { TownListComponent } from './town-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/employeeSystem',
    pathMatch: 'full',
  },
  {
    path: 'employeeSystem',
    component: EmployeeSystemComponent,
  },
  {
    path: 'formArray',
    component: FormArrayComponent,
  },
  {
    path: 'employee',
    component: EmployeeListComponent,
  },
  {
    path: 'town',
    component: TownListComponent,
  },
];
