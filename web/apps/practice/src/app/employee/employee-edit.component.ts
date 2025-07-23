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
  selector: 'app-edit-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxControlError,
  ],
  template: ` <form [formGroup]="editForm"></form> `,
})
export class EditComponent {
  readonly fb = inject(NonNullableFormBuilder);
  editForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    cellphone: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
    ID: this.fb.control('', [Validators.required]),
  });
}
