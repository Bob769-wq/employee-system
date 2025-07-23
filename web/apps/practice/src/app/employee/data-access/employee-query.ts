import { inject, Injectable } from '@angular/core';
import { EmployeeApiService } from '@app/practice/shared/data-access/api';
import {
  injectMutation,
  QueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { GetEmployees$Params } from 'web/libs/practice/shared/data-access/api/src/lib/fn/employee-api/get-employees';
import { EmployeeCreateInput } from 'web/libs/practice/shared/data-access/api/src/lib/models/employee-create-input';
import { EmployeeUpdateInput } from 'web/libs/practice/shared/data-access/api/src/lib/models/employee-update-input';

import { handleErrorMessage } from '../../shared/error-handling';
import { LoadingService } from '../../shared/services/loading.service';

@Injectable({ providedIn: 'root' })
export class EmployeeQueryService {
  employeesService = inject(EmployeeApiService);
  loadingService = inject(LoadingService);
  qc = inject(QueryClient);

  queryEmployees = (params?: GetEmployees$Params) =>
    queryOptions({
      queryKey: ['employees', 'list', params],
      queryFn: () =>
        firstValueFrom(
          this.employeesService.getEmployees({
            page: params?.page,
            pageSize: params?.pageSize,
            orderBy: params?.orderBy,
          }),
        ),
    });

  employeeQueryById = (employeeId: number) =>
    queryOptions({
      queryKey: ['employees', 'detail', employeeId],
      queryFn: () =>
        firstValueFrom(this.employeesService.getEmployee({ employeeId })),
      enabled: !!employeeId,
    });

  createMutation = () =>
    injectMutation(() => ({
      mutationFn: (params: EmployeeCreateInput) =>
        // mutationFn: (params: {
        //   addressDetail: string;
        //   cellphone: string;
        //   email: string;
        //   firstName: string;
        //   lastName: string;
        //   nationalId: string;
        //   townId: number;
        //   updateEmployeeHobbies: Array<UpdateEmployeeHobby>;
        // }) =>
        firstValueFrom(
          this.employeesService.createEmployee({
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
        toast.success('人員新增成功');
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error));
      },
      onSettled: () => {
        this.loadingService.hide();
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
          this.employeesService.updateEmployee({ employeeId, body }),
        ),
      onMutate: () => {
        this.loadingService.show();
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: ['employees'],
        });
        toast.success('人員更新成功');
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error));
      },
      onSettled: () => {
        this.loadingService.hide();
      },
    }));

  deleteMutation = () =>
    injectMutation(() => ({
      mutationFn: (employeeId: number) =>
        firstValueFrom(this.employeesService.deleteEmployee({ employeeId })),
      onMutate: () => {
        this.loadingService.show();
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: ['employees'],
        });
        toast.success('人員刪除成功');
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error));
      },
      onSettled: () => {
        this.loadingService.hide();
      },
    }));
}
