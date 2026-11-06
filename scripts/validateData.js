#!/usr/bin/env node

/**
 * HosurOne Regional Datasets Validator
 * Validates JSON syntax, schema completeness, unique IDs, coordinate bounds, and format integrity.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate target data directory (root /data preferred, fallback to backend/src/data)
const ROOT_DATA_DIR = path.resolve(__dirname, '../data');
const BACKEND_DATA_DIR = path.resolve(__dirname, '../backend/src/data');

const DATA_DIR = fs.existsSync(ROOT_DATA_DIR) ? ROOT_DATA_DIR : BACKEND_DATA_DIR;

console.log('----------------------------------------------------');
console.log('HosurOne Regional Dataset Quality Validator');
console.log(`Inspecting data directory: ${DATA_DIR}`);
console.log('----------------------------------------------------');

const DATASET_SCHEMAS = {
  'government.json': {
    required: ['id', 'name', 'category', 'locality', 'address'],
  },
  'banks.json': {
    required: ['id', 'name', 'category', 'locality', 'address', 'ifsc'],
  },
  'hospitals.json': {
    required: ['id', 'name', 'category', 'locality', 'address'],
  },
  'atms.json': {
    required: ['id', 'name', 'category', 'locality', 'address'],
  },
  'places.json': {
    required: ['id', 'name', 'category', 'locality', 'address'],
  },
  'contacts.json': {
    required: ['id', 'name', 'category', 'locality', 'phone'],
  },
};

const URL_REGEX = /^https?:\/\/.+/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

let totalFilesChecked = 0;
let totalRecordsChecked = 0;
let totalErrors = 0;
let totalWarnings = 0;

const errors = [];
const warnings = [];

function validateDataset(filename) {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    warnings.push(`File not found: ${filename} (skipped)`);
    return;
  }

  totalFilesChecked++;
  let raw = '';
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    errors.push(`[${filename}] Could not read file: ${err.message}`);
    totalErrors++;
    return;
  }

  // 1. JSON Syntax Check
  let records;
  try {
    records = JSON.parse(raw);
  } catch (err) {
    errors.push(`[${filename}] Invalid JSON syntax: ${err.message}`);
    totalErrors++;
    return;
  }

  if (!Array.isArray(records)) {
    errors.push(`[${filename}] Root element must be a JSON array of objects.`);
    totalErrors++;
    return;
  }

  const schema = DATASET_SCHEMAS[filename] || { required: ['id', 'name', 'category', 'locality'] };
  const seenIds = new Set();

  records.forEach((record, index) => {
    totalRecordsChecked++;
    const recordLabel = record?.name || record?.id || `Record #${index + 1}`;

    if (!record || typeof record !== 'object') {
      errors.push(`[${filename}] ${recordLabel}: Record must be a valid JSON object.`);
      totalErrors++;
      return;
    }

    // 2. Required Fields Check
    for (const field of schema.required) {
      if (record[field] === undefined || record[field] === null || String(record[field]).trim() === '') {
        errors.push(`[${filename}] ${recordLabel}: Missing required field '${field}'.`);
        totalErrors++;
      }
    }

    // 3. Unique ID Check
    if (record.id) {
      if (seenIds.has(record.id)) {
        errors.push(`[${filename}] Duplicate record ID detected: '${record.id}'.`);
        totalErrors++;
      } else {
        seenIds.add(record.id);
      }
    }

    // 4. Phone Number Type Check
    if (record.phone !== undefined) {
      if (typeof record.phone !== 'string') {
        errors.push(`[${filename}] ${recordLabel}: 'phone' must be a string, got ${typeof record.phone}.`);
        totalErrors++;
      }
    }

    if (record.contact !== undefined) {
      if (typeof record.contact !== 'string') {
        errors.push(`[${filename}] ${recordLabel}: 'contact' must be a string, got ${typeof record.contact}.`);
        totalErrors++;
      }
    }

    // 5. Coordinates Validation
    const lat = record.latitude ?? record.coordinates?.latitude;
    const lon = record.longitude ?? record.coordinates?.longitude;

    if (lat !== undefined && lat !== null) {
      if (typeof lat !== 'number' || Number.isNaN(lat) || lat < -90 || lat > 90) {
        errors.push(`[${filename}] ${recordLabel}: Invalid latitude value (${lat}). Must be a number between -90 and 90.`);
        totalErrors++;
      }
    }

    if (lon !== undefined && lon !== null) {
      if (typeof lon !== 'number' || Number.isNaN(lon) || lon < -180 || lon > 180) {
        errors.push(`[${filename}] ${recordLabel}: Invalid longitude value (${lon}). Must be a number between -180 and 180.`);
        totalErrors++;
      }
    }

    // Geographic sanity check for Hosur region (~12°N to ~13.5°N, ~77°E to ~78.5°E)
    if (lat && lon) {
      if (lat < 12.0 || lat > 13.5 || lon < 77.0 || lon > 78.5) {
        warnings.push(`[${filename}] ${recordLabel}: Coordinates (${lat}, ${lon}) appear outside Greater Hosur boundary (12.0-13.5°N, 77.0-78.5°E). Verify accuracy.`);
        totalWarnings++;
      }
    }

    // 6. Source / Official URL Validation
    const testUrls = [record.sourceUrl, record.officialSource, record.website].filter(Boolean);
    for (const url of testUrls) {
      if (!URL_REGEX.test(url)) {
        errors.push(`[${filename}] ${recordLabel}: Malformed URL '${url}'. Must start with http:// or https://.`);
        totalErrors++;
      }
    }

    // 7. Date Format Validation
    if (record.lastVerified) {
      if (!DATE_REGEX.test(record.lastVerified)) {
        errors.push(`[${filename}] ${recordLabel}: 'lastVerified' must match format YYYY-MM-DD (e.g. 2026-11-06), got '${record.lastVerified}'.`);
        totalErrors++;
      }
    }
  });

  console.log(`✓ ${filename.padEnd(20)}: ${records.length} records verified.`);
}

// Validate each registered dataset
for (const filename of Object.keys(DATASET_SCHEMAS)) {
  validateDataset(filename);
}

console.log('----------------------------------------------------');
console.log(`Validation Summary:`);
console.log(`- Files inspected:    ${totalFilesChecked}`);
console.log(`- Records inspected:  ${totalRecordsChecked}`);
console.log(`- Errors:             ${totalErrors}`);
console.log(`- Quality warnings:   ${totalWarnings}`);
console.log('----------------------------------------------------');

if (warnings.length > 0) {
  console.log('\nQuality Warnings:');
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
}

if (errors.length > 0) {
  console.error('\nValidation Errors:');
  errors.forEach((e) => console.error(`  ✖ ${e}`));
  console.error('\nDataset validation FAILED. Please resolve errors before contributing.');
  process.exit(1);
} else {
  console.log('\nAll HosurOne datasets passed validation successfully! Ready for contributor submission.\n');
  process.exit(0);
}

