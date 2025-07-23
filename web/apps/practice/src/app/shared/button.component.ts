import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  template: `
    <button
      class="w-full rounded-xl border bg-slate-100 px-5 py-2 shadow-md hover:opacity-80"
      [disabled]="disabled()"
      (click)="handleButtonClick()"
    >
      {{ label() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  label = input.required<string>();
  disabled = input<boolean>(false);
  buttonClicked = output();
  handleButtonClick() {
    this.buttonClicked.emit();
  }
}
