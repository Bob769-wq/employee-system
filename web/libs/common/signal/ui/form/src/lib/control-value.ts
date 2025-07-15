import { Injector, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { assertInjector } from 'ngxtension/assert-injector';
import { map } from 'rxjs';

export function controlValue<
  TValue = unknown,
  TRawValue extends TValue = TValue,
>(
  control: AbstractControl<TValue, TRawValue>,
  { injector }: { injector?: Injector } = {},
) {
  injector = assertInjector(controlValue, injector);
  return runInInjectionContext(injector, () => {
    return toSignal(
      control.valueChanges.pipe(map(() => control.getRawValue() as TRawValue)),
      {
        initialValue: control.getRawValue() as TRawValue,
      },
    );
  });
}
