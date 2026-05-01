import { TSubscription } from './Subscription';

export type TUser = {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  bio: string | null;
  role: string;
  registrationSource: string;
  // Not returned from profile endpoints; only used for auth inputs.
  password?: string;
  createdAt: string;
  updatedAt: string;
  subscription: TSubscription | null;
};
