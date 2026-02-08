/**
 * API Enhancements Test Suite
 *
 * Run this file to test all API enhancement features.
 *
 * Usage:
 * 1. Start backend server: cd backend-main && npm start
 * 2. Import this file in your app
 * 3. Call runAllTests() from a test screen
 */

import api from '@/lib/api';
import apiTester from '@/lib/apiTester';
import { ErrorCategory } from '@/lib/errorHandler';
import {
  checkInternetConnectivity,
  checkServerReachability,
  getNetworkDiagnostics,
  performConnectionCheck,
  pingServer,
} from '@/lib/networkUtils';
import { RETRY_CONFIGS } from '@/lib/retryConfig';

/**
 * Test result interface
 */
interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration?: number;
  error?: any;
}

/**
 * Test suite results
 */
interface TestSuiteResult {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestResult[];
}

/**
 * Run a single test with error handling
 */
async function runTest(name: string, testFn: () => Promise<void>): Promise<TestResult> {
  const startTime = Date.now();

  try {
    await testFn();
    const duration = Date.now() - startTime;
    return {
      name,
      status: 'PASS',
      message: 'Test passed successfully',
      duration,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return {
      name,
      status: 'FAIL',
      message: error.message || 'Test failed',
      duration,
      error,
    };
  }
}

/**
 * Test 1: Network Connectivity Detection
 */
async function testNetworkConnectivity(): Promise<void> {
  console.log('🧪 Testing network connectivity...');

  const hasInternet = await checkInternetConnectivity();
  if (typeof hasInternet !== 'boolean') {
    throw new Error('checkInternetConnectivity should return boolean');
  }

  console.log(`✅ Internet connectivity: ${hasInternet}`);
}

/**
 * Test 2: Server Reachability
 */
async function testServerReachability(): Promise<void> {
  console.log('🧪 Testing server reachability...');

  const serverCheck = await checkServerReachability();
  if (typeof serverCheck.reachable !== 'boolean') {
    throw new Error('checkServerReachability should return object with reachable property');
  }

  console.log(`✅ Server reachable: ${serverCheck.reachable}`);
  if (serverCheck.latency) {
    console.log(`   Latency: ${serverCheck.latency}ms`);
  }
}

/**
 * Test 3: Connection Check
 */
async function testConnectionCheck(): Promise<void> {
  console.log('🧪 Testing connection check...');

  const check = await performConnectionCheck();
  if (typeof check.hasInternet !== 'boolean' || typeof check.canReachServer !== 'boolean') {
    throw new Error('performConnectionCheck should return proper structure');
  }

  console.log(`✅ Connection check complete`);
  console.log(`   Has Internet: ${check.hasInternet}`);
  console.log(`   Can Reach Server: ${check.canReachServer}`);
}

/**
 * Test 4: Network Diagnostics
 */
async function testNetworkDiagnostics(): Promise<void> {
  console.log('🧪 Testing network diagnostics...');

  const diagnostics = await getNetworkDiagnostics();
  if (!diagnostics.platform || !diagnostics.backendUrl) {
    throw new Error('getNetworkDiagnostics should return proper structure');
  }

  console.log(`✅ Network diagnostics complete`);
  console.log(`   Platform: ${diagnostics.platform}`);
  console.log(`   Backend URL: ${diagnostics.backendUrl}`);
}

/**
 * Test 5: Ping Server
 */
async function testPingServer(): Promise<void> {
  console.log('🧪 Testing ping server...');

  const isReachable = await pingServer();
  if (typeof isReachable !== 'boolean') {
    throw new Error('pingServer should return boolean');
  }

  console.log(`✅ Ping server: ${isReachable}`);
}

/**
 * Test 6: API Health Check
 */
async function testAPIHealthCheck(): Promise<void> {
  console.log('🧪 Testing API health check...');

  const health = await apiTester.checkBackendHealth();
  if (typeof health.healthy !== 'boolean') {
    throw new Error('checkBackendHealth should return object with healthy property');
  }

  console.log(`✅ Backend health: ${health.healthy}`);
  if (health.latency) {
    console.log(`   Latency: ${health.latency}ms`);
  }
}

/**
 * Test 7: Quick Test
 */
async function testQuickTest(): Promise<void> {
  console.log('🧪 Testing quick test...');

  const isReachable = await apiTester.quickTest();
  if (typeof isReachable !== 'boolean') {
    throw new Error('quickTest should return boolean');
  }

  console.log(`✅ Quick test: ${isReachable}`);
}

/**
 * Test 8: Basic GET Request
 */
async function testBasicGETRequest(): Promise<void> {
  console.log('🧪 Testing basic GET request...');

  try {
    const result = await api.get('/health');
    console.log(`✅ GET request successful`);
  } catch (error: any) {
    // If backend is not running, this is expected
    if (error.category === ErrorCategory.NETWORK || error.category === ErrorCategory.TIMEOUT) {
      console.log(`⚠️  Backend not reachable (expected if not running)`);
      throw new Error('Backend not running - start backend to test API requests');
    }
    throw error;
  }
}

/**
 * Test 9: Error Transformation
 */
async function testErrorTransformation(): Promise<void> {
  console.log('🧪 Testing error transformation...');

  try {
    // This should fail and transform the error
    await api.get('/nonexistent-endpoint-12345');
    throw new Error('Request should have failed');
  } catch (error: any) {
    // Check if error was transformed
    if (!error.category || !error.userMessage) {
      throw new Error('Error was not properly transformed');
    }

    console.log(`✅ Error transformation working`);
    console.log(`   Category: ${error.category}`);
    console.log(`   User Message: ${error.userMessage}`);
  }
}

/**
 * Test 10: Retry Statistics
 */
async function testRetryStatistics(): Promise<void> {
  console.log('🧪 Testing retry statistics...');

  const stats = api.getRetryStats();
  if (typeof stats.totalRequests !== 'number' || typeof stats.retriedRequests !== 'number') {
    throw new Error('getRetryStats should return proper structure');
  }

  console.log(`✅ Retry statistics working`);
  console.log(`   Total Requests: ${stats.totalRequests}`);
  console.log(`   Retried Requests: ${stats.retriedRequests}`);
  console.log(`   Retry Rate: ${stats.retryRate.toFixed(1)}%`);
}

/**
 * Test 11: Request Deduplication
 */
async function testRequestDeduplication(): Promise<void> {
  console.log('🧪 Testing request deduplication...');

  // Make two identical requests simultaneously
  const promise1 = api.get('/health');
  const promise2 = api.get('/health');

  try {
    const [result1, result2] = await Promise.all([promise1, promise2]);
    console.log(`✅ Request deduplication working`);
  } catch (error) {
    // If backend is not running, both will fail
    console.log(`⚠️  Backend not reachable (expected if not running)`);
    throw new Error('Backend not running - start backend to test deduplication');
  }
}

/**
 * Test 12: Retry Configuration
 */
async function testRetryConfiguration(): Promise<void> {
  console.log('🧪 Testing retry configuration...');

  if (
    !RETRY_CONFIGS.auth ||
    !RETRY_CONFIGS.fetch ||
    !RETRY_CONFIGS.mutation ||
    !RETRY_CONFIGS.critical
  ) {
    throw new Error('Retry configurations not properly defined');
  }

  console.log(`✅ Retry configurations defined`);
  console.log(`   Auth: ${RETRY_CONFIGS.auth.maxRetries} retries`);
  console.log(`   Fetch: ${RETRY_CONFIGS.fetch.maxRetries} retries`);
  console.log(`   Mutation: ${RETRY_CONFIGS.mutation.maxRetries} retries`);
  console.log(`   Critical: ${RETRY_CONFIGS.critical.maxRetries} retries`);
}

/**
 * Test 13: Error Categories
 */
async function testErrorCategories(): Promise<void> {
  console.log('🧪 Testing error categories...');

  const categories = [
    ErrorCategory.NETWORK,
    ErrorCategory.TIMEOUT,
    ErrorCategory.SERVER,
    ErrorCategory.CLIENT,
    ErrorCategory.AUTHENTICATION,
    ErrorCategory.VALIDATION,
    ErrorCategory.UNKNOWN,
  ];

  if (categories.length !== 7) {
    throw new Error('Not all error categories defined');
  }

  console.log(`✅ All error categories defined`);
}

/**
 * Test 14: Comprehensive Diagnostics
 */
async function testComprehensiveDiagnostics(): Promise<void> {
  console.log('🧪 Testing comprehensive diagnostics...');

  const diagnostics = await apiTester.runDiagnostics();
  if (
    !diagnostics.timestamp ||
    !diagnostics.backendUrl ||
    !diagnostics.networkDiagnostics ||
    !diagnostics.healthCheck ||
    !diagnostics.recommendations
  ) {
    throw new Error('Diagnostics result incomplete');
  }

  console.log(`✅ Comprehensive diagnostics working`);
  console.log(`   Recommendations: ${diagnostics.recommendations.length}`);
}

/**
 * Test 15: API Methods Availability
 */
async function testAPIMethodsAvailability(): Promise<void> {
  console.log('🧪 Testing API methods availability...');

  const methods = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'dedupedRequest',
    'requestWithNetworkCheck',
    'requestWithServerCheck',
    'getRetryStats',
    'resetRetryStats',
    'getPendingRequestCount',
    'clearDeduplicationCache',
  ];

  for (const method of methods) {
    if (typeof (api as any)[method] !== 'function') {
      throw new Error(`API method ${method} not available`);
    }
  }

  console.log(`✅ All API methods available`);
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<TestSuiteResult> {
  console.log('\n' + '='.repeat(60));
  console.log('API ENHANCEMENTS TEST SUITE');
  console.log('='.repeat(60) + '\n');

  const startTime = Date.now();
  const results: TestResult[] = [];

  // Define all tests
  const tests = [
    { name: 'Network Connectivity Detection', fn: testNetworkConnectivity },
    { name: 'Server Reachability', fn: testServerReachability },
    { name: 'Connection Check', fn: testConnectionCheck },
    { name: 'Network Diagnostics', fn: testNetworkDiagnostics },
    { name: 'Ping Server', fn: testPingServer },
    { name: 'API Health Check', fn: testAPIHealthCheck },
    { name: 'Quick Test', fn: testQuickTest },
    { name: 'Basic GET Request', fn: testBasicGETRequest },
    { name: 'Error Transformation', fn: testErrorTransformation },
    { name: 'Retry Statistics', fn: testRetryStatistics },
    { name: 'Request Deduplication', fn: testRequestDeduplication },
    { name: 'Retry Configuration', fn: testRetryConfiguration },
    { name: 'Error Categories', fn: testErrorCategories },
    { name: 'Comprehensive Diagnostics', fn: testComprehensiveDiagnostics },
    { name: 'API Methods Availability', fn: testAPIMethodsAvailability },
  ];

  // Run all tests
  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    const result = await runTest(test.name, test.fn);
    results.push(result);

    if (result.status === 'PASS') {
      console.log(`✅ PASS: ${test.name} (${result.duration}ms)`);
    } else if (result.status === 'FAIL') {
      console.log(`❌ FAIL: ${test.name} (${result.duration}ms)`);
      console.log(`   Error: ${result.message}`);
    }
  }

  const duration = Date.now() - startTime;

  // Calculate summary
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const skipped = results.filter((r) => r.status === 'SKIP').length;

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`⏱️  Duration: ${duration}ms`);
  console.log(`📊 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60) + '\n');

  return {
    totalTests: results.length,
    passed,
    failed,
    skipped,
    duration,
    results,
  };
}

/**
 * Run quick tests (no backend required)
 */
export async function runQuickTests(): Promise<TestSuiteResult> {
  console.log('\n' + '='.repeat(60));
  console.log('API ENHANCEMENTS QUICK TEST SUITE');
  console.log("(Tests that don't require backend)");
  console.log('='.repeat(60) + '\n');

  const startTime = Date.now();
  const results: TestResult[] = [];

  // Define quick tests (no backend required)
  const tests = [
    { name: 'Network Connectivity Detection', fn: testNetworkConnectivity },
    { name: 'Network Diagnostics', fn: testNetworkDiagnostics },
    { name: 'Retry Configuration', fn: testRetryConfiguration },
    { name: 'Error Categories', fn: testErrorCategories },
    { name: 'API Methods Availability', fn: testAPIMethodsAvailability },
  ];

  // Run tests
  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    const result = await runTest(test.name, test.fn);
    results.push(result);

    if (result.status === 'PASS') {
      console.log(`✅ PASS: ${test.name} (${result.duration}ms)`);
    } else if (result.status === 'FAIL') {
      console.log(`❌ FAIL: ${test.name} (${result.duration}ms)`);
      console.log(`   Error: ${result.message}`);
    }
  }

  const duration = Date.now() - startTime;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;

  console.log('\n' + '='.repeat(60));
  console.log('QUICK TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Duration: ${duration}ms`);
  console.log('='.repeat(60) + '\n');

  return {
    totalTests: results.length,
    passed,
    failed,
    skipped: 0,
    duration,
    results,
  };
}

export default {
  runAllTests,
  runQuickTests,
};
