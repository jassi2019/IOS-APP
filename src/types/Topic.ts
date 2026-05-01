import { TChapter } from './Chapter';
import { TSubject } from './Subject';

export type TTopic = {
  id: string;
  name: string;
  description: string;
  contentURL: string;
  contentThumbnail: string;
  explanationContent?: string;
  revisionContent?: string;
  hiddenLinksContent?: string;
  exerciseRevivalContent?: string;
  masterExemplarContent?: string;
  pyqContent?: string;
  chapterCheckpointContent?: string;
  sequence: number;
  serviceType: 'FREE' | 'PREMIUM';
  Chapter: TChapter;
  Subject: TSubject;
  createdAt: string;
  updatedAt: string;
};
