/**
 * Enhanced API Module with Retry Logic and Error Handling
 *
 * Features:
 * - Automatic retry with exponential backoff
 * - Request deduplication
 * - Network connectivity detection
 * - Comprehensive error handling
 * - Request/response logging
 * - Configurable timeouts per endpoint type
 */

import env from '@/constants/env';
import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { handleError, transformError } from './errorHandler';
import { checkInternetConnectivity, checkServerReachability } from './networkUtils';
import {
  getRetryConfig,
  isIdempotentRequest,
  requestDeduplicator,
  retryRequest,
  retryStats,
} from './retryConfig';
import tokenManager from './tokenManager';

/**
 * Request metadata for tracking
 */
interface RequestMetadata {
  startTime: number;
  retryCount: number;
  requestId: string;
}

/**
 * Extended Axios config with retry options
 */
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  _metadata?: RequestMetadata;
  skipRetry?: boolean;
  skipDeduplication?: boolean;
  /**
   * When true, suppress console error logging for this request. Useful for
   * non-critical background calls that may fail (e.g. analytics/last-read).
   */
  suppressErrorLogging?: boolean;
}

/**
 * Generate unique request ID
 */
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Timeout configurations for different endpoint types
 */
const TIMEOUT_CONFIG = {
  default: 30000, // 30 seconds - increased from 15s
  auth: 30000, // 30 seconds for authentication
  fetch: 25000, // 25 seconds for data fetching
  mutation: 30000, // 30 seconds for mutations
  critical: 20000, // 20 seconds for critical operations
};

/**
 * Get timeout for specific endpoint
 */
const getTimeoutForEndpoint = (url: string, method: string): number => {
  const upperMethod = method.toUpperCase();

  // Authentication endpoints get longer timeout
  if (url.includes('/auth/')) {
    return TIMEOUT_CONFIG.auth;
  }

  // Mutation operations
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(upperMethod)) {
    return TIMEOUT_CONFIG.mutation;
  }

  // Default for GET requests
  return TIMEOUT_CONFIG.fetch;
};

/**
 * Custom Axios instance with enhanced configurations
 */
const api = axios.create({
  baseURL: env.backendUrl,
  timeout: TIMEOUT_CONFIG.default, // Default 30 seconds timeout (increased from 15s)
  headers: {
    'Content-Type': 'application/json',
  },
  // Validate status - consider 2xx and 3xx as success
  validateStatus: (status) => status >= 200 && status < 400,
});

/**
 * Request Interceptor
 * - Adds authentication token
 * - Adds request metadata
 * - Logs request details
 * - Sets dynamic timeout based on endpoint
 * - Performs pre-flight network check for critical requests
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Initialize metadata
    const metadata: RequestMetadata = {
      startTime: Date.now(),
      retryCount: (config as any)._retryCount || 0,
      requestId: generateRequestId(),
    };
    (config as any)._metadata = metadata;

    // Set dynamic timeout based on endpoint if not explicitly set
    if (!config.timeout || config.timeout === TIMEOUT_CONFIG.default) {
      config.timeout = getTimeoutForEndpoint(config.url || '', config.method || 'GET');
    }

    // Pre-flight network check for auth endpoints (only on first attempt)
    if (config.url?.includes('/auth/') && metadata.retryCount === 0) {
      const hasInternet = await checkInternetConnectivity();
      if (!hasInternet) {
        console.warn('⚠️ No internet connection detected before auth request');
        // Don't throw error, let the request proceed and fail naturally
        // This allows retry logic to work properly
      }
    }

    // Add authentication token
    config.headers = config.headers || {};
    const token = tokenManager.getToken();

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request (only in development)
    if (__DEV__) {
      console.log(`📤 [${metadata.requestId}] ${config.method?.toUpperCase()} ${config.url}`, {
        retry: metadata.retryCount > 0 ? `Attempt ${metadata.retryCount + 1}` : 'Initial',
        timeout: `${config.timeout}ms`,
      });
    }

    // Record request in stats
    retryStats.recordRequest();

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Handles successful responses
 * - Implements retry logic for failures
 * - Transforms errors to user-friendly format
 * - Logs response details
 */
