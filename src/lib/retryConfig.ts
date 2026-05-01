/**
 * Retry Configuration Module
 *
 * Implements configurable retry strategies with exponential backoff,
 * request deduplication, and intelligent retry logic.
 */

import { AxiosError, AxiosRequestConfig } from 'axios';

/**
 * Retry strategy options
 */
export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableStatuses: number[];
  retryableErrors: string[];
  shouldRetry?: (error: AxiosError) => boolean;
  onRetry?: (retryCount: number, error: AxiosError, delayMs: number) => void;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 10000, // 10 seconds
  backoffMultiplier: 2, // Exponential: 1s, 2s, 4s, 8s...
  retryableStatuses: [408, 429, 500, 502, 503, 504], // Timeout, rate limit, server errors
  retryableErrors: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH', 'EAI_AGAIN'],
};

/**
 * Retry configuration for different endpoint types
 */
export const RETRY_CONFIGS = {
  // Authentication endpoints - increased retries and longer delays for better reliability
  auth: {
    maxRetries: 3, // Increased from 2 to 3
    initialDelayMs: 2000, // Increased from 1000ms to 2000ms
    maxDelayMs: 10000, // Increased from 5000ms to 10000ms
    backoffMultiplier: 2,
    retryableStatuses: [408, 500, 502, 503, 504],
    retryableErrors: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH', 'EAI_AGAIN'],
  } as RetryOptions,

  // Data fetching - more retries, longer delays
  fetch: {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
    retryableErrors: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH'],
  } as RetryOptions,

  // Mutations (POST, PUT, DELETE) - increased retries for better reliability
  mutation: {
    maxRetries: 3, // Increased from 2 to 3
    initialDelayMs: 2000,
    maxDelayMs: 10000, // Increased from 8000ms to 10000ms
    backoffMultiplier: 2,
    retryableStatuses: [408, 500, 502, 503, 504], // Exclude 429 to avoid duplicate operations
    retryableErrors: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH'],
  } as RetryOptions,

  // Critical operations - minimal retries
  critical: {
    maxRetries: 1,
    initialDelayMs: 1000,
    maxDelayMs: 3000,
    backoffMultiplier: 1.5,
    retryableStatuses: [408, 503, 504],
    retryableErrors: ['ECONNABORTED', 'ETIMEDOUT'],
  } as RetryOptions,
};

/**
 * Calculate delay for exponential backoff with jitter
 */
export const calculateBackoffDelay = (retryCount: number, options: RetryOptions): number => {
  const { initialDelayMs, maxDelayMs, backoffMultiplier } = options;

  // Exponential backoff: initialDelay * (multiplier ^ retryCount)
  const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, retryCount);

  // Add jitter (random variation) to prevent thundering herd
  const jitter = Math.random() * 0.3 * exponentialDelay; // ±30% jitter

  // Cap at maximum delay
  const delay = Math.min(exponentialDelay + jitter, maxDelayMs);

  return Math.floor(delay);
};

/**
 * Determine if an error should be retried
 */
export const shouldRetryRequest = (
  error: AxiosError,
  retryCount: number,
  options: RetryOptions
): boolean => {
  // Check if max retries exceeded
  if (retryCount >= options.maxRetries) {
    return false;
  }

  // Custom retry logic if provided
  if (options.shouldRetry) {
    return options.shouldRetry(error);
  }

  // Check for retryable error codes
  if (error.code && options.retryableErrors.includes(error.code)) {
    return true;
  }

  // Check for retryable HTTP status codes
  if (error.response?.status && options.retryableStatuses.includes(error.response.status)) {
    return true;
  }

  // Check for timeout errors
  if (error.message?.includes('timeout') || error.code === 'ECONNABORTED') {
    return true;
  }

  // Check for network errors
  if (error.message === 'Network Error' || !error.response) {
    return true;
  }

  return false;
};

/**
 * Sleep utility for delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Request deduplication cache
 * Prevents multiple identical requests from being sent simultaneously
 */
