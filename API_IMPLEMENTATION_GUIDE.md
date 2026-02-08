# API Implementation Guide

Complete guide for the enhanced API layer with retry logic, error handling, and network utilities.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Module Documentation](#module-documentation)
4. [Usage Examples](#usage-examples)
5. [Configuration](#configuration)
6. [Best Practices](#best-practices)
7. [Migration Guide](#migration-guide)
8. [Testing](#testing)

---

## Overview

The enhanced API layer provides:

- ✅ **Automatic retry with exponential backoff** - Failed requests are automatically retried
- ✅ **Request deduplication** - Prevents duplicate simultaneous requests
- ✅ **Network connectivity detection** - Checks internet and server availability
- ✅ **Comprehensive error handling** - User-friendly error messages
- ✅ **Request/response logging** - Detailed logging for debugging
- ✅ **Configurable timeouts** - Different timeouts per endpoint type
- ✅ **Retry statistics** - Monitor retry success rates
- ✅ **Diagnostic tools** - Built-in testing and debugging utilities

---

## Architecture

### Module Structure

```
src/lib/
├── api.ts              # Main API module with retry logic
├── retryConfig.ts      # Retry strategies and configuration
├── errorHandler.ts     # Error categorization and handling
├── networkUtils.ts     # Network connectivity utilities
├── apiTester.ts        # Diagnostic and testing tools
└── tokenManager.ts     # JWT token management (existing)
```

### Request Flow

```
User Request
    ↓
API Module (api.ts)
    ↓
Request Interceptor
    ├── Add auth token
    ├── Add metadata
    └── Log request
    ↓
Network Check (optional)
    ↓
Axios Request
    ↓
Response Interceptor
    ├── Success → Return data
    └── Error → Retry Logic
        ├── Check if retryable
        ├── Exponential backoff
        ├── Retry request
        └── Transform error
    ↓
User receives response/error
```

---

## Module Documentation

### 1. api.ts - Main API Module

The core module that handles all HTTP requests with retry logic.

#### Basic Usage

```typescript
import api from '@/lib/api';

// GET request
const data = await api.get('/api/v1/users');

// POST request
const result = await api.post('/api/v1/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});

// PUT request
const updated = await api.put('/api/v1/users/123', {
  name: 'New Name',
});

// DELETE request
await api.delete('/api/v1/users/123');
```

#### Advanced Features

```typescript
// Request with network check (fails fast if no internet)
const data = await api.requestWithNetworkCheck({
  method: 'GET',
  url: '/api/v1/data',
});

// Request with server check (verifies server is reachable)
const data = await api.requestWithServerCheck({
  method: 'POST',
  url: '/api/v1/action',
  data: { key: 'value' },
});

// Deduplicated request (prevents duplicate simultaneous requests)
const data = await api.dedupedRequest({
  method: 'GET',
  url: '/api/v1/expensive-operation',
});

// Skip retry for specific request
const data = await api.post('/api/v1/critical', data, {
  skipRetry: true,
});

// Skip deduplication for specific request
const data = await api.get('/api/v1/realtime', {
  skipDeduplication: true,
});
```

#### Monitoring

```typescript
// Get retry statistics
const stats = api.getRetryStats();
console.log('Retry Statistics:', {
  totalRequests: stats.totalRequests,
  retriedRequests: stats.retriedRequests,
  retryRate: stats.retryRate,
  retrySuccessRate: stats.retrySuccessRate,
});

// Reset statistics
api.resetRetryStats();

// Get pending request count
const pendingCount = api.getPendingRequestCount();

// Clear deduplication cache
api.clearDeduplicationCache();
```

---

### 2. retryConfig.ts - Retry Configuration

Configures retry strategies with exponential backoff.

#### Retry Configurations

```typescript
import { RETRY_CONFIGS } from '@/lib/retryConfig';

// Available configurations:
// - auth: For authentication endpoints (2 retries, fast)
// - fetch: For data fetching (3 retries, moderate)
// - mutation: For POST/PUT/DELETE (2 retries, careful)
// - critical: For critical operations (1 retry, minimal)
```

#### Custom Retry Logic

```typescript
import { retryRequest, RetryOptions } from '@/lib/retryConfig';

const customRetryOptions: RetryOptions = {
  maxRetries: 5,
  initialDelayMs: 500,
  maxDelayMs: 15000,
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['ECONNABORTED', 'ETIMEDOUT'],
  onRetry: (retryCount, error, delayMs) => {
    console.log(`Retrying (${retryCount}) after ${delayMs}ms`);
  },
};

// Use custom retry
const result = await retryRequest(() => api.get('/api/v1/data'), customRetryOptions);
```

#### Exponential Backoff

The retry delay increases exponentially:

- Attempt 1: 1 second
- Attempt 2: 2 seconds
- Attempt 3: 4 seconds
- Attempt 4: 8 seconds (capped at maxDelayMs)

With jitter (±30% random variation) to prevent thundering herd.

---

### 3. errorHandler.ts - Error Handling

Categorizes errors and provides user-friendly messages.

#### Error Categories

```typescript
import { ErrorCategory } from '@/lib/errorHandler';

// Available categories:
// - NETWORK: Network connectivity issues
// - TIMEOUT: Request timeout errors
// - SERVER: Server errors (5xx)
// - CLIENT: Client errors (4xx)
// - AUTHENTICATION: Auth errors (401, 403)
// - VALIDATION: Validation errors (400, 422)
// - UNKNOWN: Unknown errors
```

#### Usage in Components

```typescript
import { handleError, getErrorSummary } from '@/lib/errorHandler';

try {
  await api.post('/api/v1/action', data);
} catch (error) {
  const appError = handleError(error, 'Action Failed');

  // Show user-friendly message
  Alert.alert('Error', appError.userMessage);

  // Or get detailed summary
  const summary = getErrorSummary(appError);
  Alert.alert('Error', summary);

  // Check if retryable
  if (appError.retryable) {
    // Show retry button
  }
}
```

#### Custom Error Messages

```typescript
import { createError, ErrorCategory } from '@/lib/errorHandler';

const customError = createError(
  ErrorCategory.VALIDATION,
  'CUSTOM_ERROR',
  'Technical message',
  'User-friendly message'
);

throw customError;
```

---

### 4. networkUtils.ts - Network Utilities

Provides network connectivity checking and diagnostics.

#### Check Internet Connectivity

```typescript
import { checkInternetConnectivity } from '@/lib/networkUtils';

const hasInternet = await checkInternetConnectivity();
if (!hasInternet) {
  Alert.alert('No Internet', 'Please check your connection');
}
```

#### Check Server Reachability

```typescript
import { checkServerReachability } from '@/lib/networkUtils';

const serverCheck = await checkServerReachability();
if (!serverCheck.reachable) {
  Alert.alert('Server Unreachable', serverCheck.error);
} else {
  console.log(`Server latency: ${serverCheck.latency}ms`);
}
```

#### Comprehensive Connection Check

```typescript
import { performConnectionCheck } from '@/lib/networkUtils';

const check = await performConnectionCheck();
console.log('Connection Status:', {
  hasInternet: check.hasInternet,
  canReachServer: check.canReachServer,
  latency: check.latency,
  error: check.error,
});
```

#### Network Diagnostics

```typescript
import { getNetworkDiagnostics } from '@/lib/networkUtils';

const diagnostics = await getNetworkDiagnostics();
console.log('Network Diagnostics:', diagnostics);
```

#### Wait for Network

```typescript
import { waitForNetwork } from '@/lib/networkUtils';

// Wait up to 30 seconds for network to become available
const hasNetwork = await waitForNetwork(30000, 2000);
if (hasNetwork) {
  // Retry request
}
```

---

### 5. apiTester.ts - Testing & Diagnostics

Built-in tools for testing and debugging API connectivity.

#### Quick Test

```typescript
import apiTester from '@/lib/apiTester';

// Quick connectivity test
const isReachable = await apiTester.quickTest();
```

#### Health Check

```typescript
const health = await apiTester.checkBackendHealth();
console.log('Backend Health:', health);
```

#### Test Specific Endpoint

```typescript
const result = await apiTester.testEndpoint('/api/v1/users', 'GET');
console.log('Endpoint Test:', result);
```

#### Comprehensive Diagnostics

```typescript
const diagnostics = await apiTester.runDiagnostics();
apiTester.printDiagnosticReport(diagnostics);
```

#### Monitor Backend

```typescript
// Monitor backend for 30 seconds, checking every 5 seconds
await apiTester.monitorBackend(5000, 30000);
```

#### Test Custom URL

```typescript
await apiTester.testCustomUrl('http://192.168.1.5:8000');
```

---

## Usage Examples

### Example 1: Login with Error Handling

```typescript
import { useState } from 'react';
import { Alert } from 'react-native';
import api from '@/lib/api';
import { handleError } from '@/lib/errorHandler';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
      });

      // Success
      return response;
    } catch (error) {
      // Error is already transformed by API module
      const appError = error as any;

      // Show user-friendly message
      Alert.alert('Login Failed', appError.userMessage);

      // Log for debugging
      console.error('Login error:', appError);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
```

### Example 2: Data Fetching with Network Check

```typescript
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { checkInternetConnectivity } from '@/lib/networkUtils';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Check internet before making request
      const hasInternet = await checkInternetConnectivity();
      if (!hasInternet) {
        throw {
          code: 'NO_INTERNET',
          userMessage: 'No internet connection',
        };
      }

      // Make request (will auto-retry on failure)
      return api.get('/api/v1/users');
    },
    retry: false, // Disable React Query retry (API handles it)
  });
};
```

### Example 3: Form Submission with Validation

```typescript
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { ErrorCategory } from '@/lib/errorHandler';

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (userData: any) => {
      return api.post('/api/v1/users', userData);
    },
    onError: (error: any) => {
      // Handle different error types
      if (error.category === ErrorCategory.VALIDATION) {
        // Show validation errors
        Alert.alert('Validation Error', error.userMessage);
      } else if (error.category === ErrorCategory.NETWORK) {
        // Show network error
        Alert.alert('Network Error', error.userMessage);
      } else {
        // Show generic error
        Alert.alert('Error', error.userMessage);
      }
    },
  });
};
```

### Example 4: Diagnostic Screen

```typescript
import { useState } from 'react';
import { View, Button, Text, ScrollView } from 'react-native';
import apiTester from '@/lib/apiTester';
import api from '@/lib/api';

export default function DiagnosticScreen() {
  const [result, setResult] = useState('');

  const runDiagnostics = async () => {
    setResult('Running diagnostics...');
    const diagnostics = await apiTester.runDiagnostics();
    setResult(JSON.stringify(diagnostics, null, 2));
  };

  const showStats = () => {
    const stats = api.getRetryStats();
    setResult(JSON.stringify(stats, null, 2));
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Button title="Run Diagnostics" onPress={runDiagnostics} />
      <Button title="Show Retry Stats" onPress={showStats} />
      <Button title="Reset Stats" onPress={() => api.resetRetryStats()} />
      <Text style={{ marginTop: 20, fontFamily: 'monospace' }}>{result}</Text>
    </ScrollView>
  );
}
```

---

## Configuration

### Timeout Configuration

Default timeout is 15 seconds. Customize per request:

```typescript
// Short timeout for quick operations
await api.get('/api/v1/quick', { timeout: 5000 });

// Long timeout for heavy operations
await api.post('/api/v1/heavy', data, { timeout: 30000 });
```

### Retry Configuration

Modify retry behavior in `src/lib/retryConfig.ts`:

```typescript
export const RETRY_CONFIGS = {
  auth: {
    maxRetries: 2,
    initialDelayMs: 1000,
    maxDelayMs: 5000,
    backoffMultiplier: 2,
  },
  // ... other configs
};
```

### Error Messages

Customize error messages in `src/lib/errorHandler.ts`:

```typescript
const USER_MESSAGES: Record<string, string> = {
  TIMEOUT: 'Your custom timeout message',
  NETWORK_ERROR: 'Your custom network error message',
  // ... other messages
};
```

---

## Best Practices

### 1. Use Appropriate Request Methods

```typescript
// ✅ Good - Use specific methods
await api.get('/api/v1/users');
await api.post('/api/v1/users', data);

// ❌ Avoid - Generic request
await api.axios.request({ method: 'GET', url: '/api/v1/users' });
```

### 2. Handle Errors Properly

```typescript
// ✅ Good - Handle specific error types
try {
  await api.post('/api/v1/action', data);
} catch (error: any) {
  if (error.category === ErrorCategory.NETWORK) {
    // Handle network error
  } else if (error.category === ErrorCategory.VALIDATION) {
    // Handle validation error
  }
}

// ❌ Avoid - Generic error handling
try {
  await api.post('/api/v1/action', data);
} catch (error) {
  Alert.alert('Error', 'Something went wrong');
}
```

### 3. Use Network Checks for Critical Operations

```typescript
// ✅ Good - Check network before critical operation
const hasInternet = await checkInternetConnectivity();
if (!hasInternet) {
  Alert.alert('No Internet', 'Please connect to continue');
  return;
}
await api.post('/api/v1/critical', data);

// ❌ Avoid - Blindly making request
await api.post('/api/v1/critical', data);
```

### 4. Disable Retry for Non-Idempotent Operations

```typescript
// ✅ Good - Disable retry for payment
await api.post('/api/v1/payment', data, { skipRetry: true });

// ❌ Avoid - Auto-retry payment (could charge twice)
await api.post('/api/v1/payment', data);
```

### 5. Monitor Retry Statistics

```typescript
// ✅ Good - Monitor and log stats
useEffect(() => {
  const interval = setInterval(() => {
    const stats = api.getRetryStats();
    if (stats.retryRate > 50) {
      console.warn('High retry rate detected:', stats);
    }
  }, 60000); // Check every minute

  return () => clearInterval(interval);
}, []);
```

---

## Migration Guide

### From Old API to Enhanced API

The enhanced API is backward compatible. No changes required for basic usage:

```typescript
// Old code (still works)
import api from '@/lib/api';
const data = await api.get('/api/v1/users');

// New features available
const stats = api.getRetryStats();
```

### Updating Error Handling

```typescript
// Old error handling
try {
  await api.post('/api/v1/action', data);
} catch (error: any) {
  if (error.code === 'TIMEOUT') {
    Alert.alert('Timeout', error.message);
  }
}

// New error handling (recommended)
try {
  await api.post('/api/v1/action', data);
} catch (error: any) {
  // Error is already transformed
  Alert.alert('Error', error.userMessage);

  // Check category for specific handling
  if (error.category === ErrorCategory.TIMEOUT) {
    // Handle timeout
  }
}
```

---

## Testing

### Unit Testing

```typescript
import api from '@/lib/api';
import { checkInternetConnectivity } from '@/lib/networkUtils';

describe('API Module', () => {
  it('should retry failed requests', async () => {
    // Mock failed request
    jest
      .spyOn(api.axios, 'request')
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ data: { success: true } });

    const result = await api.get('/test');
    expect(result).toEqual({ success: true });
  });

  it('should check internet connectivity', async () => {
    const hasInternet = await checkInternetConnectivity();
    expect(typeof hasInternet).toBe('boolean');
  });
});
```

### Integration Testing

```typescript
import apiTester from '@/lib/apiTester';

describe('API Integration', () => {
  it('should connect to backend', async () => {
    const health = await apiTester.checkBackendHealth();
    expect(health.healthy).toBe(true);
  });

  it('should handle authentication', async () => {
    const result = await apiTester.testEndpoint('/api/v1/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'password',
    });
    expect(result.success).toBe(true);
  });
});
```

---

## Troubleshooting

### Issue: Requests are not retrying

**Solution:** Check if retry is disabled:

```typescript
// Enable retry (default)
await api.get('/api/v1/data');

// Don't disable retry unless necessary
await api.get('/api/v1/data', { skipRetry: false });
```

### Issue: Too many retries

**Solution:** Adjust retry configuration:

```typescript
// Reduce retries in retryConfig.ts
export const RETRY_CONFIGS = {
  fetch: {
    maxRetries: 1, // Reduce from 3 to 1
    // ...
  },
};
```

### Issue: Slow requests

**Solution:** Check retry statistics:

```typescript
const stats = api.getRetryStats();
console.log('Retry rate:', stats.retryRate);
console.log('Average retries:', stats.averageRetryAttempts);
```

---

## Support

For issues or questions:

1. Check [API_DEBUGGING_GUIDE.md](./API_DEBUGGING_GUIDE.md)
2. Run diagnostics: `apiTester.runDiagnostics()`
3. Check retry stats: `api.getRetryStats()`
4. Review error logs in console
5. Verify backend is running and reachable

---

## Summary

The enhanced API layer provides:

- 🔄 Automatic retry with exponential backoff
- 🔍 Network connectivity detection
- 📊 Request deduplication
- 🎯 Comprehensive error handling
- 📝 Detailed logging
- 🧪 Built-in diagnostic tools
- ⚙️ Configurable timeouts and retry strategies
- 📈 Retry statistics monitoring

All features work seamlessly with existing code while providing powerful new capabilities for handling network issues and improving app reliability.
