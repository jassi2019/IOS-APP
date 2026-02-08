import api from '@/lib/api';
import { TApiPromise, TMutationOpts } from '@/types/api';
import { useMutation } from '@tanstack/react-query';

const createSubscription = (data: {
  paymentId: string;
  orderId: string;
  signature: string;
  planId: string;
}): TApiPromise => {
  return api.post(`/api/v1/subscriptions`, {
    ...data,
  });
};

export const useCreateSubscription = (
  options?: TMutationOpts<{
    paymentId: string;
    orderId: string;
    signature: string;
    planId: string;
  }>
) => {
  return useMutation({
    mutationKey: ['create-subscription'],
    mutationFn: createSubscription,
    ...options,
  });
};
