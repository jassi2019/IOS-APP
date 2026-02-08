# Comprehensive Testing Guide - Network Timeout Fixes

## Overview

This guide provides step-by-step instructions for thoroughly testing all network timeout fixes and improvements.

## Prerequisites

### 1. Environment Setup

```bash
# Ensure backend is running
cd backend-main
npm install
npm start

# In another terminal, start the mobile app
cd mobile-app-main
npm install
npx expo start --clear
```

### 2. Testing Tools

- React Native Debugger or Chrome DevTools
- Network throttling tools (Chrome DevTools)
- Backend server logs visible
- Console logs enabled in app

## Test Suite 1: Critical Path Testing

### Test 1.1: Registration with Backend Running

**Objective:** Verify registration flow completes successfully with new timeout settings

**Steps:**

1. Start backend server
2. Launch mobile app
3. Navigate to Registration screen
4. Enter email: `test@example.com`
5. Click Submit button
6. Observe console logs

**Expected Results:**

- ✅ Request completes within 30 seconds
- ✅ Console shows: `📤 [req_xxx] POST /api/v1/auth/register/email/verification`
- ✅ Console shows timeout: `30000ms`
- ✅ Success response or appropriate error message
- ✅ No timeout errors

**Console Log Pattern to Look For:**

```
📤 [req_1234567890_abc123] POST /api/v1/auth/register/email/verification
   retry: Initial
   timeout: 30000ms
✅ [req_1234567890_abc123] 200 /api/v1/auth/register/email/verification
   duration: XXXms
   retry: First attempt
```

### Test 1.2: Login Flow

**Objective:** Verify login works with new timeout settings

**Steps:**

1. Navigate to Login screen
2. Enter credentials
3. Click Login button
4. Observe console logs

**Expected Results:**

- ✅ Request completes within 30 seconds
- ✅ Proper timeout configuration applied
- ✅ Successful login or appropriate error

### Test 1.3: Password Reset Flow

**Objective:** Verify password reset works with new timeout settings

**Steps:**

1. Navigate to Forgot Password screen
2. Enter email
3. Click Submit
4. Observe console logs

**Expected Results:**

- ✅ Request completes within 30 seconds
- ✅ Proper timeout configuration applied
- ✅ Success or appropriate error message

## Test Suite 2: Network Error Scenarios

### Test 2.1: Backend Server Stopped

**Objective:** Verify error handling when backend is unreachable

**Steps:**

1. Stop backend server
2. Try to register with email
3. Observe error messages and console logs

**Expected Results:**

- ✅ Request attempts 3 retries
- ✅ Console shows retry attempts:
  ```
  🔄 Retry attempt 1/3 after 2000ms
  🔄 Retry attempt 2/3 after 4000ms
  🔄 Retry attempt 3/3 after 8000ms
  ```
- ✅ User sees friendly error message:
  - "Unable to connect to the server. Please check your internet connection."
  - OR "Request timed out. Please check your connection and try again."
- ✅ Error includes troubleshooting steps (check console)

**Console Log Pattern:**

```
❌ [req_xxx] Request failed
   url: /api/v1/auth/register/email/verification
   method: post
   duration: 30000ms
   error: timeout of 30000ms exceeded
   code: ECONNABORTED
```

### Test 2.2: Slow Network Connection

**Objective:** Verify handling of slow but working connections

**Steps:**

1. Enable network throttling in Chrome DevTools:
   - Open DevTools → Network tab
   - Select "Slow 3G" or "Fast 3G"
2. Try to register
3. Observe behavior

**Expected Results:**

- ✅ Request completes (may take longer)
- ✅ No premature timeout
- ✅ Retry logic doesn't trigger unnecessarily
- ✅ User sees loading indicator

### Test 2.3: Intermittent Connectivity

**Objective:** Verify retry logic works correctly

**Steps:**

1. Start request
2. Quickly toggle airplane mode on/off during request
3. Observe retry behavior

**Expected Results:**

- ✅ Request retries automatically
- ✅ Eventually succeeds or shows appropriate error
- ✅ Retry delays are correct (2s, 4s, 8s)

## Test Suite 3: API Configuration Verification

### Test 3.1: Timeout Values

**Objective:** Verify correct timeout values are applied

**Test Cases:**

| Endpoint Type | Expected Timeout | Test URL            |
| ------------- | ---------------- | ------------------- |
| Auth          | 30000ms          | `/api/v1/auth/*`    |
| Data Fetch    | 25000ms          | `/api/v1/subjects`  |
| Mutation      | 30000ms          | `/api/v1/favorites` |

**Steps:**

1. Make requests to different endpoint types
2. Check console logs for timeout values

**Expected Results:**

- ✅ Each endpoint type shows correct timeout in logs
- ✅ Timeouts are applied before request is sent

### Test 3.2: Retry Configuration

**Objective:** Verify retry attempts and delays

**Steps:**

1. Stop backend server
2. Make an auth request
3. Time the retry attempts

**Expected Results:**

- ✅ Exactly 3 retry attempts
- ✅ Delays approximately: 2s, 4s, 8s (±30% jitter)
- ✅ Total time: ~44-50 seconds (30s + 2s + 30s + 4s + 30s + 8s + 30s)

