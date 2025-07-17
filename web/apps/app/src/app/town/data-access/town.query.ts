import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

import { GetCities$Params } from '../../shared/data-access/api/fn/town-api/get-cities';
import { TownApiService } from '../../shared/data-access/api/services';

@Injectable({
  providedIn: 'root',
})
export class EmployeesQueryService {
  #townService = inject(TownApiService);
  // #loadingService = inject(LoadingService);
  // #qc = inject(QueryClient);

  citiesQuery = (params?: GetCities$Params) =>
    queryOptions({
      queryKey: ['cities', 'list', params],
      queryFn: () => firstValueFrom(this.#townService.getCities({})),
    });

  townsQuery = (cityId: number) =>
    queryOptions({
      queryKey: ['towns', 'list', cityId],
      queryFn: () => firstValueFrom(this.#townService.getTowns({ cityId })),
    });
}
