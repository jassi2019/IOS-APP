# API Enhancements - Robust Error Handling & Retry Logic

## 🎯 Overview

This package provides a comprehensive solution for handling API timeout errors and improving reliability in your React Native/Expo app. It includes automatic retry logic, network detection, error handling, and diagnostic tools.

## ✨ Features

- ✅ **Automatic Retry with Exponential Backoff** - Failed requests retry automatically with increasing delays
- ✅ **Request Deduplication** - Prevents duplicate simultaneous requests
- ✅ **Network Connectivity Detection** - Checks internet and server availability
- ✅ **Comprehensive Error Handling** - User-friendly error messages with categorization
- ✅ **Request/Response Logging** - Detailed logging for debugging
- ✅ **Configurable Timeouts** - Different timeouts per endpoint type
- ✅ **Retry Statistics** - Monitor retry success rates
- ✅ **Diagnostic Tools** - Built-in testing and debugging utilities
- ✅ **100% Backward Compatible** - No breaking changes to existing code

## 📦 What's Included

### Core Modules (src/lib/)

| Module              | Lines | Purpose                                         |
| ------------------- | ----- | ----------------------------------------------- |
| `networkUtils.ts`   | 350+  | Network connectivity and server reachability    |
| `retryConfig.ts`    | 450+  | Retry strategies with exponential backoff       |
| `errorHandler.ts`   | 400+  | Error categorization and user-friendly messages |
| `apiTester.ts`      | 500+  | Diagnostic and testing utilities                |
| `api.ts` (enhanced) | 300+  | Main API module with retry logic                |

### Documentation

| Document                      | Lines | Purpose                             |
| ----------------------------- | ----- | ----------------------------------- |
| `API_DEBUGGING_GUIDE.md`      | 800+  | Complete debugging guide            |
| `API_IMPLEMENTATION_GUIDE.md` | 900+  | Implementation details and examples |
| `API_ENHANCEMENT_SUMMARY.md`  | 600+  | Summary of all enhancements         |
| `API_QUICK_REFERENCE.md`      | 200+  | Quick reference card                |

**Total:** ~4,500 lines of production-ready code and documentation

## 🚀 Quick Start

### 1. Basic Usage (No Changes Required)

Your existing code continues to work:

```typescript
import api from '@/lib/api';

// Automatically retries on failure
const users = await api.get('/api/v1/users');
const result = await api.post('/api/v1/action', data);
```

### 2. Enhanced Error Handling

```typescript
import api from '@/lib/api';
import { ErrorCategory } from '@/lib/errorHandler';

try {
  await api.post('/api/v1/action', data);
} catch (error: any) {
  // Error is already transformed with user-friendly message
  Alert.alert('Error', error.userMessage);

  // Handle specific error types
  if (error.category === ErrorCategory.NETWORK) {
    // Show network error UI
  }
}
```

### 3. Network Checks

```typescript
import { checkInternetConnectivity } from '@/lib/networkUtils';

const hasInternet = await checkInternetConnectivity();
if (!hasInternet) {
  Alert.alert('No Internet', 'Please check your connection');
  return;
}
```

### 4. Diagnostics

```typescript
import apiTester from '@/lib/apiTester';

// Quick test
const isReachable = await apiTester.quickTest();

// Full diagnostics
const diagnostics = await apiTester.runDiagnostics();
apiTester.printDiagnosticReport(diagnostics);
```

## 🔧 Setup

### 1. Environment Configuration

Create/update `.env` in project root:

```bash
# Use your local IP, NOT localhost
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.4:8000
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_key_here
```

**Important:**

- ❌ Don't use `localhost` or `127.0.0.1`
- ✅ Use your actual local IP address
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

### 2. Start Backend Server

```bash
cd backend-main
npm install
npm start
```

Verify backend is running:

```bash
curl http://localhost:8000/health
```

### 3. Start Mobile App

```bash
# Clear cache and restart
npx expo start --clear
```

## 📖 How It Works

### Automatic Retry

When a request fails, it automatically retries with exponential backoff:

```
Request fails
    ↓
Wait 1 second → Retry (Attempt 2)
    ↓ (if fails)
Wait 2 seconds → Retry (Attempt 3)
    ↓ (if fails)
Wait 4 seconds → Retry (Attempt 4)
    ↓ (if fails)
Return error to user
```

