import api from '@/lib/api';
import { TApiPromise, TQueryOpts } from '@/types/api';
import { TPlan } from '@/types/Plan';
import { useQuery } from '@tanstack/react-query';

const getAllPlans = (): TApiPromise<TPlan[]> => {
  return api.get('/api/v1/plans');
};

export const useGetAllPlans = (options?: TQueryOpts<TPlan[]>) => {
  return useQuery({
    queryKey: ['useGetAllPlans'],
    queryFn: getAllPlans,
    ...options,
  });
};