class RequestDeduplicator {
  private pendingRequests: Map<string, Promise<any>> = new Map();

  /**
   * Generate a unique key for a request
   */
  private generateKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return JSON.stringify({ method, url, params, data });
  }

  /**
   * Get or create a request promise
   */
  deduplicate<T>(config: AxiosRequestConfig, requestFn: () => Promise<T>): Promise<T> {
    const key = this.generateKey(config);

    // If request is already pending, return existing promise
    if (this.pendingRequests.has(key)) {
      console.log('🔄 Deduplicating request:', config.url);
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // Create new request promise
    const promise = requestFn().finally(() => {
      // Remove from cache when complete
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Clear all pending requests
   */
  clear(): void {
    this.pendingRequests.clear();
  }

  /**
   * Get number of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * Retry a request with exponential backoff
 */
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  options: RetryOptions = DEFAULT_RETRY_OPTIONS,
  retryCount: number = 0
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    const axiosError = error as AxiosError;

    // Check if we should retry
    if (!shouldRetryRequest(axiosError, retryCount, options)) {
      throw error;
    }

    // Calculate delay
    const delay = calculateBackoffDelay(retryCount, options);

    // Log retry attempt
    console.log(`🔄 Retry attempt ${retryCount + 1}/${options.maxRetries} after ${delay}ms`, {
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      error: axiosError.message,
      code: axiosError.code,
      status: axiosError.response?.status,
    });

    // Call onRetry callback if provided
    if (options.onRetry) {
      options.onRetry(retryCount + 1, axiosError, delay);
    }

    // Wait before retrying
    await sleep(delay);

    // Retry the request
    return retryRequest(requestFn, options, retryCount + 1);
  }
};

/**
 * Get retry configuration based on request type
 */
export const getRetryConfig = (config: AxiosRequestConfig): RetryOptions => {
  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();

  // Authentication endpoints
  if (url.includes('/auth/')) {
    return RETRY_CONFIGS.auth;
  }

  // Mutation operations
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return RETRY_CONFIGS.mutation;
  }

  // Default to fetch config for GET requests
  return RETRY_CONFIGS.fetch;
};

/**
 * Check if request is idempotent (safe to retry)
 */
export const isIdempotentRequest = (config: AxiosRequestConfig): boolean => {
  const method = (config.method || 'GET').toUpperCase();
  return ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'].includes(method);
};

/**
 * Retry statistics for monitoring
 */
export class RetryStats {
  private stats = {
    totalRequests: 0,
    retriedRequests: 0,
    successfulRetries: 0,
    failedRetries: 0,
    totalRetryAttempts: 0,
  };

  recordRequest(): void {
    this.stats.totalRequests++;
  }

  recordRetry(success: boolean, attempts: number): void {
    this.stats.retriedRequests++;
    this.stats.totalRetryAttempts += attempts;
    if (success) {
      this.stats.successfulRetries++;
    } else {
      this.stats.failedRetries++;
    }
  }

  getStats() {
    return {
      ...this.stats,
      retryRate:
        this.stats.totalRequests > 0
          ? (this.stats.retriedRequests / this.stats.totalRequests) * 100
          : 0,
      retrySuccessRate:
        this.stats.retriedRequests > 0
          ? (this.stats.successfulRetries / this.stats.retriedRequests) * 100
          : 0,
      averageRetryAttempts:
        this.stats.retriedRequests > 0
          ? this.stats.totalRetryAttempts / this.stats.retriedRequests
          : 0,
    };
  }

  reset(): void {
    this.stats = {
      totalRequests: 0,
      retriedRequests: 0,
      successfulRetries: 0,
      failedRetries: 0,
      totalRetryAttempts: 0,
    };
  }
}

export const retryStats = new RetryStats();

export default {
  DEFAULT_RETRY_OPTIONS,
  RETRY_CONFIGS,
  calculateBackoffDelay,
  shouldRetryRequest,
  sleep,
  retryRequest,
  getRetryConfig,
  isIdempotentRequest,
  requestDeduplicator,
  retryStats,
};
