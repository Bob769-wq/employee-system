import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxControlError } from 'ngxtension/control-error';

@Component({
  selector: 'app-employee-demo',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxControlError,
  ],
  template: `
    <form [formGroup]="employeeForm" (submit)="submit()">
      <div class="flex gap-4">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input type="text" matInput formControlName="name" />
          <mat-error
            *ngxControlError="employeeForm.controls.name; track: 'required'"
          >
            Name is required
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Phone</mat-label>
          <input type="text" matInput formControlName="cellphone" />
          <mat-error
            *ngxControlError="
              employeeForm.controls.cellphone;
              track: 'required'
            "
          >
            Phone is required
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input type="email" matInput formControlName="email" />
          <mat-error
            *ngxControlError="employeeForm.controls.email; track: 'required'"
          >
            Email is required
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>ID</mat-label>
          <input type="text" matInput formControlName="nationalID" />
          <mat-error
            *ngxControlError="
              employeeForm.controls.nationalID;
              track: 'required'
            "
          >
            NationID is required
          </mat-error>
        </mat-form-field>
      </div>
      <button class="mx-2 p-2 outline">Submit</button>
    </form>
  `,
})
export class EmployeeDemoComponent {
  readonly fb = inject(NonNullableFormBuilder);

  employeeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    cellphone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    nationalID: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit() {
    this.trim();
    if (!this.validate()) {
      return;
    }
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
    }
  }

  trim() {
    const { name, cellphone, email, nationalID } =
      this.employeeForm.getRawValue();
    this.employeeForm.patchValue({
      name: name.trim(),
      cellphone: cellphone.trim(),
      email: email.trim(),
      nationalID: nationalID.trim(),
    });
  }

  validate(): boolean {
    if (this.employeeForm.invalid) {
      alert('Fill out all fields correctly.');
      return false;
    }
    return true;
  }
}
