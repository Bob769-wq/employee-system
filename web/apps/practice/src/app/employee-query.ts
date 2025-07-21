import { inject, Injectable } from '@angular/core';
import { EmployeeApiService } from '@app/practice/shared/data-access/api';
import {
  injectMutation,
  QueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { EmployeeCreateInput } from 'web/libs/practice/shared/data-access/api/src/lib/models/employee-create-input';

import { loadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class EmployeeQueryService {
  loadingService = inject(loadingService);
  qc = inject(QueryClient);

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

  employeeQueryById = (employeeId: number) =>
    queryOptions({
      queryKey: ['employees', 'detail', employeeId],
      queryFn: () =>
        firstValueFrom(this.employeesApi.getEmployee({ employeeId })),
      enabled: !!employeeId,
    });

  createMutation = () =>
    injectMutation(() => ({
      mutationFn: (params: EmployeeCreateInput) =>
        firstValueFrom(
          this.employeesApi.createEmployee({
            body: params,
          }),
        ),
      onMutate: () => {
        this.loadingService.show();
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: ['employees'],
        });
        toast.success('產品新增成功');
      },
      onError: () => {
        toast.error('發生錯誤');
      },
      onSettled: () => {
        this.loadingService.hide();
      },
    }));
}
