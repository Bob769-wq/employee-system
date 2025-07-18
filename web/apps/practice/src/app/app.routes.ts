import { Routes } from '@angular/router';

import { EmployeeListComponent } from './employee-list.component';
import { FormArrayComponent } from './form-array/form-array.component';
import { TownListComponent } from './town-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/formArray',
    pathMatch: 'full',
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
