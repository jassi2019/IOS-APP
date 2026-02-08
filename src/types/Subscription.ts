export type TSubscription = {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  planId: string;
  paymentId: string;
  orderId: string;
  signature: string;
  paymentMethod: string;
  amount: number;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  platform: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
