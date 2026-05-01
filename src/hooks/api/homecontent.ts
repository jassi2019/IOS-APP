import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useGetHomeContent = (section?: string) => {
  return useQuery({
    queryKey: ['home-content', section],
    queryFn: async () => {
      const params = section ? `?section=${section}` : '';
      const res = await api.get(`/api/v1/home-content${params}`);
      return res.data;
    },
    staleTime: 30 * 1000, // 30s — quick reflect of admin toggles
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
