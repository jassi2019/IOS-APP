import api from '@/lib/api';
import { TApiPromise, TMutationOpts } from '@/types/api';
import { TSubscription } from '@/types/Subscription';
import { useMutation } from '@tanstack/react-query';

export type TCreateAppleIapSubscriptionPayload = {
  planId: string;
  productId?: string | null;
  transactionId?: string | null;
  originalTransactionId?: string | null;
  receipt: string;
  environmentIOS?: string | null;
};

const createAppleIapSubscription = (
  data: TCreateAppleIapSubscriptionPayload
): TApiPromise<TSubscription> => {
  // Avoid auto-retry for subscription creation to prevent duplicates on flaky networks.
  return api.post('/api/v1/subscriptions/iap/apple', data, { skipRetry: true });
};

export const useCreateAppleIapSubscription = (
  options?: TMutationOpts<TCreateAppleIapSubscriptionPayload, TSubscription>
) => {
  return useMutation({
    mutationKey: ['create-apple-iap-subscription'],
    mutationFn: createAppleIapSubscription,
    ...options,
  });
};
