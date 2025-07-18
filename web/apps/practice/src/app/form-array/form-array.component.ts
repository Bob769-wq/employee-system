import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { NgxControlError } from 'ngxtension/control-error';

interface Language {
  name: string;
  experience: string;
}
function createLanguageGroup(language?: Language) {
  return new FormGroup({
    name: new FormControl(language?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    experience: new FormControl(language?.experience ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
}

type LanguageGroup = ReturnType<typeof createLanguageGroup>;

@Component({
  selector: 'app-form-array',
  imports: [
    MatSlideToggle,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgxControlError,
    MatInputModule,
    MatIcon,
    MatDivider,
  ],
  template: `
    <h1 class="mb-8 text-5xl font-bold">Form Array</h1>
    <mat-slide-toggle [checked]="">
      <span class="pl-2 text-lg text-gray-700">
        Load languages from server:
      </span>
    </mat-slide-toggle>

    <form [formGroup]="form" class="mt-12 space-y-4" (submit)="submit()">
      <h2 class="text-lg text-gray-700">
        Please enter your experience about programming:
      </h2>
      <div formArrayName="languages">
        @for (
          languageGroup of languages.controls;
          track languageGroup;
          let i = $index
        ) {
          <div [formGroupName]="i" class="flex gap-4">
            <mat-form-field>
              <mat-label>Language</mat-label>
              <input
                matInput
                formControlName="name"
                placeholder="e.g. JavaScript"
              />
              <mat-error
                *ngxControlError="
                  languageGroup.controls.name;
                  track: 'required'
                "
              >
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Experience</mat-label>
              <input
                matInput
                formControlName="experience"
                placeholder="e.g. 5 years"
              />
              <mat-error
                *ngxControlError="
                  languageGroup.controls.experience;
                  track: 'required'
                "
              >
                Experience is required
              </mat-error>
            </mat-form-field>

            @if (languages.length > 1) {
              <button mat-icon-button type="button" (click)="removeLanguage(i)">
                <mat-icon>remove</mat-icon>
              </button>
            }
          </div>
        }

        <button
          mat-icon-button
          type="button"
          (click)="addLanguage()"
          class="text-red-700"
        >
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <mat-divider />

      <div class="flex gap-4">
        <button mat-button type="button" (click)="clear()">Clear</button>

        <button mat-flat-button>Add</button>
      </div>
    </form>
  `,
})
export class FormArrayComponent {
  readonly #fb = inject(NonNullableFormBuilder);
  readonly form = this.#fb.group({
    languages: new FormArray<LanguageGroup>([createLanguageGroup()]),
  });

  get languages() {
    return this.form.controls.languages;
  }

  addLanguage(language?: Language) {
    const languageGroup = createLanguageGroup(language);
    this.languages.push(languageGroup);
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  clear() {
    this.languages.clear();
  }

  submit() {
    this.trim();
    const error = this.validate();
    if (error) {
      alert(error);
      return;
    }

    const languages = this.languages.getRawValue();
    confirm(`Submitted languages: ${JSON.stringify(languages, null, 2)}`);
  }

  trim() {
    this.languages.controls.forEach((languageGroup) => {
      const { name, experience } = languageGroup.getRawValue();
      languageGroup.patchValue({
        //pathValue因為是修改部分
        name: name.trim(),
        experience: experience.trim(),
      });
    });
  }

  validate() {
    if (this.languages.length === 0) {
      return 'Add at least one language.';
    }
    if (this.form.invalid) {
      return 'Fill out all fields correctly.';
    }
    return '';
  }
}
