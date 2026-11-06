import { loadJsonDataset, normalizeRecord } from '../../utils/dataLoader.js';
import { getPublishedSubmissions } from '../submissions/submission.service.js';

/**
 * Transform a published user submission into a directory record format
 */
function transformSubmissionToRecord(sub) {
  return normalizeRecord({
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
    coordinates: sub.coordinates || null,
    sourceUrl: sub.sourceUrl || '',
    photoUrl: sub.photoUrl || '',
    additionalInfo: sub.additionalInfo || '',
    verificationStatus: 'community_published',
    isCommunityContribution: true,
    contributedBy: sub.submittedBy?.name || 'Local Contributor',
  });
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

  // Locality filter (gracefully handling 'Hosur City' vs 'Hosur Main')
  if (locality && locality.toLowerCase() !== 'all') {
    const l = locality.trim().toLowerCase();
    results = results.filter((item) => {
      const itemLoc = (item.locality || '').toLowerCase();
      if (itemLoc.includes(l)) return true;
      if (l.includes('hosur') && itemLoc.includes('hosur')) return true;
      return false;
    });
  }

  // Full text search
  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    results = results.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(s) ||
        (item.description || '').toLowerCase().includes(s) ||
        (item.address || '').toLowerCase().includes(s) ||
        (item.locality || '').toLowerCase().includes(s) ||
        (item.category || '').toLowerCase().includes(s)
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
  const curated = loadJsonDataset('places.json');
  const publishedSubmissions = await getPublishedSubmissions();

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
  const curated = loadJsonDataset('hospitals.json');
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
  const curated = loadJsonDataset('atms.json');
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
  const curated = loadJsonDataset('contacts.json');
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

/**
 * Get unified listing of all active regional places, hospitals, and ATMs
 */
export async function getAllDirectoryItems(params = {}) {
  const places = loadJsonDataset('places.json');
  const hospitals = loadJsonDataset('hospitals.json');
  const atms = loadJsonDataset('atms.json');
  const published = (await getPublishedSubmissions()).map(transformSubmissionToRecord);

  const seenIds = new Set();
  const allItems = [];

  for (const item of [...places, ...hospitals, ...atms, ...published]) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      allItems.push(item);
    }
  }

  return filterAndPaginate(allItems, params);
}

export default {
  getPlaces,
  getHospitals,
  getAtms,
  getContacts,
  getAllDirectoryItems,
};