### Test 3.3: Request Tracking

**Objective:** Verify request IDs and logging

**Steps:**

1. Make any API request
2. Check console logs

**Expected Results:**

- ✅ Each request has unique ID: `req_timestamp_random`
- ✅ Request and response logs use same ID
- ✅ Retry attempts show same ID

## Test Suite 4: Network Diagnostics Functions

### Test 4.1: Comprehensive Network Diagnostics

**Objective:** Test `getComprehensiveNetworkDiagnostics()` function

**Test Code:**

```typescript
import { getComprehensiveNetworkDiagnostics } from '@/lib/networkUtils';

// Add this to a test screen or component
const testDiagnostics = async () => {
  console.log('🧪 Testing Network Diagnostics...');
  const diagnostics = await getComprehensiveNetworkDiagnostics();
  console.log('Results:', JSON.stringify(diagnostics, null, 2));
};
```

**Test Scenarios:**

**Scenario A: Good Connection**

- Backend running
- Good internet

**Expected Output:**

```json
{
  "hasInternet": true,
  "serverReachable": true,
  "latency": 50,
  "connectionQuality": "excellent",
  "recommendations": ["✅ Excellent connection quality"],
  "timestamp": "2024-..."
}
```

**Scenario B: No Internet**

- Airplane mode ON

**Expected Output:**

```json
{
  "hasInternet": false,
  "serverReachable": false,
  "connectionQuality": "offline",
  "recommendations": [
    "❌ No internet connection detected",
    "✓ Check your WiFi or mobile data connection",
    "✓ Try toggling airplane mode on and off"
  ]
}
```

**Scenario C: Internet but Server Down**

- Backend stopped
- Internet working

**Expected Output:**

```json
{
  "hasInternet": true,
  "serverReachable": false,
  "connectionQuality": "offline",
  "recommendations": [
    "❌ Cannot reach backend server",
    "✓ Backend URL: http://...",
    "✓ Verify the backend server is running",
    "✓ Check if the URL is correct in your environment settings"
  ]
}
```

### Test 4.2: Connection Quality Test

**Objective:** Test `testConnectionQuality()` function

**Test Code:**

```typescript
import { testConnectionQuality } from '@/lib/networkUtils';

const testQuality = async () => {
  console.log('🧪 Testing Connection Quality...');
  const quality = await testConnectionQuality();
  console.log('Quality Results:', JSON.stringify(quality, null, 2));
};
```

**Expected Output:**

```json
{
  "averageLatency": 75,
  "minLatency": 50,
  "maxLatency": 100,
  "successRate": 100,
  "quality": "excellent"
}
```

**Quality Thresholds to Verify:**

- Excellent: < 100ms, 100% success
- Good: 100-300ms, ≥66% success
- Fair: 300-1000ms, ≥33% success
- Poor: > 1000ms or < 33% success

## Test Suite 5: Error Handler Functions

### Test 5.1: Troubleshooting Steps

**Objective:** Test `getTroubleshootingSteps()` for each error category

**Test Code:**

```typescript
import { getTroubleshootingSteps, ErrorCategory } from '@/lib/errorHandler';

const testTroubleshooting = () => {
  const categories = [
    ErrorCategory.TIMEOUT,
    ErrorCategory.NETWORK,
    ErrorCategory.AUTHENTICATION,
    ErrorCategory.VALIDATION,
    ErrorCategory.SERVER,
  ];

  categories.forEach((category) => {
    const error = {
      category,
      code: 'TEST',
      message: 'Test error',
      userMessage: 'Test',
      retryable: true,
      timestamp: new Date().toISOString(),
    };

    const steps = getTroubleshootingSteps(error);
    console.log(`\n${category} Steps:`, steps);
  });
};
```

**Expected Results:**
Each category should return appropriate troubleshooting steps:

- ✅ TIMEOUT: 5 steps about connection and server
- ✅ NETWORK: 4 steps about connectivity
- ✅ AUTHENTICATION: 3 steps about credentials
- ✅ VALIDATION: 3 steps about input
- ✅ SERVER: 3 steps about server issues

### Test 5.2: Detailed Error Info

**Objective:** Test `getDetailedErrorInfo()` function

**Test Code:**

```typescript
import { getDetailedErrorInfo } from '@/lib/errorHandler';

// Simulate an error
const testError = {
  category: 'TIMEOUT',
  code: 'TIMEOUT',
  message: 'timeout of 30000ms exceeded',
  userMessage: 'Request timed out',
  technicalMessage: 'timeout of 30000ms exceeded | Code: ECONNABORTED',
  retryable: true,
  timestamp: new Date().toISOString(),
};

const errorInfo = getDetailedErrorInfo(testError);
console.log('Error Info:', JSON.stringify(errorInfo, null, 2));
```

**Expected Output:**

```json
{
  "summary": "Request timed out",
  "details": [
    "Error Code: TIMEOUT",
    "Category: TIMEOUT",
    "Retryable: Yes",
    "Timestamp: ..."
  ],
  "troubleshooting": [
    "✓ Check your internet connection",
    "✓ Try moving closer to your WiFi router",
    ...
  ],
  "technicalInfo": "timeout of 30000ms exceeded | Code: ECONNABORTED"
}
```

