import api from "@/lib/api";
import { TApiPromise, TMutationOpts } from "@/types/api";
import { TLog } from "@/types/Log";
import { useMutation } from "@tanstack/react-query";

const sendLogReport = (log: TLog): TApiPromise<TLog> => {
  return api.post(`/api/v1/logs/send`, log);
};

export const useSendLogReport = (options?: TMutationOpts<TLog, TLog>) => {
  return useMutation({
    mutationFn: sendLogReport,
    ...options,
  });
};
