import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { ButtonComponent } from '../shared/button.component';
import { PrimaryButtonComponent } from '../shared/primary-button.component';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    PrimaryButtonComponent,
    ButtonComponent,
    RouterLink,
    MatIconModule,
    MatIconButton,
  ],
  template: `
    <div
      class="flex items-center justify-between bg-slate-100 px-4 py-3 shadow-md"
    >
      <div class="flex gap-4">
        <button mat-icon-button routerLink="/">
          <mat-icon>home</mat-icon>
        </button>
        <app-button routerLink="/employees/new/edit" label="新增人員" />
      </div>

      <app-primary-button [label]="'Click'" />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
