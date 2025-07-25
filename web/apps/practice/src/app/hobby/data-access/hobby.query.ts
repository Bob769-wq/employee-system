import { inject, Injectable } from '@angular/core';
import { HobbyApiService } from '@app/practice/shared/data-access/api';
import {
  injectMutation,
  QueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';
import { GetHobbies$Params } from 'web/libs/practice/shared/data-access/api/src/lib/fn/hobby-api/get-hobbies';
import { HobbyCreateInput } from 'web/libs/practice/shared/data-access/api/src/lib/models/hobby-create-input';
import { HobbyUpdateInput } from 'web/libs/practice/shared/data-access/api/src/lib/models/hobby-update-input';

import { handleErrorMessage } from '../../shared/error-handling';
import { LoadingService } from '../../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class HobbiesQueryService {
  hobbyService = inject(HobbyApiService);
  loadingService = inject(LoadingService);
  qc = inject(QueryClient);

  hobbiesQuery = (params?: GetHobbies$Params) =>
    queryOptions({
      queryKey: ['hobbies', 'list', params],
      queryFn: () =>
        firstValueFrom(
          this.hobbyService.getHobbies({
            pageSize: params?.pageSize,
            page: params?.page,
            orderBy: params?.orderBy,
            searchText: params?.searchText,
          }),
        ),
    });

  hobbyQueryById = (hobbyId: number) =>
    queryOptions({
      queryKey: ['hobbies', 'detail', hobbyId],
      queryFn: () => firstValueFrom(this.hobbyService.getHobby({ hobbyId })),
    });

  createMutation = () =>
    injectMutation(() => ({
      mutationFn: (params: HobbyCreateInput) =>
        firstValueFrom(
          this.hobbyService.createHobby({
            body: params,
          }),
        ),
      onMutate: () => {
        this.loadingService.show();
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: ['hobbies'],
        });
        toast.success('興趣新增成功');
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
        hobbyId,
        body,
      }: {
        hobbyId: number;
        body: HobbyUpdateInput;
      }) => firstValueFrom(this.hobbyService.updateHobby({ hobbyId, body })),
      onMutate: () => {
        this.loadingService.show();
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: ['hobbies'],
        });
        toast.success('興趣更新成功');
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
      mutationFn: (hobbyId: number) =>
        firstValueFrom(this.hobbyService.deleteHobby({ hobbyId })),
      onMutate: () => {
        this.loadingService.show();
      },
      onSuccess: async () => {
        await this.qc.invalidateQueries({
          queryKey: ['hobbies'],
        });
        toast.success('興趣刪除成功');
      },
      onError: (error) => {
        toast.error(handleErrorMessage(error));
      },
      onSettled: () => {
        this.loadingService.hide();
      },
    }));
}
