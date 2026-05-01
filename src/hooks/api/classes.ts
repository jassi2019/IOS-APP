import api from '@/lib/api';
import { TApiPromise, TQueryOpts } from '@/types/api';
import { TClass } from '@/types/Class';
import { useQuery } from '@tanstack/react-query';

const getAllClasses = (): TApiPromise<TClass[]> => {
  return api.get('/api/v1/classes');
};

export const useGetAllClasses = (options?: TQueryOpts<TClass[]>) => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: getAllClasses,
    ...options,
  });
};
