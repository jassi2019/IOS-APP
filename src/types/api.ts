import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

export type TApiPromise<TData = undefined> = Promise<TSuccess<TData>> | Promise<TError>;

export type TQueryOpts<TResponse = undefined> = Omit<
  UseQueryOptions<TSuccess<TResponse>, TError>,
  'queryKey' | 'queryFn'
>;

export type TMutationOpts<TVariables = void, TResponse = undefined> = Omit<
  UseMutationOptions<TSuccess<TResponse>, TError, TVariables>,
  'mutationKey' | 'mutationFn'
>;

export type TSuccess<TData = undefined> = {
  message: string;
  data?: TData;
  pagination?: TPaginationResponse;
};

export type TError = {
  message: string;
  status_code: number;
};

export type TPaginationQParams = {
  page?: number;
  limit?: number;
};

export type TPaginationResponse = {
  page: number;
  limit: number;
  total_pages: number;
  total_count: number;
};
