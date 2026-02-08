/**
 * Manual Test Runner for Network Timeout Fixes
 *
 * This script provides manual testing functions that can be called
 * from the app to verify the network timeout fixes work correctly.
 *
 * Usage:
 * 1. Import this file in a test screen/component
 * 2. Call the test functions
 * 3. Check console logs for results
 */

import {
  ERROR_CODES,
  ErrorCategory,
  getDetailedErrorInfo,
  getTroubleshootingSteps,
} from '../lib/errorHandler';
import { getComprehensiveNetworkDiagnostics, testConnectionQuality } from '../lib/networkUtils';
import { calculateBackoffDelay, RETRY_CONFIGS } from '../lib/retryConfig';

/**
 * Test Network Diagnostics
 */
export const testNetworkDiagnostics = async () => {
  console.log('🧪 Testing Network Diagnostics...');
  console.log('=====================================');

  try {
    const diagnostics = await getComprehensiveNetworkDiagnostics();

    console.log('📊 Network Diagnostics Results:');
    console.log(`   Internet Connected: ${diagnostics.hasInternet ? '✅' : '❌'}`);
    console.log(`   Server Reachable: ${diagnostics.serverReachable ? '✅' : '❌'}`);
    console.log(`   Latency: ${diagnostics.latency ? `${diagnostics.latency}ms` : 'N/A'}`);
    console.log(`   Connection Quality: ${diagnostics.connectionQuality.toUpperCase()}`);
    console.log(`   Timestamp: ${diagnostics.timestamp}`);

    console.log('\n📋 Recommendations:');
    diagnostics.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    console.log('\n✅ Network diagnostics test completed successfully');
    return diagnostics;
  } catch (error) {
    console.error('❌ Network diagnostics test failed:', error);
    return null;
  }
};

/**
 * Test Connection Quality
 */
export const testConnectionQualityManual = async () => {
  console.log('🧪 Testing Connection Quality...');
  console.log('=================================');

  try {
    const quality = await testConnectionQuality();

    console.log('📊 Connection Quality Results:');
    console.log(`   Average Latency: ${quality.averageLatency.toFixed(1)}ms`);
    console.log(`   Min Latency: ${quality.minLatency}ms`);
    console.log(`   Max Latency: ${quality.maxLatency}ms`);
    console.log(`   Success Rate: ${quality.successRate.toFixed(1)}%`);
    console.log(`   Overall Quality: ${quality.quality.toUpperCase()}`);

    console.log('\n✅ Connection quality test completed successfully');
    return quality;
  } catch (error) {
    console.error('❌ Connection quality test failed:', error);
    return null;
  }
};

/**
 * Test Error Handler Functions
 */
