/**
 * Network Utilities Module
 *
 * Provides utilities for checking network connectivity and server reachability.
 * Uses native fetch API for compatibility with React Native.
 */

import env from '@/constants/env';
import { Platform } from 'react-native';

/**
 * Network status types
 */
export enum NetworkStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Connection check result
 */
export interface ConnectionCheckResult {
  isConnected: boolean;
  hasInternet: boolean;
  canReachServer: boolean;
  latency?: number;
  error?: string;
}

/**
 * Check if device has internet connectivity
 * Tests connection to reliable external services
 */
export const checkInternetConnectivity = async (): Promise<boolean> => {
  try {
    // Try multiple reliable endpoints for redundancy
    const endpoints = [
      'https://www.google.com/generate_204',
      'https://www.cloudflare.com/cdn-cgi/trace',
      'https://1.1.1.1/cdn-cgi/trace',
    ];

    // Race condition - return true if any endpoint responds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(endpoints[0], {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });
      clearTimeout(timeoutId);
      return response.ok || response.status === 204;
    } catch (error) {
      clearTimeout(timeoutId);
      // Try second endpoint
      try {
        const response = await fetch(endpoints[1], {
          method: 'HEAD',
          signal: controller.signal,
          cache: 'no-cache',
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  } catch (error) {
    console.error('Internet connectivity check failed:', error);
    return false;
  }
};

/**
 * Check if backend server is reachable
 * Attempts to connect to the configured backend URL
 */
export const checkServerReachability = async (): Promise<{
  reachable: boolean;
  latency?: number;
  error?: string;
  statusCode?: number;
}> => {
  if (!env.backendUrl) {
    return {
      reachable: false,
      error: 'Backend URL not configured',
    };
  }

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased to 15s timeout

    const response = await fetch(`${env.backendUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    if (response.ok) {
      return {
        reachable: true,
        latency,
        statusCode: response.status,
      };
    }

    // Server responded but with error status
    return {
      reachable: true,
      latency,
      statusCode: response.status,
      error: `Server returned status ${response.status}`,
    };
  } catch (error: any) {
    const latency = Date.now() - startTime;

    if (error.name === 'AbortError') {
      return {
        reachable: false,
        latency,
        error: 'Connection timeout - server took too long to respond (15s+)',
      };
    }

    return {
      reachable: false,
      latency,
      error: error.message || 'Failed to reach server',
    };
  }
};

/**
 * Comprehensive network diagnostics
 */
export const getComprehensiveNetworkDiagnostics = async (): Promise<{
  hasInternet: boolean;
  serverReachable: boolean;
  latency?: number;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor' | 'offline';
  recommendations: string[];
  timestamp: string;
}> => {
  const diagnostics = {
    hasInternet: false,
    serverReachable: false,
    latency: undefined as number | undefined,
    connectionQuality: 'offline' as 'excellent' | 'good' | 'fair' | 'poor' | 'offline',
    recommendations: [] as string[],
    timestamp: new Date().toISOString(),
  };

  // Check internet connectivity
  diagnostics.hasInternet = await checkInternetConnectivity();

  if (!diagnostics.hasInternet) {
    diagnostics.recommendations.push('❌ No internet connection detected');
    diagnostics.recommendations.push('✓ Check your WiFi or mobile data connection');
    diagnostics.recommendations.push('✓ Try toggling airplane mode on and off');
    return diagnostics;
  }

  // Check server reachability
  const serverCheck = await checkServerReachability();
  diagnostics.serverReachable = serverCheck.reachable;
  diagnostics.latency = serverCheck.latency;

  if (!diagnostics.serverReachable) {
    diagnostics.recommendations.push('❌ Cannot reach backend server');
    diagnostics.recommendations.push(`✓ Backend URL: ${env.backendUrl}`);
    diagnostics.recommendations.push('✓ Verify the backend server is running');
    diagnostics.recommendations.push('✓ Check if the URL is correct in your environment settings');

    if (serverCheck.error?.includes('timeout')) {
      diagnostics.recommendations.push('✓ Server is taking too long to respond (15s+)');
      diagnostics.recommendations.push('✓ The server might be overloaded or experiencing issues');
    }

    return diagnostics;
  }

  // Determine connection quality based on latency
  if (diagnostics.latency !== undefined) {
    if (diagnostics.latency < 100) {
      diagnostics.connectionQuality = 'excellent';
      diagnostics.recommendations.push('✅ Excellent connection quality');
    } else if (diagnostics.latency < 300) {
      diagnostics.connectionQuality = 'good';
      diagnostics.recommendations.push('✅ Good connection quality');
    } else if (diagnostics.latency < 1000) {
      diagnostics.connectionQuality = 'fair';
      diagnostics.recommendations.push('⚠️ Fair connection quality - requests may be slower');
      diagnostics.recommendations.push('✓ Consider moving closer to your WiFi router');
    } else {
      diagnostics.connectionQuality = 'poor';
      diagnostics.recommendations.push('⚠️ Poor connection quality - expect delays');
      diagnostics.recommendations.push('✓ Check your internet connection');
      diagnostics.recommendations.push('✓ Try switching to a different network');
    }
  }

  return diagnostics;
};

/**
 * Test connection quality with multiple pings
 */
export const testConnectionQuality = async (): Promise<{
  averageLatency: number;
  minLatency: number;
  maxLatency: number;
  successRate: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}> => {
  const results: number[] = [];
  const attempts = 3;

  for (let i = 0; i < attempts; i++) {
    const serverCheck = await checkServerReachability();
    if (serverCheck.reachable && serverCheck.latency !== undefined) {
      results.push(serverCheck.latency);
    }
    // Small delay between attempts
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const successRate = (results.length / attempts) * 100;
  const averageLatency =
    results.length > 0 ? results.reduce((a, b) => a + b, 0) / results.length : 0;
  const minLatency = results.length > 0 ? Math.min(...results) : 0;
  const maxLatency = results.length > 0 ? Math.max(...results) : 0;

  let quality: 'excellent' | 'good' | 'fair' | 'poor';
  if (averageLatency < 100 && successRate === 100) {
    quality = 'excellent';
  } else if (averageLatency < 300 && successRate >= 66) {
    quality = 'good';
  } else if (averageLatency < 1000 && successRate >= 33) {
    quality = 'fair';
  } else {
    quality = 'poor';
  }

  return {
    averageLatency,
    minLatency,
    maxLatency,
    successRate,
    quality,
  };
};

/**
 * Perform comprehensive connection check
 * Tests both internet connectivity and server reachability
 */
export const performConnectionCheck = async (): Promise<ConnectionCheckResult> => {
  console.log('🔍 Performing connection check...');

  // Check internet first
  const hasInternet = await checkInternetConnectivity();
  console.log(`📡 Internet connectivity: ${hasInternet ? '✅ Connected' : '❌ Disconnected'}`);

  if (!hasInternet) {
    return {
      isConnected: false,
      hasInternet: false,
      canReachServer: false,
      error: 'No internet connection',
    };
  }

  // Check server reachability
  const serverCheck = await checkServerReachability();
  console.log(
    `🖥️  Server reachability: ${serverCheck.reachable ? '✅ Reachable' : '❌ Unreachable'}`
  );

  if (serverCheck.latency) {
    console.log(`⚡ Server latency: ${serverCheck.latency}ms`);
  }

  if (serverCheck.error) {
    console.log(`⚠️  Server error: ${serverCheck.error}`);
  }

  return {
    isConnected: hasInternet && serverCheck.reachable,
    hasInternet,
    canReachServer: serverCheck.reachable,
    latency: serverCheck.latency,
    error: serverCheck.error,
  };
};

/**
 * Get network diagnostics information
 * Useful for debugging connection issues
 */
export const getNetworkDiagnostics = async (): Promise<{
  platform: string;
  backendUrl: string;
  timestamp: string;
  connectionCheck: ConnectionCheckResult;
}> => {
  const connectionCheck = await performConnectionCheck();

  return {
    platform: Platform.OS,
    backendUrl: env.backendUrl || 'NOT_CONFIGURED',
    timestamp: new Date().toISOString(),
    connectionCheck,
  };
};

/**
 * Simple ping to check if server is alive
 * Faster than full connection check
 */
export const pingServer = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const response = await fetch(`${env.backendUrl}/health`, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Wait for network to become available
 * Useful for retry logic
 */
export const waitForNetwork = async (
  maxWaitTime: number = 30000,
  checkInterval: number = 2000
): Promise<boolean> => {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const hasInternet = await checkInternetConnectivity();
    if (hasInternet) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, checkInterval));
  }

  return false;
};

export default {
  checkInternetConnectivity,
  checkServerReachability,
  performConnectionCheck,
  getNetworkDiagnostics,
  getComprehensiveNetworkDiagnostics,
  testConnectionQuality,
  pingServer,
  waitForNetwork,
  NetworkStatus,
};
