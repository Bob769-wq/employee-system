import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';

import { EmployeeHobbyService } from '../employee-hobby-service';

@Component({
  selector: 'app-table',
  imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatIconModule,
    MatRow,
    MatHeaderRow,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatCellDef,
  ],
  template: `
    <table
      mat-table
      [dataSource]="employeeHobbyService.chosenEmployeeHobbies()"
    >
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let element">
          {{ element.id === 0 ? '新增' : element.id }}
        </td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>名稱</th>
        <td mat-cell *matCellDef="let element">
          {{ element.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="edit">
        <th mat-header-cell *matHeaderCellDef>移除</th>
        <td mat-cell *matCellDef="let element; let i = index">
          <button type="button" (click)="handleDeleteByIndex(i)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        mat-row
        class="cursor-pointer hover:bg-gray-100"
        *matRowDef="let row; columns: displayedColumns"
      ></tr>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  employeeHobbyService = inject(EmployeeHobbyService);
  displayedColumns = ['id', 'name', 'edit'];

  handleDeleteByIndex(index: number) {
    this.employeeHobbyService.deleteByIndex(index);
  }

  constructor() {
    //placeholder
  }
}
