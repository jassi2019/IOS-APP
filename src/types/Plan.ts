export type TPlan = {
  id: string;
  name: string;
  description: string;
  amount: number;
  gstRate: number;
  validUntil: string;
  appleProductId?: string | null;
  createdAt: string;
  updatedAt: string;
};