api.interceptors.response.use(
  (response) => {
    const config = response.config as any;
    const metadata = config._metadata as RequestMetadata;

    // Log successful response (only in development)
    if (__DEV__ && metadata) {
      const duration = Date.now() - metadata.startTime;
      console.log(`✅ [${metadata.requestId}] ${response.status} ${response.config.url}`, {
        duration: `${duration}ms`,
        retry:
          metadata.retryCount > 0
            ? `Success after ${metadata.retryCount} retries`
            : 'First attempt',
      });
    }

    // Return response data directly
    return response.data;
  },
  async (error: AxiosError) => {
    const config = error.config as ExtendedAxiosRequestConfig;
    const metadata = config?._metadata as RequestMetadata;
    const suppressErrorLogging = !!config?.suppressErrorLogging;

    // Log error details
    if (metadata && !suppressErrorLogging) {
      const duration = Date.now() - metadata.startTime;
      console.error(`❌ [${metadata.requestId}] Request failed`, {
        url: config?.url,
        method: config?.method,
        duration: `${duration}ms`,
        error: error.message,
        code: error.code,
        status: error.response?.status,
      });
    }

    // Check if retry is disabled for this request
    if (config?.skipRetry) {
      const appError = transformError(error);
      return Promise.reject(appError);
    }

    // Get retry configuration for this request
    const retryConfig = config ? getRetryConfig(config) : undefined;

    // Check if request should be retried
    if (retryConfig && config && !config._retry) {
      const shouldRetry =
        isIdempotentRequest(config) ||
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout') ||
        error.message === 'Network Error' ||
        !error.response;

      if (shouldRetry) {
        // Mark as retry attempt
        config._retry = true;
        config._retryCount = (config._retryCount || 0) + 1;

        try {
          // Perform retry with exponential backoff
          const result = await retryRequest(
            () => api.request(config),
            retryConfig,
            config._retryCount - 1
          );

          // Record successful retry
          retryStats.recordRetry(true, config._retryCount);

          return result;
        } catch (retryError) {
          // Record failed retry
          retryStats.recordRetry(false, config._retryCount);

          // Transform and return error
          const appError = handleError(retryError, 'API Retry Failed', {
            silent: suppressErrorLogging,
          });
          return Promise.reject(appError);
        }
      }
    }

    // Transform error to user-friendly format
    const appError = handleError(error, 'API Request', { silent: suppressErrorLogging });
    return Promise.reject(appError);
  }
);

/**
 * Enhanced API wrapper with additional features
 */
const enhancedApi = {
  /**
   * Standard request methods
   * Note: Response interceptor returns response.data, so these return T directly
   */
  get: <T = any>(url: string, config?: ExtendedAxiosRequestConfig): Promise<T> =>
    api.get(url, config) as Promise<T>,

  post: <T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<T> =>
    api.post(url, data, config) as Promise<T>,

  put: <T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<T> =>
    api.put(url, data, config) as Promise<T>,

  patch: <T = any>(url: string, data?: any, config?: ExtendedAxiosRequestConfig): Promise<T> =>
    api.patch(url, data, config) as Promise<T>,

  delete: <T = any>(url: string, config?: ExtendedAxiosRequestConfig): Promise<T> =>
    api.delete(url, config) as Promise<T>,

  /**
   * Request with automatic deduplication
   * Prevents multiple identical requests from being sent simultaneously
   */
  dedupedRequest: <T = any>(config: ExtendedAxiosRequestConfig): Promise<T> => {
    if (config.skipDeduplication) {
      return api.request(config) as Promise<T>;
    }
    return requestDeduplicator.deduplicate(config, () => api.request(config)) as Promise<T>;
  },

  /**
   * Request with network check before sending
   * Fails fast if no internet connection
   */
  requestWithNetworkCheck: async <T = any>(config: ExtendedAxiosRequestConfig): Promise<T> => {
    // Check internet connectivity first
    const hasInternet = await checkInternetConnectivity();

    if (!hasInternet) {
      throw {
        category: 'NETWORK',
        code: 'NO_INTERNET',
        message: 'No internet connection',
        userMessage: 'No internet connection. Please check your network settings.',
        retryable: true,
        timestamp: new Date().toISOString(),
      };
    }

    return api.request(config) as Promise<T>;
  },

  /**
   * Request with server reachability check
   * Checks if backend is reachable before sending request
   */
  requestWithServerCheck: async <T = any>(config: ExtendedAxiosRequestConfig): Promise<T> => {
    // Check server reachability
    const serverCheck = await checkServerReachability();

    if (!serverCheck.reachable) {
      throw {
        category: 'NETWORK',
        code: 'SERVER_UNREACHABLE',
        message: serverCheck.error || 'Cannot reach server',
        userMessage: 'Cannot reach the server. Please try again later.',
        retryable: true,
        timestamp: new Date().toISOString(),
      };
    }

    return api.request(config) as Promise<T>;
  },

  /**
   * Get retry statistics
   */
  getRetryStats: () => retryStats.getStats(),

  /**
   * Reset retry statistics
   */
  resetRetryStats: () => retryStats.reset(),

  /**
   * Get pending request count
   */
  getPendingRequestCount: () => requestDeduplicator.getPendingCount(),

  /**
   * Clear request deduplication cache
   */
  clearDeduplicationCache: () => requestDeduplicator.clear(),

  /**
   * Direct access to axios instance for advanced usage
   */
  axios: api,
};

// Export enhanced API as default
export default enhancedApi;

// Also export the base axios instance for compatibility
export { api as axiosInstance };
