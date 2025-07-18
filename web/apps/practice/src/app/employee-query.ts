import { inject, Injectable } from '@angular/core';
import { EmployeeApiService } from '@app/practice/shared/data-access/api';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeQueryService {
  employeesApi = inject(EmployeeApiService);
  queryEmployees = (param: { page: number; pageSize: number }) =>
    queryOptions({
      queryKey: ['employees', 'list', param],
      queryFn: () =>
        firstValueFrom(
          this.employeesApi.getEmployees({
            page: param.page,
            pageSize: param.pageSize,
          }),
        ),
    });
}
