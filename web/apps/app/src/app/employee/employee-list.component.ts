import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatTableModule,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { EmployeesQueryService } from './data-access/employee.query';

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    RouterLink,
  ],
  template: `
    <div class="px-6 py-2 text-2xl">員工列表</div>
    <div class="px-6 py-2">
      @if (employeeQuery.isPending()) {
        讀取中...
      } @else if (employeeQuery.isError()) {
        讀取失敗
      } @else {
        <table mat-table [dataSource]="employeeList">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>姓名</th>
            <td mat-cell *matCellDef="let element">
              {{ element.lastName + element.firstName }}
            </td>
          </ng-container>

          <ng-container matColumnDef="nationalId">
            <th mat-header-cell *matHeaderCellDef>身分證字號</th>
            <td mat-cell *matCellDef="let element">{{ element.nationalId }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>email</th>
            <td mat-cell *matCellDef="let element">{{ element.email }}</td>
          </ng-container>

          <ng-container matColumnDef="cellphone">
            <th mat-header-cell *matHeaderCellDef>手機</th>
            <td mat-cell *matCellDef="let element">{{ element.cellphone }}</td>
          </ng-container>

          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef>縣市</th>
            <td mat-cell *matCellDef="let element">
              {{ element.town.city.name + element.town.name }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            class="cursor-pointer hover:bg-gray-100"
            routerLink="/employees/{{ row.id }}/edit"
            *matRowDef="let row; columns: displayedColumns"
          ></tr>
        </table>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListComponent {
  #employeesQueryService = inject(EmployeesQueryService);

  employeeQuery = injectQuery(() =>
    this.#employeesQueryService.employeesQuery(),
  );

  get employeeList() {
    return this.employeeQuery.data()?.items || [];
  }

  displayedColumns = [
    'id',
    'name',
    'nationalId',
    'email',
    'cellphone',
    'address',
  ];
}
