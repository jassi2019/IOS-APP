import api from '@/lib/api';
import { TApiPromise, TMutationOpts, TQueryOpts } from '@/types/api';
import { TFavorite } from '@/types/Favorite';
import { TTopic } from '@/types/Topic';
import { TUser } from '@/types/User';
import { useMutation, useQuery } from '@tanstack/react-query';

const getFavorites = (): TApiPromise<TFavorite[]> => {
  return api.get('/api/v1/favorites');
};

const addToFavorites = (data: {
  topicId: TTopic['id'];
  userId: TUser['id'];
}): TApiPromise<TFavorite> => {
  return api.post('/api/v1/favorites', data);
};

const removeFromFavorites = (favoriteId: string): TApiPromise<void> => {
  return api.delete(`/api/v1/favorites/${favoriteId}`);
};

export const useGetFavorites = (options?: TQueryOpts<TFavorite[]>) => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    ...options,
  });
};

export const useAddToFavorites = (
  options?: TMutationOpts<{ topicId: TTopic['id']; userId: TUser['id'] }, TFavorite>
) => {
  return useMutation({
    mutationFn: (data: { topicId: TTopic['id']; userId: TUser['id'] }) => addToFavorites(data),
    ...options,
  });
};

export const useRemoveFromFavorites = (options?: TMutationOpts<string, void>) => {
  return useMutation({
    mutationFn: (favoriteId: string) => removeFromFavorites(favoriteId),
    ...options,
  });
};
