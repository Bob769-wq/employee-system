import { Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { EmployeeQueryService } from './employee-query';

@Component({
  selector: 'app-employee-list',
  imports: [],
  template: `
    <h1 class="text-2xl font-bold">Employee List</h1>
    @if (employeeQuery.isPending()) {
      Loading...
    }
    @if (employeeQuery.error()) {
      ERROR!
    }
    @if (employeeQuery.data(); as data) {
      <div class="space-y-4">
        @for (employee of data.items; track employee.id) {
          <div>
            <div>
              <span class="font-medium"
                >{{ employee.lastName }} {{ employee.firstName }}
              </span>
              <span>{{ employee.cellphone }}</span>
              <span>ID{{ employee.id }}</span>
              <span>{{ employee.email }}</span>
            </div>
          </div>
        }
      </div>
    }
  `,
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
