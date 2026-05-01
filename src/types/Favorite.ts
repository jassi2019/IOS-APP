import { TTopic } from './Topic';

export type TFavorite = {
  id: string;
  userId: string;
  Topic: TTopic;
  createdAt: string;
  updatedAt: string;
};
