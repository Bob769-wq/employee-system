import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injectable,
  numberAttribute,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { injectSelectionModel } from '@app/common/signal/ui/selection-model';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ngxpaginationmodule } from 'ngx-pagination';
