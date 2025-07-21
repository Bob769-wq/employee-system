import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="m-6">
      <a routerLink="/" class="border p-3">Home</a>
      <a routerLink="employee" class="border p-3">employee</a>
      <a routerLink="town" class="border p-3">town</a>
      <a routerLink="formArray" class="border p-3">Form Array</a>
      <a routerLink="demo" class="border p-3">Demo</a>
    </div>

    <div class="flex w-full justify-center p-12">
      <div class="w-full max-w-5xl">
        <main class="p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppComponent {}
