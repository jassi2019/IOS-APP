/**
 * API Testing Utility Module
 *
 * Provides utilities for testing backend connectivity, running diagnostics,
 * and debugging API issues during development.
 */

import env from '@/constants/env';
import axios, { AxiosError } from 'axios';
import { getNetworkDiagnostics } from './networkUtils';

/**
 * Health check result
 */
export interface HealthCheckResult {
  healthy: boolean;
  latency?: number;
  version?: string;
  timestamp: string;
  error?: string;
}

/**
 * Endpoint test result
 */
export interface EndpointTestResult {
  endpoint: string;
  method: string;
  success: boolean;
  statusCode?: number;
  latency: number;
  error?: string;
  response?: any;
}

/**
 * Comprehensive diagnostic result
 */
export interface DiagnosticResult {
  timestamp: string;
  backendUrl: string;
  networkDiagnostics: any;
  healthCheck: HealthCheckResult;
  endpointTests: EndpointTestResult[];
  recommendations: string[];
}

/**
 * Check backend health endpoint
 */
export const checkBackendHealth = async (): Promise<HealthCheckResult> => {
  const startTime = Date.now();

  try {
    const response = await axios.get(`${env.backendUrl}/health`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const latency = Date.now() - startTime;

    return {
      healthy: true,
      latency,
      version: response.data?.version,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    const latency = Date.now() - startTime;

    return {
      healthy: false,
      latency,
      timestamp: new Date().toISOString(),
      error: error.message || 'Health check failed',
    };
  }
};

/**
 * Test a specific API endpoint
 */
export const testEndpoint = async (
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  data?: any
): Promise<EndpointTestResult> => {
  const startTime = Date.now();
  const url = `${env.backendUrl}${endpoint}`;

  try {
    const response = await axios({
      method,
      url,
      data,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const latency = Date.now() - startTime;

    return {
      endpoint,
      method,
      success: true,
      statusCode: response.status,
      latency,
      response: response.data,
    };
  } catch (error: any) {
    const latency = Date.now() - startTime;
    const axiosError = error as AxiosError;

    return {
      endpoint,
      method,
      success: false,
      statusCode: axiosError.response?.status,
      latency,
      error: axiosError.message,
      response: axiosError.response?.data,
    };
  }
};

/**
 * Test common authentication endpoints
 */
export const testAuthEndpoints = async (): Promise<EndpointTestResult[]> => {
  console.log('🧪 Testing authentication endpoints...');

  const endpoints = [
    { path: '/api/v1/auth/login', method: 'POST' as const },
    { path: '/api/v1/auth/register', method: 'POST' as const },
    { path: '/api/v1/auth/register/email/verification', method: 'POST' as const },
  ];

  const results: EndpointTestResult[] = [];

  for (const { path, method } of endpoints) {
    console.log(`Testing ${method} ${path}...`);
    const result = await testEndpoint(path, method, {});
    results.push(result);

    const status = result.success ? '✅' : '❌';
    console.log(
      `${status} ${method} ${path}: ${result.statusCode || 'No response'} (${result.latency}ms)`
    );
  }

  return results;
};

/**
 * Run comprehensive diagnostics
 */
export const runDiagnostics = async (): Promise<DiagnosticResult> => {
  console.log('🔍 Running comprehensive API diagnostics...\n');

  // Network diagnostics
  console.log('📡 Checking network connectivity...');
  const networkDiagnostics = await getNetworkDiagnostics();
  console.log('Network Status:', networkDiagnostics.connectionCheck);

  // Health check
  console.log('\n🏥 Checking backend health...');
  const healthCheck = await checkBackendHealth();
  console.log('Health Status:', healthCheck);

  // Endpoint tests
  console.log('\n🧪 Testing API endpoints...');
  const endpointTests = await testAuthEndpoints();

  // Generate recommendations
  const recommendations = generateRecommendations(networkDiagnostics, healthCheck, endpointTests);

  console.log('\n💡 Recommendations:');
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });

  return {
    timestamp: new Date().toISOString(),
    backendUrl: env.backendUrl,
    networkDiagnostics,
    healthCheck,
    endpointTests,
    recommendations,
  };
};

/**
 * Generate recommendations based on diagnostic results
 */
const generateRecommendations = (
  networkDiagnostics: any,
  healthCheck: HealthCheckResult,
  endpointTests: EndpointTestResult[]
): string[] => {
  const recommendations: string[] = [];

  // Check internet connectivity
  if (!networkDiagnostics.connectionCheck.hasInternet) {
    recommendations.push('❌ No internet connection detected. Check your WiFi or mobile data.');
    recommendations.push('Try connecting to a different network.');
    return recommendations;
  }

  // Check server reachability
  if (!networkDiagnostics.connectionCheck.canReachServer) {
    recommendations.push('❌ Cannot reach backend server. The server may be down or unreachable.');
    recommendations.push('Verify the backend URL in your .env file: ' + env.backendUrl);
    recommendations.push('Make sure the backend server is running on the correct port.');
    recommendations.push(
      "If using a physical device, ensure it's on the same WiFi network as the backend."
    );
    recommendations.push('Check firewall settings that might be blocking the connection.');
    return recommendations;
  }

  // Check health endpoint
  if (!healthCheck.healthy) {
    recommendations.push('⚠️ Backend server is reachable but health check failed.');
    recommendations.push('The server might be starting up or experiencing issues.');
    recommendations.push('Check backend server logs for errors.');
    recommendations.push('Verify database connectivity on the backend.');
  }

  // Check endpoint tests
  const failedTests = endpointTests.filter((test) => !test.success);
  if (failedTests.length > 0) {
    recommendations.push(`⚠️ ${failedTests.length} endpoint(s) failed testing.`);
    failedTests.forEach((test) => {
      recommendations.push(`  - ${test.method} ${test.endpoint}: ${test.error || 'Failed'}`);
    });
    recommendations.push('Check backend API routes and middleware configuration.');
  }

  // Check latency
  if (healthCheck.latency && healthCheck.latency > 3000) {
    recommendations.push('⚠️ High latency detected (' + healthCheck.latency + 'ms).');
    recommendations.push('Network connection may be slow. Consider using a faster connection.');
  }

  // All good
  if (recommendations.length === 0) {
    recommendations.push('✅ All checks passed! Backend is healthy and reachable.');
    recommendations.push("If you're still experiencing issues, check application logs.");
  }

  return recommendations;
};

/**
 * Quick connectivity test
 */
export const quickTest = async (): Promise<boolean> => {
  console.log('⚡ Running quick connectivity test...');

  try {
    const response = await axios.get(`${env.backendUrl}/health`, {
      timeout: 5000,
    });
    console.log('✅ Backend is reachable!');
    return true;
  } catch (error) {
    console.log('❌ Backend is not reachable.');
    return false;
  }
};

/**
 * Print diagnostic report
 */
export const printDiagnosticReport = (result: DiagnosticResult): void => {
  console.log('\n' + '='.repeat(60));
  console.log('API DIAGNOSTIC REPORT');
  console.log('='.repeat(60));
  console.log(`Timestamp: ${result.timestamp}`);
  console.log(`Backend URL: ${result.backendUrl}`);
  console.log('='.repeat(60));

  console.log('\n📡 NETWORK STATUS:');
  console.log(`  Internet: ${result.networkDiagnostics.connectionCheck.hasInternet ? '✅' : '❌'}`);
  console.log(
    `  Server: ${result.networkDiagnostics.connectionCheck.canReachServer ? '✅' : '❌'}`
  );
  if (result.networkDiagnostics.connectionCheck.latency) {
    console.log(`  Latency: ${result.networkDiagnostics.connectionCheck.latency}ms`);
  }

  console.log('\n🏥 HEALTH CHECK:');
  console.log(`  Status: ${result.healthCheck.healthy ? '✅ Healthy' : '❌ Unhealthy'}`);
  if (result.healthCheck.latency) {
    console.log(`  Latency: ${result.healthCheck.latency}ms`);
  }
  if (result.healthCheck.error) {
    console.log(`  Error: ${result.healthCheck.error}`);
  }

  console.log('\n🧪 ENDPOINT TESTS:');
  result.endpointTests.forEach((test) => {
    const status = test.success ? '✅' : '❌';
    console.log(`  ${status} ${test.method} ${test.endpoint}`);
    console.log(`     Status: ${test.statusCode || 'N/A'} | Latency: ${test.latency}ms`);
    if (test.error) {
      console.log(`     Error: ${test.error}`);
    }
  });

  console.log('\n💡 RECOMMENDATIONS:');
  result.recommendations.forEach((rec, index) => {
    console.log(`  ${index + 1}. ${rec}`);
  });

  console.log('\n' + '='.repeat(60));
};

/**
 * Test with custom backend URL (for debugging)
 */
export const testCustomUrl = async (url: string): Promise<void> => {
  console.log(`🔍 Testing custom URL: ${url}`);

  try {
    const startTime = Date.now();
    const response = await axios.get(`${url}/health`, {
      timeout: 10000,
    });
    const latency = Date.now() - startTime;

    console.log('✅ Success!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Latency: ${latency}ms`);
    console.log(`   Response:`, response.data);
  } catch (error: any) {
    console.log('❌ Failed!');
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Response:`, error.response.data);
    }
  }
};

/**
 * Monitor backend availability over time
 */
export const monitorBackend = async (
  intervalMs: number = 5000,
  durationMs: number = 30000
): Promise<void> => {
  console.log(`📊 Monitoring backend for ${durationMs / 1000} seconds...`);

  const startTime = Date.now();
  let successCount = 0;
  let failureCount = 0;
  const latencies: number[] = [];

  const monitor = async () => {
    const checkStart = Date.now();
    try {
      await axios.get(`${env.backendUrl}/health`, { timeout: 5000 });
      const latency = Date.now() - checkStart;
      latencies.push(latency);
      successCount++;
      console.log(`✅ Check ${successCount + failureCount}: OK (${latency}ms)`);
    } catch (error) {
      failureCount++;
      console.log(`❌ Check ${successCount + failureCount}: Failed`);
    }
  };

  // Run initial check
  await monitor();

  // Set up interval
  const intervalId = setInterval(async () => {
    if (Date.now() - startTime >= durationMs) {
      clearInterval(intervalId);

      // Print summary
      console.log('\n📊 Monitoring Summary:');
      console.log(`   Total Checks: ${successCount + failureCount}`);
      console.log(
        `   Successful: ${successCount} (${(
          (successCount / (successCount + failureCount)) *
          100
        ).toFixed(1)}%)`
      );
      console.log(`   Failed: ${failureCount}`);
      if (latencies.length > 0) {
        const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
        const minLatency = Math.min(...latencies);
        const maxLatency = Math.max(...latencies);
        console.log(`   Avg Latency: ${avgLatency.toFixed(0)}ms`);
        console.log(`   Min Latency: ${minLatency}ms`);
        console.log(`   Max Latency: ${maxLatency}ms`);
      }
      return;
    }

    await monitor();
  }, intervalMs);
};

export default {
  checkBackendHealth,
  testEndpoint,
  testAuthEndpoints,
  runDiagnostics,
  quickTest,
  printDiagnosticReport,
  testCustomUrl,
  monitorBackend,
};
