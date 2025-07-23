import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { EmployeeQueryService } from './data-access/employee-query';

@Component({
  selector: 'app-employee-list',
  imports: [MatTableModule, RouterLink],
  template: `
    <h1 class="mb-5 text-2xl font-bold">Employee List</h1>
    @if (employeeQuery.isPending()) {
      Loading...
    }
    @if (employeeQuery.isError()) {
      ERROR!
    }
    @if (employeeQuery.data(); as data) {
      <div>
        @for (employee of data.items; track employee.id) {
          <div
            class="grid cursor-pointer grid-cols-5 rounded-lg border p-4 hover:bg-gray-50"
            [routerLink]="['/employee', employee.id]"
          >
            <span>{{ employee.lastName }} {{ employee.firstName }}</span>
            <span>{{ employee.cellphone }}</span>
            <span>{{ employee.id }}</span>
            <span>{{ employee.email }}</span>
            <span>{{ employee.town.name }}</span>
          </div>
        } @empty {
          now is empty
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
