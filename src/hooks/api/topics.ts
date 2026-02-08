import { TTopic } from '@/types/Topic';

import { TApiPromise, TMutationOpts, TQueryOpts } from '@/types/api';

import api from '@/lib/api';
import { TLastRead } from '@/types/LastRead';
import { useMutation, useQuery } from '@tanstack/react-query';

type TGetTopicsParams = {
  chapterId: string;
  subjectId: string;
};

const getTopicsByChapterIdAndSubjectId = (params: TGetTopicsParams): TApiPromise<TTopic[]> => {
  return api.get(`/api/v1/topics`, { params });
};

const getFreeTopics = (): TApiPromise<TTopic[]> => {
  return api.get(`/api/v1/topics/free`);
};

const getTopicByTopicId = (topicId: string): TApiPromise<TTopic> => {
  return api.get(`/api/v1/topics/${topicId}`);
};

const markTopicAsLastRead = (topicId: string): TApiPromise<TTopic> => {
  // Validate topicId before making API call
  if (!topicId || typeof topicId !== 'string' || topicId.trim() === '') {
    return Promise.reject(new Error('Invalid topicId: topicId must be a non-empty string'));
  }

  return api.post(`/api/v1/lastreads`, { topicId });
};

const getLastReadTopic = (): TApiPromise<TLastRead> => {
  return api.get(`/api/v1/lastreads`);
};

export const useGetTopicsByChapterIdAndSubjectId = (
  data: TGetTopicsParams,
  options?: TQueryOpts<TTopic[]>
) => {
  return useQuery({
    queryKey: ['topics', data.chapterId, data.subjectId],
    queryFn: () => getTopicsByChapterIdAndSubjectId(data),
    ...options,
  });
};

export const useGetLastReadTopic = (options?: TQueryOpts<TLastRead>) => {
  return useQuery({
    queryKey: ['last-read-topic'],
    queryFn: () => getLastReadTopic(),
    ...options,
  });
};

export const useGetTopicById = (topicId: string, options?: TQueryOpts<TTopic>) => {
  return useQuery({
    queryKey: ['topics', topicId],
    queryFn: () => getTopicByTopicId(topicId),
    ...options,
  });
};

export const useMarkTopicAsLastRead = (options?: TMutationOpts<string, TTopic>) => {
  return useMutation({
    mutationKey: ['mark-topic-as-last-read'],
    mutationFn: (topicId: string) => markTopicAsLastRead(topicId),
    ...options,
  });
};

export const useGetFreeTopics = (options?: TQueryOpts<TTopic[]>) => {
  return useQuery({
    queryKey: ['free-topics'],
    queryFn: () => getFreeTopics(),
    ...options,
  });
};