## Test Suite 6: Edge Cases

### Test 6.1: Very Slow Network (>10s latency)

**Steps:**

1. Use network throttling: Custom → 10000ms latency
2. Make auth request
3. Observe behavior

**Expected Results:**

- ✅ Request doesn't timeout prematurely
- ✅ Eventually completes or times out at 30s
- ✅ User sees loading indicator throughout

### Test 6.2: DNS Resolution Failure

**Steps:**

1. Set backend URL to invalid domain
2. Try to make request

**Expected Results:**

- ✅ Error code: `ENOTFOUND`
- ✅ Retry attempts made
- ✅ User-friendly error message

### Test 6.3: Server 5xx Errors

**Steps:**

1. Configure backend to return 500 error
2. Make request

**Expected Results:**

- ✅ Request retries (5xx are retryable)
- ✅ Eventually shows server error message
- ✅ Proper error categorization

### Test 6.4: Multiple Simultaneous Requests

**Steps:**

1. Trigger multiple API calls at once
2. Observe behavior

**Expected Results:**

- ✅ Each request tracked independently
- ✅ Unique request IDs for each
- ✅ No interference between requests
- ✅ Request deduplication works for identical requests

## Test Suite 7: Different Environments

### Test 7.1: Physical Device (iOS)

**Steps:**

1. Build and install on physical iPhone
2. Run all critical path tests
3. Test with WiFi and cellular data

**Expected Results:**

- ✅ All tests pass on physical device
- ✅ Works on both WiFi and cellular
- ✅ Performance is acceptable

### Test 7.2: Physical Device (Android)

**Steps:**

1. Build and install on physical Android device
2. Run all critical path tests
3. Test with WiFi and mobile data

**Expected Results:**

- ✅ All tests pass on physical device
- ✅ Works on both WiFi and mobile data
- ✅ Performance is acceptable

### Test 7.3: iOS Simulator

**Steps:**

1. Run on iOS Simulator
2. Test with localhost backend
3. Run critical path tests

**Expected Results:**

- ✅ Works with localhost URL
- ✅ All tests pass
- ✅ Console logs visible

### Test 7.4: Android Emulator

**Steps:**

1. Run on Android Emulator
2. Test with 10.0.2.2 or computer IP
3. Run critical path tests

**Expected Results:**

- ✅ Works with emulator network setup
- ✅ All tests pass
- ✅ Console logs visible

## Test Checklist

### Pre-Testing Setup

- [ ] Backend server running and accessible
- [ ] Mobile app builds successfully
- [ ] Console logs enabled
- [ ] Network tools ready (DevTools, etc.)

### Critical Path (Must Pass)

- [ ] Registration flow works
- [ ] Login flow works
- [ ] Password reset works
- [ ] Requests complete within 30s
- [ ] Retry logic works (3 attempts)
- [ ] Error messages are user-friendly

### Network Scenarios (Must Pass)

- [ ] Backend stopped - shows appropriate error
- [ ] Slow network - doesn't timeout prematurely
- [ ] Retry delays are correct (2s, 4s, 8s)

### Configuration (Must Pass)

- [ ] Auth endpoints use 30s timeout
- [ ] Timeout values logged correctly
- [ ] Request IDs are unique and tracked

### Diagnostics (Should Pass)

- [ ] `getComprehensiveNetworkDiagnostics()` works
- [ ] Connection quality detection accurate
- [ ] Recommendations are helpful

### Error Handling (Should Pass)

- [ ] `getTroubleshootingSteps()` returns correct steps
- [ ] `getDetailedErrorInfo()` provides complete info
- [ ] Error categorization is accurate

### Edge Cases (Nice to Have)

- [ ] Very slow network handled
- [ ] DNS failures handled
- [ ] 5xx errors retry correctly
- [ ] Multiple simultaneous requests work

### Environments (Nice to Have)

- [ ] Works on physical iOS device
- [ ] Works on physical Android device
- [ ] Works on iOS Simulator
- [ ] Works on Android Emulator

## Reporting Issues

If any test fails, document:

1. **Test Name**: Which test failed
2. **Steps**: Exact steps to reproduce
3. **Expected**: What should happen
4. **Actual**: What actually happened
5. **Logs**: Console logs and error messages
6. **Environment**: Device, OS, network type
7. **Screenshots**: If applicable

## Success Criteria

**Minimum for Completion:**

- ✅ All Critical Path tests pass
- ✅ All Network Scenarios tests pass
- ✅ All Configuration tests pass

**Full Success:**

- ✅ All test suites pass
- ✅ No regressions in existing functionality
- ✅ Performance is acceptable
- ✅ Error messages are helpful

---

**Testing Duration Estimate:**

- Critical Path: 15-20 minutes
- Full Test Suite: 1-2 hours
- With multiple devices: 2-3 hours

**Next Steps After Testing:**

1. Document any issues found
2. Fix critical issues
3. Re-test affected areas
4. Update documentation if needed
5. Mark task as complete
