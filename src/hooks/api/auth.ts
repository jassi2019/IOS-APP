import api from '@/lib/api';
import { TApiPromise, TMutationOpts } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import * as Device from 'expo-device';

const register = (data: {
  email: string;
  password: string;
  profilePicture: string;
}): TApiPromise<{ token: string }> => {
  return api.post('/api/v1/auth/register', data, {
    headers: {
      'device-name': Device.deviceName,
      'device-id': Device.modelId || 'unknown',
    },
  });
};

const getRegistrationOTP = (email: string): TApiPromise<void> => {
  return api.post('/api/v1/auth/register/email/verification', { email });
};

const verifyRegistrationOTP = (data: {
  email: string;
  otp: string;
}): TApiPromise<{ token: string }> => {
  return api.post('/api/v1/auth/register/otp/verification', data);
};

const login = (data: { email: string; password: string }): TApiPromise<{ token: string }> => {
  return api.post('/api/v1/auth/login', data, {
    headers: {
      'device-name': Device.deviceName,
      'device-id': Device.modelId || 'unknown',
    },
  });
};

const requestPasswordReset = (email: string): TApiPromise<void> => {
  return api.post('/api/v1/auth/reset/password/email/verification', { email });
};

const verifyPasswordResetOTP = (data: {
  email: string;
  otp: string;
}): TApiPromise<{ token: string }> => {
  return api.post('/api/v1/auth/reset/password/otp/verification', data);
};

const resetPassword = (data: { password: string; confirmPassword: string }): TApiPromise<void> => {
  return api.post('/api/v1/auth/reset/password', data, {
    headers: {
      'device-name': Device.deviceName,
      'device-id': Device.modelId || 'unknown',
    },
  });
};

export const useRegister = (
  options?: TMutationOpts<
    { email: string; password: string; profilePicture: string },
    { token: string }
  >
) => {
  return useMutation({
    mutationFn: (data: { email: string; password: string; profilePicture: string }) =>
      register({
        ...data,
        profilePicture: `https://avatar.iran.liara.run/public/${
          Math.floor(Math.random() * 100) + 1
        }`,
      }),
    ...options,
  });
};

export const useGetRegistrationOTP = (options?: TMutationOpts<string, void>) => {
  return useMutation({
    mutationFn: (email: string) => getRegistrationOTP(email),
    ...options,
  });
};

export const useVerifyRegistrationOTP = (
  options?: TMutationOpts<{ email: string; otp: string }, { token: string }>
) => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyRegistrationOTP(data),
    ...options,
  });
};

export const useLogin = (
  options?: TMutationOpts<{ email: string; password: string }, { token: string }>
) => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => login(data),
    ...options,
  });
};

export const useRequestPasswordReset = (options?: TMutationOpts<string, void>) => {
  return useMutation({
    mutationFn: (email: string) => requestPasswordReset(email),
    ...options,
  });
};

export const useVerifyPasswordResetOTP = (
  options?: TMutationOpts<{ email: string; otp: string }, { token: string }>
) => {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyPasswordResetOTP(data),
    ...options,
  });
};

export const useResetPassword = (
  options?: TMutationOpts<{ password: string; confirmPassword: string }, void>
) => {
  return useMutation({
    mutationFn: (data: { password: string; confirmPassword: string }) => resetPassword(data),
    ...options,
  });
};

const requestAccountDeletion = (data: {
  email: string;
  password: string;
}): TApiPromise<void> => {
  return api.post('/api/v1/deletions/request', data);
};

export const useRequestAccountDeletion = (
  options?: TMutationOpts<{ email: string; password: string }, void>
) => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => requestAccountDeletion(data),
    ...options,
  });
};
