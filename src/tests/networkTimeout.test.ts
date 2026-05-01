/**
 * Unit Tests for Network Timeout Fixes
 *
 * Tests the utility functions for network diagnostics and error handling
 */

import { describe, expect, it, jest } from '@jest/globals';
import { AxiosError } from 'axios';
import {
  categorizeError,
  ERROR_CODES,
  ErrorCategory,
  getDetailedErrorInfo,
  getErrorCode,
  getTroubleshootingSteps,
} from '../lib/errorHandler';
import {
  checkInternetConnectivity,
  checkServerReachability,
  getComprehensiveNetworkDiagnostics,
  testConnectionQuality,
} from '../lib/networkUtils';
import { calculateBackoffDelay, RETRY_CONFIGS, shouldRetryRequest } from '../lib/retryConfig';

// Mock environment
jest.mock('@/constants/env', () => ({
  default: {
    backendUrl: 'http://localhost:8000',
    razorpayKeyId: 'test_key',
  },
}));

describe('Network Utilities', () => {
  describe('checkInternetConnectivity', () => {
    it('should return boolean indicating internet status', async () => {
      const result = await checkInternetConnectivity();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('checkServerReachability', () => {
    it('should return reachability status with latency', async () => {
      const result = await checkServerReachability();

      expect(result).toHaveProperty('reachable');
      expect(typeof result.reachable).toBe('boolean');

      if (result.reachable) {
        expect(result).toHaveProperty('latency');
        expect(typeof result.latency).toBe('number');
        expect(result.latency).toBeGreaterThan(0);
      }
    });

    it('should include status code when server responds', async () => {
      const result = await checkServerReachability();

      if (result.reachable) {
        expect(result).toHaveProperty('statusCode');
        expect(typeof result.statusCode).toBe('number');
      }
    });

    it('should timeout after 15 seconds', async () => {
      const startTime = Date.now();
      const result = await checkServerReachability();
      const duration = Date.now() - startTime;

      // Should not take more than 16 seconds (15s timeout + 1s buffer)
      expect(duration).toBeLessThan(16000);
    }, 20000); // Test timeout of 20s
  });

  describe('getComprehensiveNetworkDiagnostics', () => {
    it('should return complete diagnostics object', async () => {
      const diagnostics = await getComprehensiveNetworkDiagnostics();

      expect(diagnostics).toHaveProperty('hasInternet');
      expect(diagnostics).toHaveProperty('serverReachable');
      expect(diagnostics).toHaveProperty('connectionQuality');
      expect(diagnostics).toHaveProperty('recommendations');
      expect(diagnostics).toHaveProperty('timestamp');

      expect(typeof diagnostics.hasInternet).toBe('boolean');
      expect(typeof diagnostics.serverReachable).toBe('boolean');
      expect(Array.isArray(diagnostics.recommendations)).toBe(true);
    });

    it('should categorize connection quality correctly', async () => {
      const diagnostics = await getComprehensiveNetworkDiagnostics();

      const validQualities = ['excellent', 'good', 'fair', 'poor', 'offline'];
      expect(validQualities).toContain(diagnostics.connectionQuality);
    });

    it('should provide recommendations', async () => {
      const diagnostics = await getComprehensiveNetworkDiagnostics();

      expect(diagnostics.recommendations.length).toBeGreaterThan(0);
      diagnostics.recommendations.forEach((rec) => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });
  });

  describe('testConnectionQuality', () => {
    it('should return quality metrics', async () => {
      const quality = await testConnectionQuality();

      expect(quality).toHaveProperty('averageLatency');
      expect(quality).toHaveProperty('minLatency');
      expect(quality).toHaveProperty('maxLatency');
      expect(quality).toHaveProperty('successRate');
      expect(quality).toHaveProperty('quality');

      expect(typeof quality.averageLatency).toBe('number');
      expect(typeof quality.minLatency).toBe('number');
      expect(typeof quality.maxLatency).toBe('number');
      expect(typeof quality.successRate).toBe('number');
    }, 15000); // Test timeout of 15s (3 pings * 5s each)

    it('should have valid quality rating', async () => {
      const quality = await testConnectionQuality();

      const validQualities = ['excellent', 'good', 'fair', 'poor'];
      expect(validQualities).toContain(quality.quality);
    }, 15000);

    it('should have success rate between 0 and 100', async () => {
      const quality = await testConnectionQuality();

      expect(quality.successRate).toBeGreaterThanOrEqual(0);
      expect(quality.successRate).toBeLessThanOrEqual(100);
    }, 15000);
  });
});

describe('Error Handler', () => {
  describe('categorizeError', () => {
    it('should categorize timeout errors correctly', () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
        isAxiosError: true,
      } as AxiosError;

      const category = categorizeError(timeoutError);
      expect(category).toBe(ErrorCategory.TIMEOUT);
    });

    it('should categorize network errors correctly', () => {
      const networkError = {
        message: 'Network Error',
        isAxiosError: true,
      } as AxiosError;

      const category = categorizeError(networkError);
      expect(category).toBe(ErrorCategory.NETWORK);
    });

    it('should categorize authentication errors correctly', () => {
      const authError = {
        response: { status: 401 },
        isAxiosError: true,
      } as AxiosError;

      const category = categorizeError(authError);
      expect(category).toBe(ErrorCategory.AUTHENTICATION);
    });

    it('should categorize server errors correctly', () => {
      const serverError = {
        response: { status: 500 },
        isAxiosError: true,
      } as AxiosError;

      const category = categorizeError(serverError);
      expect(category).toBe(ErrorCategory.SERVER);
    });
  });

  describe('getErrorCode', () => {
    it('should return TIMEOUT for ECONNABORTED', () => {
      const error = {
        code: 'ECONNABORTED',
        isAxiosError: true,
      } as AxiosError;

      const code = getErrorCode(error);
      expect(code).toBe(ERROR_CODES.TIMEOUT);
    });

    it('should return NETWORK_ERROR for network errors', () => {
      const error = {
        message: 'Network Error',
        isAxiosError: true,
      } as AxiosError;

      const code = getErrorCode(error);
      expect(code).toBe(ERROR_CODES.NETWORK_ERROR);
    });

    it('should return correct code for HTTP status', () => {
      const error = {
        response: { status: 404 },
        isAxiosError: true,
      } as AxiosError;

      const code = getErrorCode(error);
      expect(code).toBe(ERROR_CODES.NOT_FOUND);
    });
  });

  describe('getTroubleshootingSteps', () => {
    it('should return steps for timeout errors', () => {
      const error = {
        category: ErrorCategory.TIMEOUT,
        code: ERROR_CODES.TIMEOUT,
        message: 'Timeout',
        userMessage: 'Request timed out',
        retryable: true,
        timestamp: new Date().toISOString(),
      };

      const steps = getTroubleshootingSteps(error);

      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThan(0);
      expect(steps.some((step) => step.includes('internet'))).toBe(true);
    });

    it('should return steps for network errors', () => {
      const error = {
        category: ErrorCategory.NETWORK,
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Network Error',
        userMessage: 'Cannot connect',
        retryable: true,
        timestamp: new Date().toISOString(),
      };

      const steps = getTroubleshootingSteps(error);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps.some((step) => step.includes('WiFi') || step.includes('connection'))).toBe(true);
    });

    it('should return steps for authentication errors', () => {
      const error = {
        category: ErrorCategory.AUTHENTICATION,
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Unauthorized',
        userMessage: 'Please log in',
        retryable: false,
        timestamp: new Date().toISOString(),
      };

      const steps = getTroubleshootingSteps(error);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps.some((step) => step.includes('email') || step.includes('password'))).toBe(true);
    });

    it('should return default steps for unknown errors', () => {
      const error = {
        category: ErrorCategory.UNKNOWN,
        code: ERROR_CODES.UNKNOWN,
        message: 'Unknown',
        userMessage: 'An error occurred',
        retryable: false,
        timestamp: new Date().toISOString(),
      };

      const steps = getTroubleshootingSteps(error);

      expect(steps.length).toBeGreaterThan(0);
    });
  });

  describe('getDetailedErrorInfo', () => {
    it('should return complete error information', () => {
      const error = {
        category: ErrorCategory.TIMEOUT,
        code: ERROR_CODES.TIMEOUT,
        message: 'timeout of 30000ms exceeded',
        userMessage: 'Request timed out',
        technicalMessage: 'timeout of 30000ms exceeded | Code: ECONNABORTED',
        retryable: true,
        timestamp: new Date().toISOString(),
      };

      const info = getDetailedErrorInfo(error);

      expect(info).toHaveProperty('summary');
      expect(info).toHaveProperty('details');
      expect(info).toHaveProperty('troubleshooting');
      expect(info).toHaveProperty('technicalInfo');

      expect(typeof info.summary).toBe('string');
      expect(Array.isArray(info.details)).toBe(true);
      expect(Array.isArray(info.troubleshooting)).toBe(true);
    });

    it('should include all required details', () => {
      const error = {
        category: ErrorCategory.NETWORK,
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Network Error',
        userMessage: 'Cannot connect',
        retryable: true,
        timestamp: new Date().toISOString(),
      };

      const info = getDetailedErrorInfo(error);

      expect(info.details.length).toBeGreaterThanOrEqual(4);
      expect(info.details.some((d) => d.includes('Error Code'))).toBe(true);
      expect(info.details.some((d) => d.includes('Category'))).toBe(true);
      expect(info.details.some((d) => d.includes('Retryable'))).toBe(true);
      expect(info.details.some((d) => d.includes('Timestamp'))).toBe(true);
    });
  });
});

describe('Retry Configuration', () => {
  describe('calculateBackoffDelay', () => {
    it('should calculate exponential backoff correctly', () => {
      const options = RETRY_CONFIGS.auth;

      const delay0 = calculateBackoffDelay(0, options);
      const delay1 = calculateBackoffDelay(1, options);
      const delay2 = calculateBackoffDelay(2, options);

      // First retry should be around 2000ms (±30% jitter)
      expect(delay0).toBeGreaterThanOrEqual(1400);
      expect(delay0).toBeLessThanOrEqual(2600);

      // Second retry should be around 4000ms (±30% jitter)
      expect(delay1).toBeGreaterThanOrEqual(2800);
      expect(delay1).toBeLessThanOrEqual(5200);

      // Third retry should be around 8000ms (±30% jitter)
      expect(delay2).toBeGreaterThanOrEqual(5600);
      expect(delay2).toBeLessThanOrEqual(10000); // Capped at maxDelayMs
    });

    it('should not exceed max delay', () => {
      const options = RETRY_CONFIGS.auth;

      const delay10 = calculateBackoffDelay(10, options);

      expect(delay10).toBeLessThanOrEqual(options.maxDelayMs);
    });

    it('should add jitter to prevent thundering herd', () => {
      const options = RETRY_CONFIGS.auth;

      const delays = [];
      for (let i = 0; i < 10; i++) {
        delays.push(calculateBackoffDelay(1, options));
      }

      // Not all delays should be exactly the same (jitter adds randomness)
      const uniqueDelays = new Set(delays);
      expect(uniqueDelays.size).toBeGreaterThan(1);
    });
  });

  describe('shouldRetryRequest', () => {
    it('should retry timeout errors', () => {
      const error = {
        code: 'ECONNABORTED',
        message: 'timeout',
        isAxiosError: true,
      } as AxiosError;

      const shouldRetry = shouldRetryRequest(error, 0, RETRY_CONFIGS.auth);
      expect(shouldRetry).toBe(true);
    });

    it('should retry network errors', () => {
      const error = {
        message: 'Network Error',
        isAxiosError: true,
      } as AxiosError;

      const shouldRetry = shouldRetryRequest(error, 0, RETRY_CONFIGS.auth);
      expect(shouldRetry).toBe(true);
    });

    it('should retry 5xx errors', () => {
      const error = {
        response: { status: 500 },
        isAxiosError: true,
      } as AxiosError;

      const shouldRetry = shouldRetryRequest(error, 0, RETRY_CONFIGS.auth);
      expect(shouldRetry).toBe(true);
    });

    it('should not retry after max retries', () => {
      const error = {
        code: 'ECONNABORTED',
        isAxiosError: true,
      } as AxiosError;

      const shouldRetry = shouldRetryRequest(error, 3, RETRY_CONFIGS.auth);
      expect(shouldRetry).toBe(false);
    });

    it('should not retry 4xx client errors', () => {
      const error = {
        response: { status: 400 },
        isAxiosError: true,
      } as AxiosError;

      const shouldRetry = shouldRetryRequest(error, 0, RETRY_CONFIGS.auth);
      expect(shouldRetry).toBe(false);
    });
  });

  describe('RETRY_CONFIGS', () => {
    it('should have auth config with correct values', () => {
      const authConfig = RETRY_CONFIGS.auth;

      expect(authConfig.maxRetries).toBe(3);
      expect(authConfig.initialDelayMs).toBe(2000);
      expect(authConfig.maxDelayMs).toBe(10000);
      expect(authConfig.backoffMultiplier).toBe(2);
    });

    it('should have mutation config with correct values', () => {
      const mutationConfig = RETRY_CONFIGS.mutation;

      expect(mutationConfig.maxRetries).toBe(3);
      expect(mutationConfig.initialDelayMs).toBe(2000);
      expect(mutationConfig.maxDelayMs).toBe(10000);
    });

    it('should include retryable error codes', () => {
      const authConfig = RETRY_CONFIGS.auth;

      expect(authConfig.retryableErrors).toContain('ECONNABORTED');
      expect(authConfig.retryableErrors).toContain('ETIMEDOUT');
      expect(authConfig.retryableErrors).toContain('ENOTFOUND');
      expect(authConfig.retryableErrors).toContain('ENETUNREACH');
    });

    it('should include retryable status codes', () => {
      const authConfig = RETRY_CONFIGS.auth;

      expect(authConfig.retryableStatuses).toContain(408);
      expect(authConfig.retryableStatuses).toContain(500);
      expect(authConfig.retryableStatuses).toContain(502);
      expect(authConfig.retryableStatuses).toContain(503);
      expect(authConfig.retryableStatuses).toContain(504);
    });
  });
});

describe('Integration Tests', () => {
  describe('Error Flow', () => {
    it('should handle timeout error end-to-end', () => {
      const axiosError = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
        isAxiosError: true,
      } as AxiosError;

      // Categorize
      const category = categorizeError(axiosError);
      expect(category).toBe(ErrorCategory.TIMEOUT);

      // Get error code
      const code = getErrorCode(axiosError);
      expect(code).toBe(ERROR_CODES.TIMEOUT);

      // Create app error
      const appError = {
        category,
        code,
        message: axiosError.message,
        userMessage: 'Request timed out',
        retryable: true,
        timestamp: new Date().toISOString(),
      };

      // Get troubleshooting steps
      const steps = getTroubleshootingSteps(appError);
      expect(steps.length).toBeGreaterThan(0);

      // Get detailed info
      const info = getDetailedErrorInfo(appError);
      expect(info.summary).toBeTruthy();
      expect(info.troubleshooting.length).toBeGreaterThan(0);
    });
  });

  describe('Retry Flow', () => {
    it('should calculate correct retry timeline', () => {
      const options = RETRY_CONFIGS.auth;

      // Simulate retry attempts
      const delays = [];
      for (let i = 0; i < options.maxRetries; i++) {
        delays.push(calculateBackoffDelay(i, options));
      }

      // Total delay should be reasonable
      const totalDelay = delays.reduce((sum, delay) => sum + delay, 0);

      // With 3 retries: ~2s + ~4s + ~8s = ~14s (±30% jitter)
      expect(totalDelay).toBeGreaterThan(10000); // At least 10s
      expect(totalDelay).toBeLessThan(20000); // At most 20s
    });
  });
});

// Export for use in other test files
export {};
