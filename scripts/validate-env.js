#!/usr/bin/env node

/**
 * Environment Validation Script
 * Run this before starting the dev server or building
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  const envFiles = ['.env.local', '.env', '.env.production'];
  let foundEnvFile = false;

  log('\n📋 Checking environment files...', 'blue');

  for (const file of envFiles) {
    const filePath = join(rootDir, file);
    if (existsSync(filePath)) {
      log(`  ✓ Found ${file}`, 'green');
      foundEnvFile = true;
    }
  }

  if (!foundEnvFile) {
    log('  ⚠ No environment file found', 'yellow');
    log('  → Copy .env.example to .env.local and configure it', 'yellow');

    if (existsSync(join(rootDir, '.env.example'))) {
      log('  → Run: cp .env.example .env.local', 'blue');
    }
    return false;
  }

  return true;
}

function loadEnvFile() {
  const envFiles = ['.env.local', '.env'];

  for (const file of envFiles) {
    const filePath = join(rootDir, file);
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const vars = {};

        content.split('\n').forEach(line => {
          line = line.trim();
          if (line && !line.startsWith('#')) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
              const [, key, value] = match;
              vars[key.trim()] = value.trim();
            }
          }
        });

        return vars;
      } catch (error) {
        log(`  ✗ Error reading ${file}: ${error.message}`, 'red');
      }
    }
  }

  return {};
}

function validateVariables(vars) {
  log('\n🔍 Validating environment variables...', 'blue');

  const errors = [];
  const warnings = [];

  // Required variables
  const required = {
    'VITE_API_BASE_URL': 'Backend API URL',
  };

  // Recommended variables
  const recommended = {
    'GEMINI_API_KEY': 'Gemini AI API key (will be moved to VITE_GEMINI_API_KEY)',
    'VITE_GEMINI_API_KEY': 'Gemini AI API key',
  };

  // Check required variables
  for (const [key, description] of Object.entries(required)) {
    if (!vars[key]) {
      errors.push(`Missing required variable: ${key} (${description})`);
    } else if (vars[key].includes('your_') || vars[key].includes('_here')) {
      errors.push(`${key} appears to be a placeholder value`);
    } else {
      log(`  ✓ ${key}`, 'green');
    }
  }

  // Check recommended variables
  const hasGeminiKey = vars['GEMINI_API_KEY'] || vars['VITE_GEMINI_API_KEY'];
  if (!hasGeminiKey) {
    warnings.push('No Gemini API key configured. AI features will not work.');
  } else {
    log(`  ✓ Gemini API key configured`, 'green');
  }

  // Validate URL format
  if (vars['VITE_API_BASE_URL']) {
    try {
      const url = new URL(vars['VITE_API_BASE_URL']);
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push('VITE_API_BASE_URL must use http or https protocol');
      }
    } catch {
      errors.push('VITE_API_BASE_URL is not a valid URL');
    }
  }

  // Check for production issues
  const nodeEnv = vars['NODE_ENV'] || process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    if (vars['VITE_API_BASE_URL']?.includes('localhost')) {
      errors.push('VITE_API_BASE_URL should not use localhost in production');
    }

    if (!vars['VITE_SENTRY_DSN']) {
      warnings.push('VITE_SENTRY_DSN not set. Error monitoring disabled in production.');
    }
  }

  // Security warnings
  if (vars['GEMINI_API_KEY'] && !vars['VITE_GEMINI_API_KEY']) {
    warnings.push('GEMINI_API_KEY should be migrated to backend for security');
  }

  return { errors, warnings };
}

function checkPackageJson() {
  log('\n📦 Checking package.json...', 'blue');

  try {
    const packagePath = join(rootDir, 'package.json');
    const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));

    const requiredScripts = ['dev', 'build', 'lint', 'type-check', 'test'];
    const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);

    if (missingScripts.length > 0) {
      log(`  ⚠ Missing scripts: ${missingScripts.join(', ')}`, 'yellow');
    } else {
      log(`  ✓ All required scripts present`, 'green');
    }

    return missingScripts.length === 0;
  } catch (error) {
    log(`  ✗ Error reading package.json: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('\n' + '='.repeat(60), 'bold');
  log('  Arbi.ai Environment Validation', 'bold');
  log('='.repeat(60) + '\n', 'bold');

  let hasErrors = false;

  // Check environment files
  if (!checkEnvFile()) {
    hasErrors = true;
  }

  // Load and validate variables
  const vars = loadEnvFile();
  const { errors, warnings } = validateVariables(vars);

  // Check package.json
  checkPackageJson();

  // Report results
  log('\n' + '='.repeat(60), 'bold');

  if (errors.length > 0) {
    log('\n❌ ERRORS:', 'red');
    errors.forEach(error => log(`  • ${error}`, 'red'));
    hasErrors = true;
  }

  if (warnings.length > 0) {
    log('\n⚠️  WARNINGS:', 'yellow');
    warnings.forEach(warning => log(`  • ${warning}`, 'yellow'));
  }

  if (!hasErrors && warnings.length === 0) {
    log('\n✅ All checks passed!', 'green');
    log('   You can now run: npm run dev', 'green');
  } else if (!hasErrors) {
    log('\n✅ Validation passed with warnings', 'green');
    log('   You can proceed, but consider addressing the warnings above', 'yellow');
  } else {
    log('\n❌ Validation failed', 'red');
    log('   Please fix the errors above before proceeding', 'red');
  }

  log('\n' + '='.repeat(60) + '\n', 'bold');

  process.exit(hasErrors ? 1 : 0);
}

main();
