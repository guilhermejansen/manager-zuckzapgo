#!/usr/bin/env node
/**
 * ===========================================================================
 * Health Check Script for Docker
 * Manager ZuckZapGo - Next.js 16 Application
 * ===========================================================================
 *
 * This script performs HTTP health checks on the Next.js application.
 * Used by Docker HEALTHCHECK directive to determine container health.
 *
 * Exit codes:
 * - 0: Application is healthy
 * - 1: Application is unhealthy
 */

const http = require('http');

// Configuration
const HOST = process.env.HOSTNAME || 'localhost';
const PORT = process.env.PORT || 3000;
const TIMEOUT = 5000; // 5 seconds timeout
const PATH = '/'; // Health check endpoint

/**
 * Perform HTTP health check
 */
function performHealthCheck() {
  const options = {
    hostname: HOST,
    port: PORT,
    path: PATH,
    method: 'GET',
    timeout: TIMEOUT,
  };

  const startTime = Date.now();

  const req = http.request(options, (res) => {
    const responseTime = Date.now() - startTime;

    // Accept any 2xx or 3xx status codes (including redirects)
    const isHealthy = res.statusCode >= 200 && res.statusCode < 400;

    if (isHealthy) {
      console.log(`[HEALTHCHECK] OK - Status: ${res.statusCode}, Response time: ${responseTime}ms`);
      process.exit(0);
    } else {
      console.error(`[HEALTHCHECK] FAILED - Status: ${res.statusCode}, Response time: ${responseTime}ms`);
      process.exit(1);
    }
  });

  req.on('error', (err) => {
    const responseTime = Date.now() - startTime;
    console.error(`[HEALTHCHECK] ERROR - ${err.message}, Response time: ${responseTime}ms`);
    process.exit(1);
  });

  req.on('timeout', () => {
    const responseTime = Date.now() - startTime;
    console.error(`[HEALTHCHECK] TIMEOUT - Request timed out after ${responseTime}ms`);
    req.destroy();
    process.exit(1);
  });

  req.end();
}

// Run health check
try {
  performHealthCheck();
} catch (error) {
  console.error(`[HEALTHCHECK] EXCEPTION - ${error.message}`);
  process.exit(1);
}
