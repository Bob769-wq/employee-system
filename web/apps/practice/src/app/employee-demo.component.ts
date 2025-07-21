import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-employee-demo',
  imports: [MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="employeeForm" (submit)="submit()">
      <div class="flex gap-4">
        <mat-form-field>
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Phone</mat-label>
          <input matInput formControlName="cellphone" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>ID</mat-label>
          <input matInput formControlName="ID" />
        </mat-form-field>
      </div>
      <button class="mx-2 p-2 outline">Submit</button>
    </form>
  `,
})
export class EmployeeDemoComponent {
  employeeForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cellphone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    ID: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submit() {
    this.trim();
    this.validate();
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
    }
  }

  trim() {
    const formValue = this.employeeForm.getRawValue();
    this.employeeForm.patchValue({
      name: formValue.name.trim(),
      cellphone: formValue.cellphone.trim(),
      email: formValue.email.trim(),
      ID: formValue.ID.trim(),
    });
  }

  validate() {
    if (this.employeeForm.invalid) {
      alert('Fill out all fields correctly.');
    }
    return '';
  }
}
