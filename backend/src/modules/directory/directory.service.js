import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPublishedSubmissions } from '../submissions/submission.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

/**
 * Safely load and parse a JSON dataset file from backend/src/data
 */
function loadJsonFile(filename) {
  try {
    const fullPath = path.join(DATA_DIR, filename);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`[Directory Service] Failed reading ${filename}:`, error.message);
  }
  return [];
}

/**
 * Transform a published user submission into a directory record format
 */
function transformSubmissionToRecord(sub) {
  return {
    id: sub._id ? sub._id.toString() : sub.id,
    name: sub.name,
    category: sub.category,
    description: sub.description,
    address: sub.address,
    locality: sub.locality,
    phone: sub.phone || '',
    emergencyPhone: sub.emergencyPhone || '',
    website: sub.website || '',
    latitude: sub.coordinates?.latitude || null,
    longitude: sub.coordinates?.longitude || null,
    sourceUrl: sub.sourceUrl || '',
    photoUrl: sub.photoUrl || '',
    additionalInfo: sub.additionalInfo || '',
    verificationStatus: 'community_published',
    isCommunityContribution: true,
    contributedBy: sub.submittedBy?.name || 'Local Contributor',
  };
}

/**
 * Filter, search, and paginate an array of directory items
 */
function filterAndPaginate(items, { search = '', category = '', locality = '', page = 1, limit = 20 }) {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  let results = [...items];

  // Category filter
  if (category && category.toLowerCase() !== 'all') {
    const c = category.trim().toLowerCase();
    results = results.filter((item) => (item.category || '').toLowerCase().includes(c));
  }

  // Locality filter
  if (locality && locality.toLowerCase() !== 'all') {
    const l = locality.trim().toLowerCase();
    results = results.filter((item) => (item.locality || '').toLowerCase().includes(l));
  }

  // Full text search
  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    results = results.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(s) ||
        (item.description || '').toLowerCase().includes(s) ||
        (item.address || '').toLowerCase().includes(s) ||
        (item.locality || '').toLowerCase().includes(s)
    );
  }

  // Sort alphabetically by name
  results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const total = results.length;
  const paginated = results.slice(skip, skip + safeLimit);

  return {
    items: paginated,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
      hasNextPage: safePage * safeLimit < total,
      hasPrevPage: safePage > 1,
    },
  };
}

/**
 * Get Places & Landmarks (curated + published community submissions)
 */
export async function getPlaces(params = {}) {
  const curated = loadJsonFile('places.json');
  const publishedSubmissions = await getPublishedSubmissions();

  // Find submissions matching places/tourist/nature/religious categories
  const placeCategories = [
    'parks & lakes',
    'tourist attraction',
    'historical & heritage',
    'religious place',
    'landmark',
    'place',
  ];

  const matchedSubmissions = publishedSubmissions
    .filter((sub) => {
      const c = (sub.category || '').toLowerCase();
      return placeCategories.some((pc) => c.includes(pc));
    })
    .map(transformSubmissionToRecord);

  const combined = [...curated, ...matchedSubmissions];
  return filterAndPaginate(combined, params);
}

/**
 * Get Hospitals & Health Clinics (curated + published community submissions)
 */
export async function getHospitals(params = {}) {
  const curated = loadJsonFile('hospitals.json');
  const publishedSubmissions = await getPublishedSubmissions();

  const hospitalCategories = ['hospital', 'clinic', 'health', 'phc', 'pharmacy'];

  const matchedSubmissions = publishedSubmissions
    .filter((sub) => {
      const c = (sub.category || '').toLowerCase();
      return hospitalCategories.some((hc) => c.includes(hc));
    })
    .map(transformSubmissionToRecord);

  const combined = [...curated, ...matchedSubmissions];
  return filterAndPaginate(combined, params);
}

/**
 * Get Bank ATMs (curated + published community submissions)
 */
export async function getAtms(params = {}) {
  const curated = loadJsonFile('atms.json');
  const publishedSubmissions = await getPublishedSubmissions();

  const matchedSubmissions = publishedSubmissions
    .filter((sub) => (sub.category || '').toLowerCase().includes('atm'))
    .map(transformSubmissionToRecord);

  const combined = [...curated, ...matchedSubmissions];
  return filterAndPaginate(combined, params);
}

/**
 * Get Important Contacts and Emergency Helplines
 */
export async function getContacts(params = {}) {
  const curated = loadJsonFile('contacts.json');
  const publishedSubmissions = await getPublishedSubmissions();

  const matchedSubmissions = publishedSubmissions
    .filter((sub) => {
      const c = (sub.category || '').toLowerCase();
      return c.includes('contact') || c.includes('helpline') || c.includes('emergency');
    })
    .map(transformSubmissionToRecord);

  const combined = [...curated, ...matchedSubmissions];
  return filterAndPaginate(combined, params);
}

export default {
  getPlaces,
  getHospitals,
  getAtms,
  getContacts,
};
