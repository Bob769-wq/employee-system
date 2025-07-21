import { Component, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { EmployeeQueryService } from './employee-query';

@Component({
  selector: 'app-employee-list',
  imports: [],
  template: `
    @if (employeeQuery.isPending()) {
      Loading...
    }
    @if (employeeQuery.isError()) {
      Error!
    }
    @if (employeeQuery.data(); as data) {
      @for (employee of data.items; track employee.id) {
        {{ employee.firstName }}
      }
    }
    <button (click)="nextPage()">next page</button>
    <button (click)="returnTo1()">return to 1</button>
  `,
})
export class EmployeeListComponent {
  employeeQueryService = inject(EmployeeQueryService);

  page = signal<number>(1);
  pageSize = signal<number>(5);

  employeeQuery = injectQuery(() =>
    this.employeeQueryService.queryEmployees({
      page: this.page(),
      pageSize: this.pageSize(),
    }),
  );

  nextPage() {
    this.page.update((value) => value + 1);
  }

  returnTo1() {
    this.page.set(1);
  }
}
