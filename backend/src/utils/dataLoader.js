import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Potential data directories in order of priority:
// 1. Root /data (repository root for open community contributions)
// 2. backend/src/data (internal backend package directory)
const CANDIDATE_DIRS = [
  path.resolve(__dirname, '../../../data'),
  path.resolve(__dirname, '../data'),
  path.resolve(process.cwd(), 'data'),
  path.resolve(process.cwd(), 'backend/src/data'),
];

/**
 * Locate the active data directory
 */
export function resolveDataPath(filename) {
  for (const dir of CANDIDATE_DIRS) {
    const candidate = path.join(dir, filename);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  // Default to relative backend/src/data if not found yet
  return path.resolve(__dirname, '../data', filename);
}

/**
 * Standardize record fields across flat and nested schemas
 */
export function normalizeRecord(item) {
  if (!item || typeof item !== 'object') return item;

  const lat = item.latitude ?? item.coordinates?.latitude ?? null;
  const lon = item.longitude ?? item.coordinates?.longitude ?? null;
  const phoneVal = item.phone || item.contact || item.phoneNumber || '';
  const sourceVal = item.sourceUrl || item.officialSource || '';

  return {
    ...item,
    phone: phoneVal,
    contact: phoneVal,
    latitude: lat,
    longitude: lon,
    coordinates: lat !== null && lon !== null ? { latitude: lat, longitude: lon } : (item.coordinates || null),
    sourceUrl: sourceVal,
    officialSource: sourceVal,
    // Bank name fallbacks
    bankName: item.bankName || (item.name ? item.name.split(' - ')[0] : ''),
    branchName: item.branchName || (item.name ? (item.name.split(' - ')[1] || item.name) : ''),
    // Department / description fallbacks
    department: item.department || item.description || '',
    description: item.description || item.department || '',
  };
}

/**
 * Safely load, parse, and normalize a JSON dataset
 */
export function loadJsonDataset(filename) {
  const filePath = resolveDataPath(filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeRecord);
      }
    }
  } catch (error) {
    console.error(`[DataLoader] Error loading ${filename} from ${filePath}:`, error.message);
  }
  return [];
}

export default {
  resolveDataPath,
  normalizeRecord,
  loadJsonDataset,
};

