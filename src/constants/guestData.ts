import rawData from './guestData.json';
import { TChapter } from '@/types/Chapter';
import { TSubject } from '@/types/Subject';
import { TTopic } from '@/types/Topic';
import { TClass } from '@/types/Class';

type GuestData = {
  generatedAt: string;
  baseUrl: string;
  subjects: TSubject[];
  classes: TClass[];
  chapters: TChapter[];
  freeTopics: TTopic[];
};

export const guestData = rawData as GuestData;

export const getGuestSubjects = (): TSubject[] => guestData.subjects || [];
export const getGuestClasses = (): TClass[] => guestData.classes || [];
export const getGuestChapters = (): TChapter[] => guestData.chapters || [];
export const getGuestFreeTopics = (): TTopic[] => guestData.freeTopics || [];

const getFreeTopicSubjectIds = (): Set<string> => {
  return new Set((guestData.freeTopics || []).map((topic) => topic.Subject?.id).filter(Boolean));
};

const getFreeTopicChapterIds = (): Set<string> => {
  return new Set((guestData.freeTopics || []).map((topic) => topic.Chapter?.id).filter(Boolean));
};

const getFreeTopicClassIds = (): Set<string> => {
  return new Set(
    (guestData.freeTopics || [])
      .map((topic) => topic.classId || topic.Chapter?.classId)
      .filter(Boolean)
  );
};

const getFreeTopicClassIdsBySubject = (subjectId: string): Set<string> => {
  return new Set(
    (guestData.freeTopics || [])
      .filter((topic) => topic.Subject?.id === subjectId)
      .map((topic) => topic.classId || topic.Chapter?.classId)
      .filter(Boolean)
  );
};

export const getGuestSubjectsWithFreeTopics = (): TSubject[] => {
  const subjectIds = getFreeTopicSubjectIds();
  return (guestData.subjects || []).filter((subject) => subjectIds.has(subject.id));
};

export const getGuestClassesWithFreeTopics = (): TClass[] => {
  const classIds = getFreeTopicClassIds();
  return (guestData.classes || []).filter((cls) => classIds.has(cls.id));
};

export const getGuestClassesForSubjectWithFreeTopics = (subjectId: string): TClass[] => {
  const classIds = getFreeTopicClassIdsBySubject(subjectId);
  return (guestData.classes || []).filter((cls) => classIds.has(cls.id));
};

export const getGuestChaptersWithFreeTopics = (
  subjectId: string,
  classId: string | null
): TChapter[] => {
  const chapterIds = getFreeTopicChapterIds();
  return (guestData.chapters || []).filter(
    (chapter) =>
      chapterIds.has(chapter.id) &&
      chapter.subjectId === subjectId &&
      (!classId || chapter.classId === classId)
  );
};

export const getGuestChaptersBySubjectAndClass = (
  subjectId: string,
  classId: string | null
): TChapter[] => {
  return (guestData.chapters || []).filter(
    (chapter) => chapter.subjectId === subjectId && (!classId || chapter.classId === classId)
  );
};

export const getGuestTopicsByChapterAndSubject = (
  chapterId: string,
  subjectId: string
): TTopic[] => {
  return (guestData.freeTopics || []).filter(
    (topic) => topic.Chapter?.id === chapterId && topic.Subject?.id === subjectId
  );
};
