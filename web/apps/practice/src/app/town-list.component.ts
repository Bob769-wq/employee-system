import { Component, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { TownQueryService } from './town-query';

@Component({
  selector: 'app-town-list',
  imports: [],
  template: `
    @if (townQuery.isPending()) {
      Loading...
    }
    @if (townQuery.error()) {
      ERROR!
    }
    @if (townQuery.data(); as towns) {
      @for (town of towns; track town.id) {
        {{ town.city.name }}
      }
    }
  `,
})
export class TownListComponent {
  townQueryService = inject(TownQueryService);
  cityId = signal<number>(1);

  townQuery = injectQuery(() =>
    this.townQueryService.queryTowns({
      cityId: this.cityId(),
    }),
  );
}
