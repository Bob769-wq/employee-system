import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { EmployeeCreateInput } from '../shared/data-access/api/models/employee-create-input';
import { EmployeeUpdateInput } from '../shared/data-access/api/models/employee-update-input';
import { PrimaryButtonComponent } from '../shared/primary-button.component';
import { EmployeesQueryService } from './data-access/employee.query';

@Component({
  selector: 'app-employee-edit',
  imports: [
    CommonModule,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    PrimaryButtonComponent,
  ],
  template: `
    <div class="px-6 py-2 text-2xl">{{ pageTitle() }}</div>
    <form class="flex flex-col gap-4" [formGroup]="form" (submit)="submit()">
      <div class="m-4 flex flex-col items-center gap-4 border p-6">
        <div class="flex w-full flex-col gap-4">
          <div class="flex">
            <div class="flex px-8">
              <mat-label class="mr-6 w-32 text-2xl">姓</mat-label>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  type="text"
                  placeholder="姓氏"
                  formControlName="lastName"
                />
              </mat-form-field>
            </div>
            <div class="flex px-8">
              <mat-label class="mr-6 w-12 text-2xl">名</mat-label>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  type="text"
                  placeholder="大名"
                  formControlName="firstName"
                />
              </mat-form-field>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex px-8">
              <mat-label class="mr-6 w-32 text-2xl">身分證字號</mat-label>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  type="text"
                  placeholder="身分證字號"
                  formControlName="nationalId"
                />
              </mat-form-field>
            </div>
            <div class="flex px-8">
              <mat-label class="mr-6 w-12 text-2xl">Email</mat-label>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  type="email"
                  placeholder="Email"
                  formControlName="email"
                />
              </mat-form-field>
            </div>
            <div class="flex px-8">
              <mat-label class="mr-6 w-12 text-2xl">手機</mat-label>
              <mat-form-field appearance="outline">
                <input
                  matInput
                  type="cellphone"
                  placeholder="手機"
                  formControlName="cellphone"
                />
              </mat-form-field>
            </div>
            <app-primary-button [label]="buttonLabel()" />
          </div>
        </div>
      </div>
    </form>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeEditComponent {
  #employeeQueryService = inject(EmployeesQueryService);
  employeeQueryById = injectQuery(() =>
    this.#employeeQueryService.employeeQueryById(this.existEmployeeId()),
  );

  employeeId = input.required<string>();
  isNew = computed(() => this.employeeId() === 'new');
  existEmployeeId = computed(() => {
    return numberAttribute(this.employeeId());
  });
  pageTitle = computed(() => {
    return this.isNew() ? '新增人員' : '編輯人員';
  });
  buttonLabel = computed(() => {
    return this.isNew() ? '新增' : '更新';
  });
  createMutation = this.#employeeQueryService.createMutation();
  updateMutation = this.#employeeQueryService.updateMutation();

  #fb = inject(NonNullableFormBuilder);
  form = this.#fb.group({
    firstName: this.#fb.control('', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
    lastName: this.#fb.control('', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
    nationalId: this.#fb.control('', {
      validators: [
        Validators.required,
        Validators.pattern('^[A-Z][12]\\d{8}$'),
      ],
    }),
    email: this.#fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    cellphone: this.#fb.control('', {
      validators: [Validators.required, Validators.pattern(/^09\d{8}$/)],
    }),
  });

  constructor() {
    // console.log('start employee edit component....');
    this.#initializeForm();
  }

  #initializeForm() {
    effect(() => {
      if (this.existEmployeeId()) {
        const currentData = this.employeeQueryById.data();
        if (currentData) {
          this.form.patchValue({
            firstName: currentData.firstName,
            lastName: currentData.lastName,
            nationalId: currentData.nationalId,
            email: currentData.email,
            cellphone: currentData.cellphone,
          });
        }
      }
    });
  }

  #trim() {
    const { firstName, lastName, nationalId, email, cellphone } =
      this.form.getRawValue();
    this.form.patchValue({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalId: nationalId.trim(),
      email: email.trim(),
      cellphone: cellphone.trim(),
    });
  }

  #validate() {
    this.form.markAsTouched();
    this.form.updateValueAndValidity();
    return this.form.valid;
  }

  #create() {
    const { firstName, lastName, nationalId, email, cellphone } =
      this.form.getRawValue();

    const input: EmployeeCreateInput = {
      firstName: firstName,
      lastName: lastName,
      nationalId: nationalId,
      email: email,
      cellphone: cellphone,
      townId: 1, // mock for now
    };

    this.createMutation.mutate(input, {
      onSuccess: () => {
        //
      },
    });
  }
  #update() {
    const { firstName, lastName, nationalId, email, cellphone } =
      this.form.getRawValue();

    const input: EmployeeUpdateInput = {
      firstName: firstName,
      lastName: lastName,
      nationalId: nationalId,
      email: email,
      cellphone: cellphone,
      townId: 1, // mock for now
    };

    this.updateMutation.mutate(
      {
        employeeId: this.existEmployeeId(),
        body: input,
      },
      {
        onSuccess: () => {
          //
        },
      },
    );
  }

  submit() {
    console.log('submit....');
    this.#trim();
    if (!this.#validate()) {
      console.log('validate after trim failed....');
      return;
    }
    if (this.isNew()) {
      console.log('create....');
      this.#create();
    } else {
      console.log('update....');
      this.#update();
    }
  }
}
