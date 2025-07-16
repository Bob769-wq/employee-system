import { inject, Injectable } from '@angular/core';
import {
  injectMutation,
  QueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';

import { GetEmployees$Params } from '../../shared/data-access/api/fn/employee-api/get-employees';
import { EmployeeCreateInput } from '../../shared/data-access/api/models/employee-create-input';
import { EmployeeUpdateInput } from '../../shared/data-access/api/models/employee-update-input';
import { EmployeeApiService } from '../../shared/data-access/api/services';
import { handleErrorMessage } from '../../shared/error-handling';
import { LoadingService } from '../../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeesQueryService {
  #employeeService = inject(EmployeeApiService);
  #loadingService = inject(LoadingService);
  #qc = inject(QueryClient);

  employeesQuery = (params?: GetEmployees$Params) =>
    queryOptions({
      queryKey: ['employees', 'list', params],
      queryFn: () =>
        firstValueFrom(
          this.#employeeService.getEmployees({
            pageSize: params?.pageSize,
            page: params?.page,
            orderBy: params?.orderBy,
          }),
        ),
    });

  employeeQueryById = (employeeId: number) =>
    queryOptions({
      queryKey: ['employees', 'detail', employeeId],
      queryFn: () =>
        firstValueFrom(this.#employeeService.getEmployee({ employeeId })),
    });

  createMutation = () =>
    injectMutation(() => ({
      mutationFn: (params: EmployeeCreateInput) =>
        firstValueFrom(
          this.#employeeService.createEmployee({
            body: params,
          }),
        ),
      onMutate: () => {
        this.#loadingService.show();
      },
      onSuccess: async () => {
        await this.#qc.invalidateQueries({
          queryKey: ['employees'],
        });
        toast.success('員工新增成功');
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error));
      },
      onSettled: () => {
        this.#loadingService.hide();
      },
    }));

  updateMutation = () =>
    injectMutation(() => ({
      mutationFn: ({
        employeeId,
        body,
      }: {
        employeeId: number;
        body: EmployeeUpdateInput;
      }) =>
        firstValueFrom(
          this.#employeeService.updateEmployee({ employeeId, body }),
        ),
      onMutate: () => {
        this.#loadingService.show();
      },
      onSuccess: async () => {
        await this.#qc.invalidateQueries({
          queryKey: ['employees'],
        });
        toast.success('員工更新成功');
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error));
      },
      onSettled: () => {
        this.#loadingService.hide();
      },
    }));

  deleteMutation = () =>
    injectMutation(() => ({
      mutationFn: (employeeId: number) =>
        firstValueFrom(this.#employeeService.deleteEmployee({ employeeId })),
      onMutate: () => {
        this.#loadingService.show();
      },
      onSuccess: async () => {
        await this.#qc.invalidateQueries({
          queryKey: ['employees'],
        });
        toast.success('員工刪除成功');
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error));
      },
      onSettled: () => {
        this.#loadingService.hide();
      },
    }));
}
