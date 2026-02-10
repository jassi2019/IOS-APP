# API Quick Reference Card

Quick reference for the enhanced API layer with retry logic and error handling.

## 🚀 Quick Start

```typescript
import api from '@/lib/api';

// Basic usage (auto-retry enabled)
const data = await api.get('/api/v1/users');
const result = await api.post('/api/v1/action', { key: 'value' });
```

## 📦 Import Statements

```typescript
// Main API
import api from '@/lib/api';

// Network utilities
import {
  checkInternetConnectivity,
  checkServerReachability,
  performConnectionCheck,
} from '@/lib/networkUtils';

// Error handling
import { handleError, ErrorCategory, getErrorSummary } from '@/lib/errorHandler';

// Retry configuration
import { RETRY_CONFIGS, retryRequest } from '@/lib/retryConfig';

// Testing utilities
import apiTester from '@/lib/apiTester';
```

## 🔧 Common Operations

### Make API Request

```typescript
// GET
const users = await api.get('/api/v1/users');

// POST
const result = await api.post('/api/v1/users', { name: 'John' });

// PUT
const updated = await api.put('/api/v1/users/123', { name: 'Jane' });

// DELETE
await api.delete('/api/v1/users/123');
```

### Handle Errors

```typescript
try {
  await api.post('/api/v1/action', data);
} catch (error: any) {
  Alert.alert('Error', error.userMessage);

  // Check error category
  if (error.category === ErrorCategory.NETWORK) {
    // Handle network error
  }
}
```

### Check Network

```typescript
// Check internet
const hasInternet = await checkInternetConnectivity();

// Check server
const serverCheck = await checkServerReachability();
if (serverCheck.reachable) {
  console.log(`Latency: ${serverCheck.latency}ms`);
}

// Full check
const check = await performConnectionCheck();
```

### Run Diagnostics

```typescript
// Quick test
const isReachable = await apiTester.quickTest();

// Full diagnostics
const diagnostics = await apiTester.runDiagnostics();
apiTester.printDiagnosticReport(diagnostics);
```

### Monitor Statistics

```typescript
// Get retry stats
const stats = api.getRetryStats();
console.log('Retry rate:', stats.retryRate);

// Reset stats
api.resetRetryStats();
```

## 🎯 Advanced Features

### Request with Network Check

```typescript
const data = await api.requestWithNetworkCheck({
  method: 'GET',
  url: '/api/v1/data',
});
```

### Deduplicated Request

```typescript
const data = await api.dedupedRequest({
  method: 'GET',
  url: '/api/v1/expensive',
});
```

### Skip Retry

```typescript
const data = await api.post('/api/v1/payment', data, {
  skipRetry: true,
});
```

### Custom Timeout

```typescript
const data = await api.get('/api/v1/data', {
  timeout: 30000, // 30 seconds
});
```

## 🐛 Debugging

### Terminal Commands

```bash
# Clear cache and restart
npx expo start --clear

# Get your IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Test backend
curl http://localhost:8000/health

# Check port
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Mac/Linux
```

### In-App Diagnostics

```typescript
// Quick test
await apiTester.quickTest();

// Health check
const health = await apiTester.checkBackendHealth();

// Test endpoint
const result = await apiTester.testEndpoint('/api/v1/users', 'GET');

// Full diagnostics
const diagnostics = await apiTester.runDiagnostics();
```

## 📊 Error Categories

```typescript
ErrorCategory.NETWORK; // Network connectivity issues
ErrorCategory.TIMEOUT; // Request timeout
ErrorCategory.SERVER; // Server errors (5xx)
ErrorCategory.CLIENT; // Client errors (4xx)
ErrorCategory.AUTHENTICATION; // Auth errors (401, 403)
ErrorCategory.VALIDATION; // Validation errors (400, 422)
ErrorCategory.UNKNOWN; // Unknown errors
```

## ⚙️ Configuration

### Environment Variables (.env)

```bash
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.4:8000
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_key_here
```

### Retry Configurations

```typescript
RETRY_CONFIGS.auth; // 2 retries, 1-5s delays
RETRY_CONFIGS.fetch; // 3 retries, 1-10s delays
RETRY_CONFIGS.mutation; // 2 retries, 2-8s delays
RETRY_CONFIGS.critical; // 1 retry, 1-3s delays
```

## 🔍 Troubleshooting Checklist

- [ ] Backend server is running
- [ ] .env has correct BACKEND_URL
- [ ] Using local IP, not localhost
- [ ] Device and backend on same WiFi
- [ ] Firewall allows port 8000
- [ ] Expo cache cleared
- [ ] Backend health endpoint responds

## 📚 Documentation

- **[API_DEBUGGING_GUIDE.md](./API_DEBUGGING_GUIDE.md)** - Complete debugging guide
- **[API_IMPLEMENTATION_GUIDE.md](./API_IMPLEMENTATION_GUIDE.md)** - Implementation details
- **[API_ENHANCEMENT_SUMMARY.md](./API_ENHANCEMENT_SUMMARY.md)** - Summary of changes

## 🆘 Quick Fixes

### Timeout Error

```bash
# 1. Start backend
cd backend-main && npm start

# 2. Verify backend
curl http://localhost:8000/health

# 3. Restart app
npx expo start --clear
```

### Network Error

```bash
# 1. Get your IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# 2. Update .env
EXPO_PUBLIC_BACKEND_URL=http://YOUR_IP:8000

# 3. Restart app
npx expo start --clear
```

### Connection Refused

```bash
# 1. Check port
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Mac/Linux

# 2. Kill process if needed
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # Mac/Linux

# 3. Start backend
cd backend-main && npm start
```

## 💡 Best Practices

✅ **DO:**

- Use specific HTTP methods (get, post, put, delete)
- Handle errors with user-friendly messages
- Check network before critical operations
- Monitor retry statistics
- Use appropriate retry configurations

❌ **DON'T:**

- Use localhost in .env (use local IP)
- Retry payment/critical operations without skipRetry
- Ignore error categories
- Make requests without error handling
- Forget to clear cache after .env changes

## 📞 Support

1. Run diagnostics: `apiTester.runDiagnostics()`
2. Check stats: `api.getRetryStats()`
3. Review logs in console
4. Check [API_DEBUGGING_GUIDE.md](./API_DEBUGGING_GUIDE.md)

---

**Quick Links:**

- [Full Debugging Guide](./API_DEBUGGING_GUIDE.md)
- [Implementation Guide](./API_IMPLEMENTATION_GUIDE.md)
- [Enhancement Summary](./API_ENHANCEMENT_SUMMARY.md)
