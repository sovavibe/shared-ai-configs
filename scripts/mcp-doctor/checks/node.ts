/**
 * Check Node.js and npm
 */

import { execSync } from 'node:child_process';

import { logSuccess, logError, logSection, directLog } from '../utils/logger.js';

/**
 * Check Node.js and npm
 */
export function checkNode(): boolean {
  logSection('6️⃣ Checking Node.js and npm');

  try {
    const nodeVersion = execSync('node --version', { stdio: 'pipe' }).toString().trim();
    logSuccess(`Node.js version: ${nodeVersion}`);

    const npmVersion = execSync('npm --version', { stdio: 'pipe' }).toString().trim();
    logSuccess(`npm version: ${npmVersion}\n`);
    return true;
  } catch (error) {
    logError('Node.js or npm is not installed');
    directLog('   Install Node.js: https://nodejs.org/');
    directLog('   Recommended version: v20 LTS\n');
    return false;
  }
}
