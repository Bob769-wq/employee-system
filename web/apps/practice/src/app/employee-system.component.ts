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

import { EmployeeQueryService } from './employee-query';
import { TownQueryService } from './town-query';

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
                @if (employeeQuery.isPending()) {
                  Loading...
                }
                @if (employeeQuery.isError()) {
                  Error!
                }
                @if (employeeQuery.data(); as data) {
                  @for (employee of data.items; track employee.id) {
                    <mat-option [value]="employee.firstName">
                      {{ employee.firstName }} - {{ employee.town.name }}
                    </mat-option>
                  }
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
  `,
})
export class EmployeeSystemComponent {
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
    this.validate();

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
      alert('Add at least one.');
    }
    if (this.form.invalid) {
      alert('Fill out all fields correctly.');
    }
    return '';
  }
}