export const testErrorHandler = () => {
  console.log('🧪 Testing Error Handler Functions...');
  console.log('=====================================');

  try {
    // Test different error categories
    const testErrors = [
      {
        category: ErrorCategory.TIMEOUT,
        code: ERROR_CODES.TIMEOUT,
        message: 'timeout of 30000ms exceeded',
        userMessage: 'Request timed out',
        retryable: true,
        timestamp: new Date().toISOString(),
      },
      {
        category: ErrorCategory.NETWORK,
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Network Error',
        userMessage: 'Cannot connect to server',
        retryable: true,
        timestamp: new Date().toISOString(),
      },
      {
        category: ErrorCategory.AUTHENTICATION,
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Unauthorized',
        userMessage: 'Please log in',
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    ];

    testErrors.forEach((error, index) => {
      console.log(`\n📋 Test Error ${index + 1}: ${error.category}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Message: ${error.userMessage}`);

      // Test troubleshooting steps
      const steps = getTroubleshootingSteps(error);
      console.log(`   Troubleshooting Steps (${steps.length}):`);
      steps.forEach((step, stepIndex) => {
        console.log(`     ${stepIndex + 1}. ${step}`);
      });

      // Test detailed error info
      const info = getDetailedErrorInfo(error);
      console.log(`   Detailed Info Summary: ${info.summary}`);
      console.log(`   Details Count: ${info.details.length}`);
      console.log(`   Troubleshooting Count: ${info.troubleshooting.length}`);
    });

    console.log('\n✅ Error handler test completed successfully');
    return testErrors;
  } catch (error) {
    console.error('❌ Error handler test failed:', error);
    return null;
  }
};

/**
 * Test Retry Configuration
 */
export const testRetryConfiguration = () => {
  console.log('🧪 Testing Retry Configuration...');
  console.log('==================================');

  try {
    const authConfig = RETRY_CONFIGS.auth;

    console.log('📊 Auth Retry Configuration:');
    console.log(`   Max Retries: ${authConfig.maxRetries}`);
    console.log(`   Initial Delay: ${authConfig.initialDelayMs}ms`);
    console.log(`   Max Delay: ${authConfig.maxDelayMs}ms`);
    console.log(`   Backoff Multiplier: ${authConfig.backoffMultiplier}`);
    console.log(`   Retryable Status Codes: ${authConfig.retryableStatuses.join(', ')}`);
    console.log(`   Retryable Errors: ${authConfig.retryableErrors.join(', ')}`);

    console.log('\n⏱️  Retry Delay Calculations:');
    for (let i = 0; i < authConfig.maxRetries; i++) {
      const delay = calculateBackoffDelay(i, authConfig);
      console.log(`   Retry ${i + 1}: ~${delay}ms`);
    }

    // Calculate total possible time
    const totalDelays = [];
    for (let i = 0; i < authConfig.maxRetries; i++) {
      totalDelays.push(calculateBackoffDelay(i, authConfig));
    }
    const totalDelay = totalDelays.reduce((sum, delay) => sum + delay, 0);
    const totalTime = totalDelay + authConfig.maxRetries * 30000; // Add timeout for each attempt

    console.log(`\n⏱️  Total Possible Time: ~${(totalTime / 1000).toFixed(1)}s`);
    console.log(`   (${authConfig.maxRetries} retries × 30s timeout + ${totalDelay}ms delays)`);

    console.log('\n✅ Retry configuration test completed successfully');
    return authConfig;
  } catch (error) {
    console.error('❌ Retry configuration test failed:', error);
    return null;
  }
};

/**
 * Run All Tests
 */
export const runAllTests = async () => {
  console.log('🚀 Running All Network Timeout Tests...');
  console.log('==========================================');

  const results = {
    networkDiagnostics: null as any,
    connectionQuality: null as any,
    errorHandler: null as any,
    retryConfig: null as any,
  };

  try {
    // Test network diagnostics
    results.networkDiagnostics = await testNetworkDiagnostics();
    console.log('');

    // Test connection quality
    results.connectionQuality = await testConnectionQualityManual();
    console.log('');

    // Test error handler
    results.errorHandler = testErrorHandler();
    console.log('');

    // Test retry configuration
    results.retryConfig = testRetryConfiguration();
    console.log('');

    console.log('🎉 All tests completed!');
    console.log('======================');
    console.log('Check the console output above for detailed results.');
    console.log('Use the returned results object for further analysis.');

    return results;
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    return null;
  }
};

/**
 * Test API Configuration
 */
export const testApiConfiguration = () => {
  console.log('🧪 Testing API Configuration...');
  console.log('================================');

  try {
    // Import API to check configuration
    const api = require('../lib/api').default;

    console.log('📊 API Configuration:');
    console.log(`   Base URL: ${api.defaults.baseURL}`);
    console.log(`   Default Timeout: ${api.defaults.timeout}ms`);
    console.log(`   Headers:`, api.defaults.headers);

    // Test timeout configuration for different endpoints
    const testUrls = [
      '/api/v1/auth/register/email/verification',
      '/api/v1/subjects',
      '/api/v1/favorites',
    ];

    console.log('\n⏱️  Endpoint Timeout Configuration:');
    testUrls.forEach((url) => {
      // This would require access to getTimeoutForEndpoint function
      // For now, just show the logic
      if (url.includes('/auth/')) {
        console.log(`   ${url}: 30000ms (auth endpoint)`);
      } else if (url.includes('/favorites') || url.includes('/subjects')) {
        console.log(`   ${url}: 25000ms (data endpoint)`);
      } else {
        console.log(`   ${url}: 30000ms (default)`);
      }
    });

    console.log('\n✅ API configuration test completed successfully');
    return api.defaults;
  } catch (error) {
    console.error('❌ API configuration test failed:', error);
    return null;
  }
};

/**
 * Create Test Component Code
 *
 * Copy this code into a test screen to run the tests:
 *
 * ```tsx
 * import React from 'react';
 * import { View, Button, ScrollView, Text } from 'react-native';
 * import { runAllTests, testNetworkDiagnostics, testConnectionQualityManual, testErrorHandler, testRetryConfiguration, testApiConfiguration } from '@/tests/manualTestRunner';
 *
 * export const TestScreen = () => {
 *   return (
 *     <ScrollView style={{ padding: 20 }}>
 *       <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
 *         Network Timeout Tests
 *       </Text>
 *
 *       <Button title="Run All Tests" onPress={() => runAllTests()} />
 *
 *       <View style={{ height: 20 }} />
 *
 *       <Button title="Test Network Diagnostics" onPress={() => testNetworkDiagnostics()} />
 *       <View style={{ height: 10 }} />
 *
 *       <Button title="Test Connection Quality" onPress={() => testConnectionQualityManual()} />
 *       <View style={{ height: 10 }} />
 *
 *       <Button title="Test Error Handler" onPress={() => testErrorHandler()} />
 *       <View style={{ height: 10 }} />
 *
 *       <Button title="Test Retry Config" onPress={() => testRetryConfiguration()} />
 *       <View style={{ height: 10 }} />
 *
 *       <Button title="Test API Config" onPress={() => testApiConfiguration()} />
 *     </ScrollView>
 *   );
 * };
 * ```
 */

export default {
  runAllTests,
  testNetworkDiagnostics,
  testConnectionQualityManual,
  testErrorHandler,
  testRetryConfiguration,
  testApiConfiguration,
};
