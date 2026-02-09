/**
 * Error Handler Module
 *
 * Centralized error handling with categorization and user-friendly messages.
 * Provides consistent error handling across the application.
 */

import { AxiosError } from 'axios';

/**
 * Error categories for better handling
 */
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Structured error response
 */
export interface AppError {
  category: ErrorCategory;
  code: string;
  message: string;
  userMessage: string;
  technicalMessage?: string;
  statusCode?: number;
  retryable: boolean;
  timestamp: string;
  details?: any;
}

/**
 * Error code mappings
 */
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  NO_INTERNET: 'NO_INTERNET',
  SERVER_UNREACHABLE: 'SERVER_UNREACHABLE',

  // Timeout errors
  TIMEOUT: 'TIMEOUT',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',

  // Server errors
  SERVER_ERROR: 'SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  BAD_GATEWAY: 'BAD_GATEWAY',

  // Client errors
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',

  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Unknown
  UNKNOWN: 'UNKNOWN',
};

/**
 * User-friendly error messages
 */
const USER_MESSAGES: Record<string, string> = {
  // Network
  [ERROR_CODES.NETWORK_ERROR]:
    'Unable to connect to the server. Please check your internet connection.',
  [ERROR_CODES.NO_INTERNET]: 'No internet connection. Please check your network settings.',
  [ERROR_CODES.SERVER_UNREACHABLE]: 'Cannot reach the server. Please try again later.',

  // Timeout
  [ERROR_CODES.TIMEOUT]: 'Request timed out. Please check your connection and try again.',
  [ERROR_CODES.REQUEST_TIMEOUT]: 'The request took too long. Please try again.',
  [ERROR_CODES.CONNECTION_TIMEOUT]: 'Connection timeout. Please check your internet connection.',

  // Server
  [ERROR_CODES.SERVER_ERROR]: 'Server error occurred. Please try again later.',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.',
  [ERROR_CODES.BAD_GATEWAY]: 'Server communication error. Please try again.',

  // Client
  [ERROR_CODES.BAD_REQUEST]: 'Invalid request. Please check your input.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',

  // Authentication
  [ERROR_CODES.UNAUTHORIZED]: 'Please log in to continue.',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password.',

  // Unknown
  [ERROR_CODES.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

/**
 * Categorize error based on type and status
 */
export const categorizeError = (error: AxiosError): ErrorCategory => {
  // Network errors
  if (error.message === 'Network Error' || !error.response) {
    return ErrorCategory.NETWORK;
  }

  // Timeout errors - more specific detection
  if (
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT' ||
    error.message.includes('timeout') ||
    error.message.includes('timed out')
  ) {
    return ErrorCategory.TIMEOUT;
  }

  // Status code based categorization
  const status = error.response?.status;
  if (status) {
    if (status === 401 || status === 403) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (status === 400 || status === 422) {
      return ErrorCategory.VALIDATION;
    }
    if (status >= 400 && status < 500) {
      return ErrorCategory.CLIENT;
    }
    if (status >= 500) {
      return ErrorCategory.SERVER;
    }
  }

  return ErrorCategory.UNKNOWN;
};

/**
 * Get error code from Axios error
 */
export const getErrorCode = (error: AxiosError): string => {
  // Check for custom error code in response
  const responseCode = (error.response?.data as any)?.code;
  if (responseCode) {
    return responseCode;
  }

  // Network errors
  if (error.message === 'Network Error' || !error.response) {
    return ERROR_CODES.NETWORK_ERROR;
  }

  // Timeout errors - more specific detection
  if (
    error.code === 'ECONNABORTED' ||
    error.code === 'ETIMEDOUT' ||
    error.message.includes('timeout') ||
    error.message.includes('timed out')
  ) {
    return ERROR_CODES.TIMEOUT;
  }

  // Status code based error codes
  const status = error.response?.status;
  switch (status) {
    case 400:
      return ERROR_CODES.BAD_REQUEST;
    case 401:
      return ERROR_CODES.UNAUTHORIZED;
    case 403:
      return ERROR_CODES.FORBIDDEN;
    case 404:
      return ERROR_CODES.NOT_FOUND;
    case 408:
      return ERROR_CODES.REQUEST_TIMEOUT;
    case 422:
      return ERROR_CODES.VALIDATION_ERROR;
    case 500:
      return ERROR_CODES.SERVER_ERROR;
    case 502:
      return ERROR_CODES.BAD_GATEWAY;
    case 503:
      return ERROR_CODES.SERVICE_UNAVAILABLE;
    case 504:
      return ERROR_CODES.CONNECTION_TIMEOUT;
    default:
      return ERROR_CODES.UNKNOWN;
  }
};

/**
 * Check if error is retryable
 */
export const isRetryableError = (error: AxiosError): boolean => {
  const category = categorizeError(error);
  const status = error.response?.status;

  // Network and timeout errors are retryable
  if (category === ErrorCategory.NETWORK || category === ErrorCategory.TIMEOUT) {
    return true;
  }

  // Server errors (5xx) are retryable
  if (category === ErrorCategory.SERVER) {
    return true;
  }

  // Specific status codes that are retryable
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  if (status && retryableStatuses.includes(status)) {
    return true;
  }

  return false;
};

/**
 * Get user-friendly error message
 */
export const getUserMessage = (error: AxiosError): string => {
  // Check for custom message in response
  const responseMessage = (error.response?.data as any)?.message;
  if (responseMessage && typeof responseMessage === 'string') {
    return responseMessage;
  }

  // Get error code and return corresponding message
  const errorCode = getErrorCode(error);
  return USER_MESSAGES[errorCode] || USER_MESSAGES[ERROR_CODES.UNKNOWN];
};

/**
 * Get technical error message for logging
 */
export const getTechnicalMessage = (error: AxiosError): string => {
  const parts: string[] = [];

  if (error.message) {
    parts.push(error.message);
  }

  if (error.code) {
    parts.push(`Code: ${error.code}`);
  }

  if (error.response?.status) {
    parts.push(`Status: ${error.response.status}`);
  }

  if (error.config?.url) {
    parts.push(`URL: ${error.config.url}`);
  }

  return parts.join(' | ');
};

/**
 * Transform Axios error to AppError
 */
export const transformError = (error: any): AppError => {
  // If already an AppError, return as is
  if (error.category && error.code && error.userMessage) {
    return error as AppError;
  }

  // Handle non-Axios errors
  if (!(error.isAxiosError || error.response || error.config)) {
    return {
      category: ErrorCategory.UNKNOWN,
      code: ERROR_CODES.UNKNOWN,
      message: error.message || 'Unknown error',
      userMessage: 'An unexpected error occurred. Please try again.',
      technicalMessage: error.toString(),
      retryable: false,
      timestamp: new Date().toISOString(),
      details: error,
    };
  }

  const axiosError = error as AxiosError;
  const category = categorizeError(axiosError);
  const code = getErrorCode(axiosError);
  const userMessage = getUserMessage(axiosError);
  const technicalMessage = getTechnicalMessage(axiosError);
  const retryable = isRetryableError(axiosError);

  return {
    category,
    code,
    message: axiosError.message,
    userMessage,
    technicalMessage,
    statusCode: axiosError.response?.status,
    retryable,
    timestamp: new Date().toISOString(),
    details: {
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      data: axiosError.response?.data,
    },
  };
};

/**
 * Log error with appropriate level
 */
export const logError = (error: AppError, context?: string): void => {
  const prefix = context ? `[${context}]` : '';
  const emoji = getErrorEmoji(error.category);

  console.error(`${emoji} ${prefix} ${error.category} Error:`, {
    code: error.code,
    message: error.message,
    userMessage: error.userMessage,
    technicalMessage: error.technicalMessage,
    statusCode: error.statusCode,
    retryable: error.retryable,
    timestamp: error.timestamp,
    details: error.details,
  });
};

/**
 * Get emoji for error category
 */
const getErrorEmoji = (category: ErrorCategory): string => {
  switch (category) {
    case ErrorCategory.NETWORK:
      return '📡';
    case ErrorCategory.TIMEOUT:
      return '⏱️';
    case ErrorCategory.SERVER:
      return '🖥️';
    case ErrorCategory.CLIENT:
      return '📱';
    case ErrorCategory.AUTHENTICATION:
      return '🔐';
    case ErrorCategory.VALIDATION:
      return '✏️';
    default:
      return '❌';
  }
};

/**
 * Handle error and return user-friendly message
 */
export type HandleErrorOptions = {
  /**
   * When true, do not emit console.error logs for this error.
   * Useful for non-critical background requests that may fail frequently.
   */
  silent?: boolean;
};

export const handleError = (
  error: any,
  context?: string,
  options?: HandleErrorOptions
): AppError => {
  const appError = transformError(error);
  if (!options?.silent) {
    logError(appError, context);
  }
  return appError;
};

/**
 * Create custom error
 */
export const createError = (
  category: ErrorCategory,
  code: string,
  message: string,
  userMessage?: string
): AppError => {
  return {
    category,
    code,
    message,
    userMessage: userMessage || message,
    retryable: false,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Error handler for React Query
 */
export const reactQueryErrorHandler = (error: any): AppError => {
  return handleError(error, 'React Query');
};

/**
 * Get error summary for display
 */
export const getErrorSummary = (error: AppError): string => {
  const parts: string[] = [error.userMessage];

  if (error.retryable) {
    parts.push('This error is temporary. Please try again.');
  }

  if (error.category === ErrorCategory.NETWORK) {
    parts.push('Check your internet connection and try again.');
  }

  if (error.category === ErrorCategory.TIMEOUT) {
    parts.push('The request took too long. Please check your connection.');
  }

  return parts.join(' ');
};

/**
 * Get troubleshooting steps for an error
 */
export const getTroubleshootingSteps = (error: AppError): string[] => {
  const steps: string[] = [];

  switch (error.category) {
    case ErrorCategory.TIMEOUT:
      steps.push('✓ Check your internet connection');
      steps.push('✓ Try moving closer to your WiFi router');
      steps.push('✓ Verify the backend server is running');
      steps.push('✓ The server might be experiencing high load');
      steps.push('✓ Try again in a few moments');
      break;

    case ErrorCategory.NETWORK:
      steps.push('✓ Check your WiFi or mobile data connection');
      steps.push('✓ Try toggling airplane mode on and off');
      steps.push('✓ Verify you have internet access');
      steps.push('✓ Check if other apps can connect to the internet');
      break;

    case ErrorCategory.AUTHENTICATION:
      steps.push('✓ Verify your email and password are correct');
      steps.push('✓ Check if your account is active');
      steps.push('✓ Try resetting your password if needed');
      break;

    case ErrorCategory.VALIDATION:
      steps.push('✓ Check that all required fields are filled');
      steps.push('✓ Verify the format of your input');
      steps.push('✓ Review any field-specific error messages');
      break;

    case ErrorCategory.SERVER:
      steps.push('✓ The server is experiencing issues');
      steps.push('✓ Please try again in a few minutes');
      steps.push('✓ Contact support if the problem persists');
      break;

    default:
      steps.push('✓ Try again in a few moments');
      steps.push('✓ Check your internet connection');
      steps.push('✓ Contact support if the issue continues');
  }

  return steps;
};

/**
 * Get detailed error information for debugging
 */
export const getDetailedErrorInfo = (
  error: AppError
): {
  summary: string;
  details: string[];
  troubleshooting: string[];
  technicalInfo?: string;
} => {
  return {
    summary: error.userMessage,
    details: [
      `Error Code: ${error.code}`,
      `Category: ${error.category}`,
      `Retryable: ${error.retryable ? 'Yes' : 'No'}`,
      `Timestamp: ${new Date(error.timestamp).toLocaleString()}`,
    ],
    troubleshooting: getTroubleshootingSteps(error),
    technicalInfo: error.technicalMessage,
  };
};

export default {
  ErrorCategory,
  ERROR_CODES,
  categorizeError,
  getErrorCode,
  isRetryableError,
  getUserMessage,
  getTechnicalMessage,
  transformError,
  logError,
  handleError,
  createError,
  reactQueryErrorHandler,
  getErrorSummary,
  getTroubleshootingSteps,
  getDetailedErrorInfo,
};
