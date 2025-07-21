import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { DockProblemService } from './dock-problem.service';
import { EmployeeQueryService } from './employee-query';

interface EmployeeList {
  name: string;
  detail: string;
}

function createEmployeeGroup(employee?: EmployeeList) {
  return new FormGroup({
    name: new FormControl(employee?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    detail: new FormControl(employee?.detail ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}

type EmployeeGroup = ReturnType<typeof createEmployeeGroup>;

@Component({
  selector: 'app-employee-system',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatSelectModule,
  ],
  template: `
    <h1 class="text-5xl font-bold">Employee System</h1>
    <form [formGroup]="form" (submit)="submit()">
      <div formArrayName="employees">
        @for (
          employeeGroup of employees.controls;
          track employeeGroup;
          let i = $index
        ) {
          <div [formGroupName]="i">
            <mat-form-field>
              <mat-label>Name</mat-label>
              <mat-select formControlName="name">
                @for (employee of employeesData; track employee.id) {
                  <mat-option [value]="employee.name">{{
                    employee.name
                  }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Detail</mat-label>
              <input matInput formControlName="detail" />
            </mat-form-field>

            @if (employees.length > 1) {
              <button mat-icon-button type="button" (click)="remove(i)">
                <mat-icon>remove</mat-icon>
              </button>
            }
          </div>
        }
        <button
          mat-icon-button
          type="button"
          (click)="add()"
          class="text-red-700"
        >
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <button mat-flat-button>Submit</button>
    </form>

    <div class="mt-6">
      <h2 class="text-2xl font-bold">Employee List</h2>
      <div>
        @for (employee of employeesData; track employee.id) {
          {{ employee.name }} / {{ employee.townName }}
        }
      </div>
    </div>

    <div>
      @if (employeeQuery.isPending()) {
        Loading...
      }
      @if (employeeQuery.error()) {
        Error!
      }
      @if (employeeQuery.data(); as data) {
        @for (employee of data.items; track employee.id) {
          {{ employee.firstName }} - {{ employee.town }}
        }
      }
    </div>
  `,
})
export class EmployeeSystemComponent {
  dockProblem = inject(DockProblemService);
  employeesData = this.dockProblem.getEmployeesWithTownName();

  employeeQueryService = inject(EmployeeQueryService);
  employeeQuery = injectQuery(() =>
    this.employeeQueryService.queryEmployees({
      page: 1,
      pageSize: 5,
    }),
  );

  readonly #fb = inject(NonNullableFormBuilder);
  readonly form = this.#fb.group({
    employees: new FormArray<EmployeeGroup>([createEmployeeGroup()]),
  });

  get employees() {
    return this.form.controls.employees;
  }

  add(employee?: EmployeeList) {
    const employeeGroup = createEmployeeGroup(employee);
    this.employees.push(employeeGroup);
  }

  remove(index: number) {
    this.employees.removeAt(index);
  }

  submit() {
    this.trim();
    const error = this.validate();
    if (error) {
      alert(error);
      return;
    }

    const employees = this.employees.getRawValue();
    confirm(`Submitted employees: ${JSON.stringify(employees, null, 2)}`);
  }

  trim() {
    this.employees.controls.forEach((employeeGroup) => {
      const { name, detail } = employeeGroup.getRawValue();
      employeeGroup.patchValue({
        name: name.trim(),
        detail: detail.trim(),
      });
    });
  }

  validate() {
    if (this.employees.length === 0) {
      return 'Add at least one.';
    }
    if (this.form.invalid) {
      return 'Fill out all fields correctly.';
    }
    return '';
  }
}
