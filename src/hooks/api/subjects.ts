import api from '@/lib/api';
import { TApiPromise, TQueryOpts } from '@/types/api';
import { TSubject } from '@/types/Subject';
import { useQuery } from '@tanstack/react-query';

const getAllSubjects = (): TApiPromise<TSubject[]> => {
  return api.get('/api/v1/subjects');
};

const getSubjectBySubjectId = (subjectId: string): TApiPromise<TSubject> => {
  return api.get(`/api/v1/subjects/${subjectId}`);
};

export const useGetAllSubjects = (options?: TQueryOpts<TSubject[]>) => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: getAllSubjects,
    ...options,
  });
};

export const useGetSubjectById = (subjectId: string, options?: TQueryOpts<TSubject>) => {
  return useQuery({
    queryKey: ['subjects', subjectId],
    queryFn: () => getSubjectBySubjectId(subjectId),
    ...options,
  });
};
