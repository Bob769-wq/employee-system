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
import { injectQuery } from '@tanstack/angular-query-experimental';

import { PrimaryButtonComponent } from '../shared/primary-button.component';
import { EmployeesQueryService } from './data-access/employee.query';

@Component({
  selector: 'app-employee-list',
  imports: [
    CommonModule,
    PrimaryButtonComponent,
    MatTableModule,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
  ],
  template: `
    <div class="px-6 py-2 text-2xl">員工列表</div>
    <div class="px-6 py-2">
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

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
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

  displayedColumns = ['id', 'name', 'nationalId', 'email', 'cellphone'];
}
