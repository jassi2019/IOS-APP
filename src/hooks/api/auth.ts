import api from '@/lib/api';
import { TApiPromise, TMutationOpts } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import * as Device from 'expo-device';

const AUTH_REQUEST_CONFIG = {
  timeout: 30000,
};

type RegisterInput = {
  email: string;
  password: string;
  profilePicture: string;
  verificationToken?: string;
};

const register = (data: RegisterInput): TApiPromise<{ token: string }> => {
  const { verificationToken, ...payload } = data;

  return api.post('/api/v1/auth/register', payload, {
    ...AUTH_REQUEST_CONFIG,
    headers: {
      ...(verificationToken ? { Authorization: `Bearer ${verificationToken}` } : {}),
      'device-name': Device.deviceName,
      'device-id': Device.modelId || 'unknown',
    },
  });
};

const getRegistrationOTP = (email: string): TApiPromise<void> => {
  return api.post('/api/v1/auth/register/email/verification', { email }, AUTH_REQUEST_CONFIG);
};

const verifyRegistrationOTP = (data: {
  email: string;
  otp: string;
}): TApiPromise<{ token: string }> => {
  return api.post('/api/v1/auth/register/otp/verification', data, AUTH_REQUEST_CONFIG);
};

const login = (data: { email: string; password: string }): TApiPromise<{ token: string }> => {
  return api.post('/api/v1/auth/login', data, {
    ...AUTH_REQUEST_CONFIG,
    headers: {
      'device-name': Device.deviceName,
      'device-id': Device.modelId || 'unknown',
    },
  });
};

const requestPasswordReset = (email: string): TApiPromise<void> => {
  return api.post('/api/v1/auth/reset/password/email/verification', { email }, AUTH_REQUEST_CONFIG);
};

const verifyPasswordResetOTP = (data: {
  email: string;
  otp: string;
}): TApiPromise<{ token: string }> => {
  return api.post('/api/v1/auth/reset/password/otp/verification', data, AUTH_REQUEST_CONFIG);
};

type ResetPasswordInput = {
  password: string;
  confirmPassword: string;
  resetToken?: string;
};

const resetPassword = (data: ResetPasswordInput): TApiPromise<{ token: string }> => {
  const { resetToken, ...payload } = data;

  return api.post('/api/v1/auth/reset/password', payload, {
    ...AUTH_REQUEST_CONFIG,
    headers: {
      ...(resetToken ? { Authorization: `Bearer ${resetToken}` } : {}),
      'device-name': Device.deviceName,
      'device-id': Device.modelId || 'unknown',
    },
  });
};

export const useRegister = (
  options?: TMutationOpts<
    RegisterInput,
    { token: string }
  >
) => {
  return useMutation({
    mutationFn: (data: RegisterInput) =>
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
  options?: TMutationOpts<ResetPasswordInput, { token: string }>
) => {
  return useMutation({
    mutationFn: (data: ResetPasswordInput) => resetPassword(data),
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