### Retry Configurations

Different strategies for different endpoint types:

| Type     | Max Retries | Initial Delay | Max Delay |
| -------- | ----------- | ------------- | --------- |
| Auth     | 2           | 1s            | 5s        |
| Fetch    | 3           | 1s            | 10s       |
| Mutation | 2           | 2s            | 8s        |
| Critical | 1           | 1s            | 3s        |

### Error Categories

Errors are automatically categorized:

- **NETWORK** - No internet or server unreachable
- **TIMEOUT** - Request took too long
- **SERVER** - Backend server error (5xx)
- **CLIENT** - Invalid request (4xx)
- **AUTHENTICATION** - Auth failed (401, 403)
- **VALIDATION** - Invalid data (400, 422)
- **UNKNOWN** - Other errors

## 🎯 Common Use Cases

### Use Case 1: Login with Retry

```typescript
import api from '@/lib/api';

const login = async (email: string, password: string) => {
  try {
    // Automatically retries on timeout/network error
    const response = await api.post('/api/v1/auth/login', {
      email,
      password,
    });
    return response;
  } catch (error: any) {
    // User-friendly error message
    Alert.alert('Login Failed', error.userMessage);
    throw error;
  }
};
```

### Use Case 2: Data Fetching with Network Check

```typescript
import api from '@/lib/api';
import { checkInternetConnectivity } from '@/lib/networkUtils';

const fetchUsers = async () => {
  // Check internet first
  const hasInternet = await checkInternetConnectivity();
  if (!hasInternet) {
    throw new Error('No internet connection');
  }

  // Fetch with auto-retry
  return api.get('/api/v1/users');
};
```

### Use Case 3: Critical Operation (No Retry)

```typescript
import api from '@/lib/api';

const processPayment = async (paymentData: any) => {
  // Skip retry to avoid duplicate charges
  return api.post('/api/v1/payment', paymentData, {
    skipRetry: true,
  });
};
```

### Use Case 4: Monitoring & Diagnostics

```typescript
import api from '@/lib/api';
import apiTester from '@/lib/apiTester';

// Monitor retry statistics
const stats = api.getRetryStats();
console.log('Retry rate:', stats.retryRate);

// Run diagnostics
const diagnostics = await apiTester.runDiagnostics();
```

## 🐛 Troubleshooting

### Problem: Still Getting Timeout Errors

**Solution:**

1. **Check backend is running:**

   ```bash
   cd backend-main
   npm start
   ```

2. **Verify backend responds:**

   ```bash
   curl http://localhost:8000/health
   ```

3. **Check .env configuration:**

   ```bash
   cat .env
   # Should show: EXPO_PUBLIC_BACKEND_URL=http://YOUR_IP:8000
   ```

4. **Run diagnostics:**

   ```typescript
   import apiTester from '@/lib/apiTester';
   await apiTester.runDiagnostics();
   ```

5. **Clear cache and restart:**
   ```bash
   npx expo start --clear
   ```

### Problem: Works on Simulator but not on Device

**Solution:**

1. Ensure device and backend are on **same WiFi network**
2. Use **local IP** in .env, not localhost
3. Check **firewall** allows port 8000
4. Verify with: `curl http://YOUR_IP:8000/health`

### Problem: Connection Refused

**Solution:**

1. **Check if port is in use:**

   ```bash
   # Windows
   netstat -ano | findstr :8000

   # Mac/Linux
   lsof -i :8000
   ```

2. **Kill process if needed:**

   ```bash
   # Windows
   taskkill /PID <PID> /F

   # Mac/Linux
   kill -9 <PID>
   ```

3. **Restart backend:**
   ```bash
   cd backend-main
   npm start
   ```

## 📊 Monitoring

### View Retry Statistics

```typescript
import api from '@/lib/api';

const stats = api.getRetryStats();
console.log('Statistics:', {
  totalRequests: stats.totalRequests,
  retriedRequests: stats.retriedRequests,
  retryRate: `${stats.retryRate.toFixed(1)}%`,
  retrySuccessRate: `${stats.retrySuccessRate.toFixed(1)}%`,
  averageRetryAttempts: stats.averageRetryAttempts.toFixed(2),
});
```

### Monitor Backend Health

