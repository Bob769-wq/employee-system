import { SelectionModel } from '@angular/cdk/collections';
import { computed, signal } from '@angular/core';

export function injectSelectionModel<T>(
  multiple?: boolean,
  initiallySelectedValues?: T[],
  emitChanges?: boolean,
  compareWith?: ((o1: T, o2: T) => boolean) | undefined,
) {
  const model = signal(
    new SelectionModel<T>(
      multiple,
      initiallySelectedValues,
      emitChanges,
      compareWith,
    ),
    {
      equal: () => false,
    },
  );

  return {
    selected: computed(() => model().selected),
    changed: model().changed,
    select(...values: T[]) {
      let selectionChanged = false;
      model.update((m) => {
        selectionChanged = m.select(...values) ?? false;
        return m;
      });
      return selectionChanged;
    },
    deselect(...values: T[]) {
      let selectionChanged = false;
      model.update((m) => {
        selectionChanged = m.deselect(...values) ?? false;
        return m;
      });
      return selectionChanged;
    },
    setSelection(...values: T[]) {
      let selectionChanged = false;
      model.update((m) => {
        selectionChanged = m.setSelection(...values) ?? false;
        return m;
      });
      return selectionChanged;
    },
    toggle(value: T) {
      let selectionChanged = false;
      model.update((m) => {
        selectionChanged = m.toggle(value) ?? false;
        return m;
      });
      return selectionChanged;
    },
    clear(flushEvent?: boolean) {
      let selectionChanged = false;
      model.update((m) => {
        selectionChanged = m.clear(flushEvent) ?? false;
        return m;
      });
      return selectionChanged;
    },
    isSelected(value: T) {
      return computed(() => model().isSelected(value));
    },
    isEmpty: computed(() => model().isEmpty()),
    hasValue: computed(() => model().hasValue()),
    sort: (compareFn?: (a: T, b: T) => number) => {
      model.update((m) => {
        m.sort(compareFn);
        return m;
      });
    },
    isMultipleSelection: computed(() => model().isMultipleSelection()),
  };
}
