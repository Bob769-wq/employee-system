import { inject, Injectable } from '@angular/core';
import { TownApiService } from '@app/practice/shared/data-access/api';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TownQueryService {
  townsApi = inject(TownApiService);
  queryTowns = (param: { cityId: number }) =>
    queryOptions({
      queryKey: ['towns', 'list', param],
      queryFn: () =>
        firstValueFrom(
          this.townsApi.getTowns({
            cityId: param.cityId,
          }),
        ),
    });
}
