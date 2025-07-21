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
import { EmployeeUpdateInput } from 'web/libs/practice/shared/data-access/api/src/lib/models/employee-update-input';

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
        toast.success('人員新增成功');
      },
      onError: () => {
        toast.error('發生錯誤');
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
        firstValueFrom(this.employeesApi.updateEmployee({ employeeId, body })),
      onMutate: () => {
        this.loadingService.show();
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: ['employees'],
        });
        toast.success('人員更新成功');
      },
      onError: () => {
        toast.error('發生錯誤');
      },
      onSettled: () => {
        this.loadingService.hide();
      },
    }));

  deleteMutation = () =>
    injectMutation(() => ({
      mutationFn: (employeeId: number) =>
        firstValueFrom(this.employeesApi.deleteEmployee({ employeeId })),
      onMutate: () => {
        this.loadingService.show();
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: ['employees'],
        });
        toast.success('人員刪除成功');
      },
      onError: () => {
        toast.error('發生錯誤');
      },
      onSettled: () => {
        this.loadingService.hide();
      },
    }));
}
