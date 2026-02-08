import { TChapter } from './Chapter';
import { TSubject } from './Subject';

export type TTopic = {
  id: string;
  name: string;
  description: string;
  contentURL: string;
  contentThumbnail: string;
  sequence: number;
  serviceType: 'FREE' | 'PREMIUM';
  Chapter: TChapter;
  Subject: TSubject;
  createdAt: string;
  updatedAt: string;
};
