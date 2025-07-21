import { Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { EmployeeQueryService } from './employee-query';

@Component({
  selector: 'app-employee-list',
  imports: [],
  template: ``,
})
export class EmployeeListComponent {
  employeeQueryService = inject(EmployeeQueryService);

  employeeQuery = injectQuery(() =>
    this.employeeQueryService.queryEmployees({
      page: 1,
      pageSize: 5,
    }),
  );
}
