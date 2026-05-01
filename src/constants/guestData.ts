import rawData from './guestData.json';
import type { TChapter } from '@/types/Chapter';
import type { TSubject } from '@/types/Subject';
import type { TTopic } from '@/types/Topic';
import type { TClass } from '@/types/Class';

type GuestData = {
  generatedAt: string;
  baseUrl: string;
  subjects: TSubject[];
  classes: TClass[];
  chapters: TChapter[];
  freeTopics: TTopic[];
};

type RawFreeTopic = (typeof rawData)['freeTopics'][number];

const normalizeServiceType = (serviceType: RawFreeTopic['serviceType']): TTopic['serviceType'] => {
  return serviceType === 'PREMIUM' ? 'PREMIUM' : 'FREE';
};

const normalizeFreeTopic = (
  topic: RawFreeTopic,
  chapterById: Map<string, TChapter>,
  subjectById: Map<string, TSubject>
): TTopic => {
  const chapter: TChapter =
    chapterById.get(topic.chapterId) ??
    ({
      id: topic.chapterId,
      name: topic.Chapter?.name ?? 'Chapter',
      number: topic.Chapter?.number ?? 0,
      description: '',
      subjectId: topic.subjectId,
      classId: topic.classId,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    } satisfies TChapter);

  const subject: TSubject =
    subjectById.get(topic.subjectId) ??
    ({
      id: topic.subjectId,
      name: topic.Subject?.name ?? 'Subject',
      description: '',
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    } satisfies TSubject);

  return {
    id: topic.id,
    name: topic.name,
    description: topic.description,
    contentURL: topic.contentURL,
    contentThumbnail: topic.contentThumbnail,
    sequence: topic.sequence,
    serviceType: normalizeServiceType(topic.serviceType),
    Chapter: chapter,
    Subject: subject,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
  };
};

const chapterById = new Map<string, TChapter>((rawData.chapters || []).map((c) => [c.id, c]));
const subjectById = new Map<string, TSubject>((rawData.subjects || []).map((s) => [s.id, s]));

export const guestData: GuestData = {
  generatedAt: rawData.generatedAt,
  baseUrl: rawData.baseUrl,
  subjects: rawData.subjects || [],
  classes: rawData.classes || [],
  chapters: rawData.chapters || [],
  freeTopics: (rawData.freeTopics || []).map((topic) =>
    normalizeFreeTopic(topic, chapterById, subjectById)
  ),
};

export const getGuestSubjects = (): TSubject[] => guestData.subjects || [];
export const getGuestClasses = (): TClass[] => guestData.classes || [];
export const getGuestChapters = (): TChapter[] => guestData.chapters || [];
export const getGuestFreeTopics = (): TTopic[] => guestData.freeTopics || [];

const getFreeTopicSubjectIds = (): Set<string> => {
  return new Set((guestData.freeTopics || []).map((topic) => topic.Subject.id).filter(Boolean));
};

const getFreeTopicChapterIds = (): Set<string> => {
  return new Set((guestData.freeTopics || []).map((topic) => topic.Chapter.id).filter(Boolean));
};

const getFreeTopicClassIds = (): Set<string> => {
  return new Set(
    (guestData.freeTopics || [])
      .map((topic) => topic.Chapter.classId)
      .filter(Boolean)
  );
};

const getFreeTopicClassIdsBySubject = (subjectId: string): Set<string> => {
  return new Set(
    (guestData.freeTopics || [])
      .filter((topic) => topic.Subject.id === subjectId)
      .map((topic) => topic.Chapter.classId)
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
    (topic) => topic.Chapter.id === chapterId && topic.Subject.id === subjectId
  );
};
