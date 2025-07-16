import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgxSonnerToaster],
  template: `
    <app-header />
    <router-outlet />
    <ngx-sonner-toaster
      duration="3000"
      position="bottom-right"
      richColors
      closeButton
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
