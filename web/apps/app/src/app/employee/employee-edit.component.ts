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
import { MatSelectModule } from '@angular/material/select';
import { controlValue } from '@app/common/signal/ui/form';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { EmployeeCreateInput } from '../shared/data-access/api/models/employee-create-input';
import { EmployeeUpdateInput } from '../shared/data-access/api/models/employee-update-input';
import { PrimaryButtonComponent } from '../shared/primary-button.component';
import { TownQueryService } from '../town/data-access/town.query';
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
    MatSelectModule,
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
          <div class="flex">
            <div class="flex px-8">
              <mat-label class="mr-6 w-32 text-2xl">縣市</mat-label>
              <mat-form-field appearance="outline">
                <mat-select formControlName="cityId">
                  @if (citiesQuery.isPending()) {
                    讀取中...
                  } @else if (citiesQuery.isError()) {
                    讀取失敗
                  } @else {
                    @for (city of citiesQuery.data(); track city.id) {
                      <mat-option [value]="city.id">{{ city.name }}</mat-option>
                    }
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="flex px-8">
              <mat-label class="mr-6 w-12 text-2xl">鄉鎮</mat-label>
              <mat-form-field appearance="outline">
                <mat-select formControlName="townId">
                  @if (townsQuery.isPending()) {
                    讀取中...
                  } @else if (townsQuery.isError()) {
                    讀取失敗
                  } @else {
                    @for (town of townsQuery.data(); track town.id) {
                      <mat-option [value]="town.id">{{ town.name }}</mat-option>
                    }
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="w-100 flex px-8">
              <mat-label class="mr-6 w-12 text-2xl">地址</mat-label>
              <mat-form-field appearance="outline" class="w-80">
                <input
                  matInput
                  type="text"
                  placeholder="地址"
                  formControlName="addressDetail"
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
  #townQueryService = inject(TownQueryService);
  #employeeQueryService = inject(EmployeesQueryService);
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
    cityId: this.#fb.control<number | undefined>(undefined, {
      validators: [Validators.required],
    }),
    townId: this.#fb.control<number | undefined>(undefined, {
      validators: [Validators.required],
    }),
    addressDetail: this.#fb.control('', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });
  chosenCityId = controlValue(this.form.controls.cityId);

  citiesQuery = injectQuery(() => this.#townQueryService.citiesQuery());
  townsQuery = injectQuery(() =>
    this.#townQueryService.townsQuery(this.chosenCityId()),
  );

  employeeId = input.required<string>();
  employeeQueryById = injectQuery(() =>
    this.#employeeQueryService.employeeQueryById(this.existEmployeeId()),
  );

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

  chosenTownId = controlValue(this.form.controls.townId);

  constructor() {
    this.#initializeFormEffect();
    // this.#resetTownIdEffect();
  }

  #initializeFormEffect() {
    effect(() => {
      const currentData = this.employeeQueryById.data();
      if (currentData) {
        this.form.patchValue({
          firstName: currentData.firstName,
          lastName: currentData.lastName,
          nationalId: currentData.nationalId,
          email: currentData.email,
          cellphone: currentData.cellphone,
          cityId: currentData.town.city.id,
          townId: currentData.town.id,
          addressDetail: currentData.addressDetail,
        });
      } else {
        this.form.patchValue({
          firstName: undefined,
          lastName: undefined,
          nationalId: undefined,
          email: undefined,
          cellphone: undefined,
          cityId: undefined,
          townId: undefined,
          addressDetail: undefined,
        });
      }
    });
  }

  #trim() {
    const { firstName, lastName, nationalId, email, cellphone, addressDetail } =
      this.form.getRawValue();
    this.form.patchValue({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalId: nationalId.trim(),
      email: email.trim(),
      cellphone: cellphone.trim(),
      addressDetail: addressDetail.trim(),
    });
  }

  #validate() {
    this.form.markAsTouched();
    this.form.updateValueAndValidity();
    return this.form.valid;
  }

  #create() {
    const {
      firstName,
      lastName,
      nationalId,
      email,
      cellphone,
      townId,
      addressDetail,
    } = this.form.getRawValue();

    const input: EmployeeCreateInput = {
      firstName: firstName,
      lastName: lastName,
      nationalId: nationalId,
      email: email,
      cellphone: cellphone,
      townId: townId ?? 0,
      addressDetail: addressDetail,
      updateEmployeeHobbies: [],
    };

    this.createMutation.mutate(input, {
      onSuccess: () => {
        //
      },
    });
  }
  #update() {
    const {
      firstName,
      lastName,
      nationalId,
      email,
      cellphone,
      townId,
      addressDetail,
    } = this.form.getRawValue();

    const input: EmployeeUpdateInput = {
      firstName: firstName,
      lastName: lastName,
      nationalId: nationalId,
      email: email,
      cellphone: cellphone,
      townId: townId ?? 0,
      addressDetail: addressDetail,
      updateEmployeeHobbies: [],
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
