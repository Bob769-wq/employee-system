import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-primary-button',
  imports: [CommonModule],
  template: `
    <button
      class="w-full rounded-xl border bg-blue-500 px-5 py-2 text-white shadow-md hover:opacity-80 disabled:bg-gray-300 disabled:hover:opacity-100"
      [disabled]="disabled()"
      (click)="handleButtonClick()"
    >
      {{ label() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryButtonComponent {
  label = input.required<string>();
  disabled = input<boolean>(false);

  buttonClicked = output();

  handleButtonClick() {
    this.buttonClicked.emit();
  }
}
