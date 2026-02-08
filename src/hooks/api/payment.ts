import api from '@/lib/api';
import { TApiPromise, TMutationOpts } from '@/types/api';
import { TPlan } from '@/types/Plan';
import { useMutation } from '@tanstack/react-query';

type TCreateOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  notes: {
    email: string;
    name: string;
  };
};

const createOrder = (planId: TPlan['id']): TApiPromise<TCreateOrderResponse> => {
  return api.post('/api/v1/subscriptions/create-order', {
    planId,
  });
};

const createSubscription = (data: {
  orderId: string;
  paymentId: string;
  signature: string;
  planId: string;
}): TApiPromise => {
  return api.post('/api/v1/subscriptions', data);
};

export const useCreateOrder = (options?: TMutationOpts<TPlan['id'], TCreateOrderResponse>) => {
  return useMutation({
    mutationKey: ['create-order'],
    mutationFn: (planId: TPlan['id']) => createOrder(planId),
    ...options,
  });
};

export const useCreateSubscription = (
  options?: TMutationOpts<
    {
      orderId: string;
      paymentId: string;
      signature: string;
      planId: string;
    },
    void
  >
) => {
  return useMutation({
    mutationKey: ['create-subscription'],
    mutationFn: (data: { orderId: string; paymentId: string; signature: string; planId: string }) =>
      createSubscription(data),
    ...options,
  });
};

export const initiateRazorpayPayment = async ({
  order,
  plan,
}: {
  order: TCreateOrderResponse;
  plan: TPlan;
}) => {
  throw new Error('Payments are disabled. This app is free for everyone.');
};
