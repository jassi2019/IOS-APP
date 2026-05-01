import { TChapter } from './Chapter';
import { TClass } from './Class';
import { TSubject } from './Subject';

export type TQuestion = {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string | null;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  marks: string;
  sequence: number;
  chapterId: string;
  subjectId: string;
  classId: string;
  Chapter?: TChapter;
  Subject?: TSubject;
  Class?: TClass;
  createdAt: string;
  updatedAt: string;
};

export type TCreateQuestionInput = {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  marks?: string;
  sequence?: number;
  chapterId: string;
  subjectId: string;
  classId: string;
};

export type TUpdateQuestionInput = Partial<TCreateQuestionInput>;
