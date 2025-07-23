import { inject, Injectable } from '@angular/core';
import { TownApiService } from '@app/practice/shared/data-access/api';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TownQueryService {
  townsService = inject(TownApiService);

  queryCities = () =>
    queryOptions({
      queryKey: ['cities', 'list'],
      queryFn: () => firstValueFrom(this.townsService.getCities()),
    });

  queryTowns = (cityId: number) =>
    queryOptions({
      queryKey: ['towns', 'list', cityId],
      queryFn: () =>
        firstValueFrom(
          this.townsService.getTowns({
            cityId,
          }),
        ),
      enabled: !!cityId,
    });
}
