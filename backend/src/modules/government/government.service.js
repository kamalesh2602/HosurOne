import mongoose from 'mongoose';
import GovernmentOffice from './government.model.js';
import { loadJsonDataset } from '../../utils/dataLoader.js';

/**
 * Check if MongoDB connection is currently active
 */
function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * Load all verified government, hospital, and public helpline records from JSON datasets
 */
export function getBaselineGovernmentRecords() {
  const gov = loadJsonDataset('government.json');
  const hospitals = loadJsonDataset('hospitals.json').map((h) => ({
    ...h,
    department: h.department || 'Health & Family Welfare Department, Govt. of Tamil Nadu',
    category: 'Hospital',
  }));
  const helplines = loadJsonDataset('contacts.json').map((c) => ({
    ...c,
    department: c.agency || 'Emergency & Public Utility Helplines',
    category: 'Helpline',
    address: c.address || `${c.locality}, Hosur Region`,
  }));

  const seenIds = new Set();
  const combined = [];
  for (const item of [...gov, ...hospitals, ...helplines]) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      combined.push(item);
    }
  }
  return combined;
}

/**
 * Seed verified government data into MongoDB if connected and collection is empty
 */
export async function seedGovernmentData() {
  if (!isDbConnected()) return;

  try {
    const count = await GovernmentOffice.countDocuments();
    if (count === 0) {
      const records = getBaselineGovernmentRecords();
      console.log('[Database] Seeding verified government offices into MongoDB...');
      await GovernmentOffice.insertMany(records);
      console.log(`[Database] Successfully seeded ${records.length} government offices.`);
    }
  } catch (error) {
    console.warn(`[Database Warning] Could not seed government offices: ${error.message}`);
  }
}

/**
 * Retrieve list of government offices with search, filtering, and pagination
 */
export async function getGovernmentOffices({
  search = '',
  category = '',
  locality = '',
  page = 1,
  limit = 10,
} = {}) {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (safePage - 1) * safeLimit;

  // 1. If database is connected, query MongoDB
  if (isDbConnected()) {
    try {
      const query = {};

      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (locality && locality !== 'all') {
        query.locality = { $regex: new RegExp(`^${locality}$`, 'i') };
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { name: regex },
          { department: regex },
          { address: regex },
          { servicesOffered: regex },
        ];
      }

      const [offices, total] = await Promise.all([
        GovernmentOffice.find(query).skip(skip).limit(safeLimit).sort({ name: 1 }).lean(),
        GovernmentOffice.countDocuments(query),
      ]);

      return {
        offices,
        pagination: {
          total,
          page: safePage,
          limit: safeLimit,
          totalPages: Math.ceil(total / safeLimit) || 1,
          hasNextPage: safePage * safeLimit < total,
          hasPrevPage: safePage > 1,
        },
      };
    } catch (err) {
      console.warn(`[Database Fallback] Query error, falling back to in-memory verified data: ${err.message}`);
    }
  }

  // 2. Stateless / In-memory Fallback from active JSON datasets
  let results = getBaselineGovernmentRecords();

  if (category && category.toLowerCase() !== 'all') {
    const catLower = category.toLowerCase();
    results = results.filter((item) => (item.category || '').toLowerCase().includes(catLower));
  }

  if (locality && locality.toLowerCase() !== 'all') {
    const locLower = locality.toLowerCase();
    results = results.filter((item) => (item.locality || '').toLowerCase().includes(locLower));
  }

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    results = results.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(s) ||
        (item.department || '').toLowerCase().includes(s) ||
        (item.description || '').toLowerCase().includes(s) ||
        (item.address || '').toLowerCase().includes(s) ||
        item.servicesOffered?.some((svc) => svc.toLowerCase().includes(s))
    );
  }

  // Sort alphabetically
  results.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const total = results.length;
  const paginated = results.slice(skip, skip + safeLimit);

  return {
    offices: paginated,
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
 * Retrieve a single government office listing by ID
 */
export async function getGovernmentOfficeById(id) {
  if (!id) return null;

  if (isDbConnected()) {
    try {
      const office = await GovernmentOffice.findOne({
        $or: [{ id }, ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : [])],
      }).lean();
      if (office) return office;
    } catch (err) {
      console.warn(`[Database Fallback] Failed to get office by ID, falling back to memory: ${err.message}`);
    }
  }

  const baseline = getBaselineGovernmentRecords();
  return baseline.find((item) => item.id === id) || null;
}

export default {
  seedGovernmentData,
  getGovernmentOffices,
  getGovernmentOfficeById,
  getBaselineGovernmentRecords,
};
