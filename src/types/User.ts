import { TSubscription } from './Subscription';

export type TUser = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  bio: string;
  role: string;
  registrationSource: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  subscription: TSubscription;
};
