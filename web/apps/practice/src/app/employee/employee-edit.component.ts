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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { controlValue } from '@app/common/signal/ui/form';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { NgxControlError } from 'ngxtension/control-error';
import { EmployeeCreateInput } from 'web/libs/practice/shared/data-access/api/src/lib/models/employee-create-input';
import { EmployeeUpdateInput } from 'web/libs/practice/shared/data-access/api/src/lib/models/employee-update-input';

import { PrimaryButtonComponent } from '../shared/primary-button.component';
import { TownQueryService } from '../town/data-access/town-query';
import { EmployeeQueryService } from './data-access/employee-query';

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
    MatIconModule,
    NgxControlError,
  ],
  template: `
    <div class="px-6 py-2 text-2xl">
      {{ isNew() ? '新增人員' : '編輯人員' }}
    </div>
    <form class="flex flex-col gap-4" [formGroup]="form" (submit)="submit()">
      <div class="m-4 flex flex-col items-center gap-4 border p-6">
        <div class="flex w-full flex-col gap-4">
          <div class="flex gap-16 px-8">
            <div class="flex">
              <mat-label class="mr-6 w-32 text-2xl">姓</mat-label>
              <mat-form-field>
                <input
                  matInput
                  type="text"
                  placeholder="姓氏"
                  formControlName="lastName"
                />
                <mat-error
                  *ngxControlError="form.controls.lastName; track: 'required'"
                >
                  必填
                </mat-error>
              </mat-form-field>
            </div>
            <div class="flex">
              <mat-label class="mr-6 w-12 text-2xl">名</mat-label>
              <mat-form-field>
                <input
                  matInput
                  type="text"
                  placeholder="大名"
                  formControlName="firstName"
                />
                <mat-error
                  *ngxControlError="form.controls.firstName; track: 'required'"
                >
                  必填
                </mat-error>
              </mat-form-field>
            </div>
          </div>
          <div class="flex gap-16 px-8">
            <div class="flex">
              <mat-label class="mr-6 w-32 text-2xl">縣市</mat-label>
              <mat-form-field>
                <mat-select formControlName="cityId">
                  @if (citiesQuery.isPending()) {
                    讀取中...
                  } @else if (citiesQuery.isError()) {
                    讀取失敗
                  } @else {
                    @if (citiesQuery.data(); as data) {
                      @if (data.length === 0) {
                        <mat-option disabled>無資料</mat-option>
                      } @else {
                        @for (city of data; track city.id) {
                          <mat-option [value]="city.id">
                            {{ city.name }}
                          </mat-option>
                        }
                      }
                    }
                  }
                </mat-select>
                <mat-error
                  *ngxControlError="form.controls.cityId; track: 'required'"
                >
                  必填
                </mat-error>
              </mat-form-field>
            </div>
            <div class="flex">
              <mat-label class="mr-6 w-12 text-2xl">鄉鎮</mat-label>
              <mat-form-field>
                <mat-select formControlName="townId">
                  @if (townsQuery.isPending()) {
                    讀取中...
                  } @else {
                    @if (townsQuery.data(); as data) {
                      @if (data.length === 0) {
                        <mat-option disabled>無資料</mat-option>
                      } @else {
                        @for (town of data; track town.id) {
                          <mat-option [value]="town.id">
                            {{ town.name }}
                          </mat-option>
                        }
                      }
                    }
                  }
                </mat-select>
                <mat-error
                  *ngxControlError="form.controls.townId; track: 'required'"
                >
                  必填
                </mat-error>
              </mat-form-field>
            </div>
            <div class="w-100 flex">
              <mat-label class="mr-6 w-12 text-2xl">地址</mat-label>
              <mat-form-field class="w-80">
                <input
                  matInput
                  type="text"
                  placeholder="地址"
                  formControlName="addressDetail"
                />
                <mat-error
                  *ngxControlError="
                    form.controls.addressDetail;
                    track: 'required'
                  "
                  >必填</mat-error
                >
              </mat-form-field>
            </div>
          </div>
          <div class="flex gap-16 px-8">
            <div class="flex">
              <mat-label class="mr-6 w-32 text-2xl">身分證字號</mat-label>
              <mat-form-field>
                <input
                  matInput
                  type="text"
                  placeholder="身分證字號"
                  formControlName="nationalId"
                />
                <mat-error
                  *ngxControlError="form.controls.nationalId; track: 'required'"
                >
                  必填
                </mat-error>
                <mat-error
                  *ngxControlError="form.controls.nationalId; track: 'pattern'"
                >
                  不正確的格式
                </mat-error>
              </mat-form-field>
            </div>
            <div class="flex">
              <mat-label class="mr-6 w-12 text-2xl">Email</mat-label>
              <mat-form-field>
                <input
                  matInput
                  type="email"
                  placeholder="Email"
                  formControlName="email"
                />
                <mat-error
                  *ngxControlError="form.controls.email; track: 'required'"
                >
                  必填
                </mat-error>
                <mat-error
                  *ngxControlError="form.controls.email; track: 'email'"
                >
                  不正確的格式
                </mat-error>
              </mat-form-field>
            </div>
            <div class="flex">
              <mat-label class="mr-6 w-12 text-2xl">手機</mat-label>
              <mat-form-field>
                <input
                  matInput
                  type="text"
                  placeholder="手機"
                  formControlName="cellphone"
                />
                <mat-error
                  *ngxControlError="form.controls.cellphone; track: 'required'"
                >
                  必填
                </mat-error>
                <mat-error
                  *ngxControlError="form.controls.cellphone; track: 'pattern'"
                >
                  不正確的格式
                </mat-error>
              </mat-form-field>
            </div>
          </div>
          <div class="w-32 self-center">
            <app-primary-button [label]="isNew() ? '新增' : '更新'" />
          </div>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeEditComponent {
  readonly fb = inject(NonNullableFormBuilder);
  townQueryService = inject(TownQueryService);
  employeeQueryService = inject(EmployeeQueryService);

  form = this.fb.group({
    firstName: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
    lastName: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
    nationalId: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.pattern('^[A-Z][12]\\d{8}$'),
      ],
    }),
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
    }),
    cellphone: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(/^09\d{8}$/)],
    }),
    cityId: this.fb.control<number | undefined>(undefined, {
      validators: [Validators.required],
    }),
    townId: this.fb.control<number | undefined>(undefined, {
      validators: [Validators.required],
    }),
    addressDetail: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  chosenCityId = controlValue(this.form.controls.cityId);

  citiesQuery = injectQuery(() => this.townQueryService.queryCities());
  townsQuery = injectQuery(() =>
    this.townQueryService.queryTowns(this.chosenCityId() ?? 0),
  );

  employeeId = input.required<string>();
  employeeQueryById = injectQuery(() =>
    this.employeeQueryService.employeeQueryById(this.existEmployeeId()),
  );

  isNew = computed(() => this.employeeId() === 'new');
  existEmployeeId = computed(() => {
    return numberAttribute(this.employeeId());
  });
  chosenTownId = controlValue(this.form.controls.townId);

  createMutation = this.employeeQueryService.createMutation();
  updateMutation = this.employeeQueryService.updateMutation();

  constructor() {
    this.initializeFormEffect();
  }

  initializeFormEffect() {
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
          firstName: '',
          lastName: '',
          nationalId: '',
          email: '',
          cellphone: '',
          cityId: undefined,
          townId: undefined,
          addressDetail: '',
        });
      }
    });
  }

  submit() {
    this.trim();
    if (!this.validate()) {
      return;
    }
    if (this.isNew()) {
      this.create();
    } else {
      this.update();
    }
  }

  trim() {
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

  validate() {
    return this.form.valid;
  }

  create() {
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
      firstName,
      lastName: lastName,
      nationalId: nationalId,
      email: email,
      cellphone: cellphone,
      townId: townId ?? 0,
      addressDetail: addressDetail,
      updateEmployeeHobbies: [],
    };

    this.createMutation.mutate(input, {
      //
      onSuccess: () => {
        //
      },
    });
  }

  update() {
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
}