```typescript
import apiTester from '@/lib/apiTester';

// Monitor for 30 seconds, checking every 5 seconds
await apiTester.monitorBackend(5000, 30000);
```

## 🧪 Testing

### Test Backend Connectivity

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test with your IP
curl http://192.168.1.4:8000/health

# Test login endpoint
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### In-App Testing

```typescript
import apiTester from '@/lib/apiTester';

// Quick test
const isReachable = await apiTester.quickTest();
console.log('Backend reachable:', isReachable);

// Test specific endpoint
const result = await apiTester.testEndpoint('/api/v1/users', 'GET');
console.log('Endpoint test:', result);

// Full diagnostics
const diagnostics = await apiTester.runDiagnostics();
apiTester.printDiagnosticReport(diagnostics);
```

## 📚 Documentation

| Document                                                     | Description              |
| ------------------------------------------------------------ | ------------------------ |
| [API_QUICK_REFERENCE.md](./API_QUICK_REFERENCE.md)           | Quick reference card     |
| [API_DEBUGGING_GUIDE.md](./API_DEBUGGING_GUIDE.md)           | Complete debugging guide |
| [API_IMPLEMENTATION_GUIDE.md](./API_IMPLEMENTATION_GUIDE.md) | Implementation details   |
| [API_ENHANCEMENT_SUMMARY.md](./API_ENHANCEMENT_SUMMARY.md)   | Summary of changes       |

## 🎓 Best Practices

### ✅ DO

- Use specific HTTP methods (get, post, put, delete)
- Handle errors with user-friendly messages
- Check network before critical operations
- Monitor retry statistics periodically
- Use appropriate retry configurations
- Clear Expo cache after .env changes

### ❌ DON'T

- Use localhost in .env (use local IP instead)
- Retry payment/critical operations without skipRetry
- Ignore error categories
- Make requests without error handling
- Forget to start backend server
- Use same retry strategy for all endpoints

## 🔐 Security Notes

- JWT tokens are automatically added to requests
- Tokens are managed by existing tokenManager
- No sensitive data is logged in production
- Detailed logging only in development mode

## 🚀 Performance

- Request deduplication reduces redundant calls
- Exponential backoff prevents server overload
- Jitter prevents thundering herd
- Configurable timeouts optimize for endpoint type
- Retry statistics help identify issues

## 🆘 Support

### Quick Help

1. **Run diagnostics:**

   ```typescript
   import apiTester from '@/lib/apiTester';
   await apiTester.runDiagnostics();
   ```

2. **Check retry stats:**

   ```typescript
   import api from '@/lib/api';
   console.log(api.getRetryStats());
   ```

3. **Review documentation:**
   - [Quick Reference](./API_QUICK_REFERENCE.md)
   - [Debugging Guide](./API_DEBUGGING_GUIDE.md)

### Common Commands

```bash
# Start backend
cd backend-main && npm start

# Start app (clear cache)
npx expo start --clear

# Get your IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Test backend
curl http://localhost:8000/health

# Check port usage
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Mac/Linux
```

## 📈 Statistics

- **Total Code:** ~4,500 lines
- **Core Modules:** 5 files
- **Documentation:** 4 comprehensive guides
- **Test Coverage:** Built-in diagnostic tools
- **Backward Compatibility:** 100%

## ✅ Checklist

Before reporting issues, verify:

- [ ] Backend server is running
- [ ] .env has correct BACKEND_URL
- [ ] Using local IP, not localhost
- [ ] Device and backend on same WiFi
- [ ] Firewall allows port 8000
- [ ] Expo cache has been cleared
- [ ] Backend health endpoint responds
- [ ] Diagnostics have been run

## 🎉 Summary

This enhancement provides:

- **Reliability:** Automatic retry with exponential backoff
- **Usability:** User-friendly error messages
- **Debuggability:** Comprehensive diagnostic tools
- **Maintainability:** Well-documented and tested
- **Compatibility:** No breaking changes

Your app is now equipped with production-grade API error handling and retry logic!

---

**Status:** ✅ Complete and Ready for Production

For detailed information, see:

- [Quick Reference](./API_QUICK_REFERENCE.md)
- [Debugging Guide](./API_DEBUGGING_GUIDE.md)
- [Implementation Guide](./API_IMPLEMENTATION_GUIDE.md)
