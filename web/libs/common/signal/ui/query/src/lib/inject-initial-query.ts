import { Injector, runInInjectionContext } from '@angular/core';
import {
  CreateQueryOptions,
  DefaultError,
  injectQuery,
  QueryKey,
} from '@tanstack/angular-query-experimental';
import { assertInjector } from 'ngxtension/assert-injector';

export function injectInitialQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  optionsFn: () => CreateQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  { injector }: { injector?: Injector } = {},
) {
  injector = assertInjector(injectInitialQuery, injector);
  return runInInjectionContext(injector, () => {
    return injectQuery(() => ({
      ...optionsFn(),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      gcTime: 0,
    }));
  });
}
