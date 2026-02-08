import api from '@/lib/api';
import { TApiPromise, TQueryOpts } from '@/types/api';
import { TChapter } from '@/types/Chapter';
import { useQuery } from '@tanstack/react-query';

const getChaptersBySubjectId = (subjectId: string, classId: string): TApiPromise<TChapter[]> => {
  return api.get(`/api/v1/chapters`, {
    params: {
      subjectId,
      classId,
    },
  });
};

export const useGetChaptersBySubjectId = (
  { subjectId, classId }: { subjectId: string; classId: string },
  options?: TQueryOpts<TChapter[]>
) => {
  return useQuery({
    queryKey: ['chapters', subjectId, classId],
    queryFn: () => getChaptersBySubjectId(subjectId, classId),
    ...options,
  });
};
