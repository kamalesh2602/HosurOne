import mongoose from 'mongoose';
import Submission from './submission.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// In-memory submissions store when MongoDB is not connected
const inMemorySubmissions = new Map();

// Calculate distance in meters between two lat/lon points using Haversine formula
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Load all curated directory records across all JSON files for duplicate detection
 */
function loadAllCuratedRecords() {
  const records = [];
  const files = ['government.json', 'banks.json', 'hospitals.json', 'atms.json', 'places.json', 'contacts.json'];

  for (const f of files) {
    try {
      const p = path.join(DATA_DIR, f);
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          records.push(...parsed);
        }
      }
    } catch {
      // Ignore read errors
    }
  }
  return records;
}

/**
 * Check if a submission appears to be a duplicate of an existing record or published item
 */
export async function detectDuplicate({ name, category, locality, coordinates }) {
  const curated = loadAllCuratedRecords();
  const searchName = (name || '').trim().toLowerCase();
  const searchCat = (category || '').trim().toLowerCase();
  const searchLoc = (locality || '').trim().toLowerCase();

  for (const item of curated) {
    const itemName = (item.name || '').toLowerCase();
    const itemCat = (item.category || '').toLowerCase();
    const itemLoc = (item.locality || '').toLowerCase();

    // Direct name match in same category or locality
    if (itemName === searchName && (itemCat.includes(searchCat) || itemLoc.includes(searchLoc))) {
      return { isDuplicate: true, matchedItem: item, reason: 'Exact name and category match in public directory.' };
    }

    // Geolocation proximity check (within 50 meters)
    if (
      coordinates?.latitude &&
      coordinates?.longitude &&
      item.latitude &&
      item.longitude
    ) {
      const dist = calculateDistanceMeters(
        coordinates.latitude,
        coordinates.longitude,
        item.latitude,
        item.longitude
      );
      if (dist < 50) {
        return { isDuplicate: true, matchedItem: item, reason: `Located within ${Math.round(dist)}m of existing verified listing "${item.name}".` };
      }
    }
  }

  // Also check existing published submissions in database or memory
  const publishedSubmissions = await getPublishedSubmissions();
  for (const sub of publishedSubmissions) {
    if (sub.name.toLowerCase() === searchName && sub.category.toLowerCase() === searchCat) {
      return { isDuplicate: true, matchedItem: sub, reason: 'A contribution for this facility has already been published.' };
    }
  }

  return { isDuplicate: false };
}

/**
 * Create a new submission (new place or correction)
 */
export async function createSubmission(payload, user) {
  const {
    type = 'new_place',
    targetListingId,
    targetListingName,
    name,
    category,
    description,
    locality,
    address,
    phone,
    website,
    coordinates,
    photoUrl,
    sourceUrl,
    additionalInfo,
  } = payload;

  if (!name || name.trim().length < 2) {
    const err = new Error('Place or facility name is required (at least 2 characters).');
    err.status = 400;
    throw err;
  }

  if (!category || !description || !locality || !address) {
    const err = new Error('Category, description, locality, and complete address are required.');
    err.status = 400;
    throw err;
  }

  // Check duplicate
  const duplicateCheck = await detectDuplicate({ name, category, locality, coordinates });

  // Contributor rule: Verified contributors can directly publish eligible categories
  let initialStatus = 'pending';
  const isVerifiedForCategory =
    user.role === 'verified_contributor' &&
    (user.verifiedCategories?.includes('*') ||
      user.verifiedCategories?.some((c) => c.toLowerCase() === category.toLowerCase()));

  if (isVerifiedForCategory && !duplicateCheck.isDuplicate) {
    initialStatus = 'published';
  }

  const submissionData = {
    type,
    targetListingId: targetListingId || null,
    targetListingName: targetListingName || null,
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    locality: locality.trim(),
    address: address.trim(),
    phone: phone ? phone.trim() : '',
    website: website ? website.trim() : '',
    coordinates: coordinates && coordinates.latitude ? coordinates : null,
    photoUrl: photoUrl ? photoUrl.trim() : '',
    sourceUrl: sourceUrl ? sourceUrl.trim() : '',
    additionalInfo: additionalInfo ? additionalInfo.trim() : '',
    submittedBy: {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    status: initialStatus,
    isDuplicateWarning: duplicateCheck.isDuplicate,
    moderation: initialStatus === 'published' ? {
      reviewedBy: 'Auto-Published (Verified Contributor Rule)',
      reviewedAt: new Date().toISOString(),
      notes: 'Direct publishing permission active for this category.',
    } : {},
  };

  if (isDbConnected()) {
    const created = await Submission.create(submissionData);
    return created;
  }

  // In-memory fallback
  const id = `sub-${Date.now()}`;
  const record = {
    ...submissionData,
    id,
    _id: id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemorySubmissions.set(id, record);
  return record;
}

/**
 * Get submissions belonging to a specific user
 */
export async function getUserSubmissions(userId) {
  if (isDbConnected()) {
    return Submission.find({ 'submittedBy.id': userId }).sort({ createdAt: -1 }).lean();
  }

  const list = [];
  for (const sub of inMemorySubmissions.values()) {
    if (sub.submittedBy?.id === userId) {
      list.push(sub);
    }
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get single submission by ID
 */
export async function getSubmissionById(id) {
  if (isDbConnected()) {
    return Submission.findById(id).lean();
  }
  return inMemorySubmissions.get(id) || null;
}

/**
 * Update submission (e.g. submitter providing requested additional info)
 */
export async function updateSubmission(id, updates, user) {
  const sub = await getSubmissionById(id);
  if (!sub) {
    const err = new Error('Submission not found.');
    err.status = 404;
    throw err;
  }

  // Only submitter or admin can update
  if (sub.submittedBy.id !== (user.id || user._id) && user.role !== 'admin') {
    const err = new Error('You do not have permission to modify this submission.');
    err.status = 403;
    throw err;
  }

  // If was 'needs_information', reset to 'pending' after user updates
  let newStatus = sub.status;
  if (sub.status === 'needs_information') {
    newStatus = 'pending';
  }

  const fields = {
    ...updates,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  if (isDbConnected()) {
    return Submission.findByIdAndUpdate(id, fields, { new: true }).lean();
  }

  const current = inMemorySubmissions.get(id);
  const updated = { ...current, ...fields };
  inMemorySubmissions.set(id, updated);
  return updated;
}

/**
 * Admin: Get all submissions with filtering by status and category
 */
export async function getAllSubmissionsAdmin({ status, category, page = 1, limit = 20 } = {}) {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  if (isDbConnected()) {
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;

    const [items, total] = await Promise.all([
      Submission.find(query).skip(skip).limit(safeLimit).sort({ createdAt: -1 }).lean(),
      Submission.countDocuments(query),
    ]);

    return {
      submissions: items,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit) || 1,
      },
    };
  }

  // In-memory
  let list = Array.from(inMemorySubmissions.values());

  if (status && status !== 'all') {
    list = list.filter((s) => s.status === status);
  }
  if (category && category !== 'all') {
    list = list.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = list.length;
  const paginated = list.slice(skip, skip + safeLimit);

  return {
    submissions: paginated,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
}

/**
 * Admin: Review submission (approve, reject, request info, publish, unpublish, edit)
 */
export async function reviewSubmissionAdmin(id, { action, reason = '', edits = {} }, adminUser) {
  const sub = await getSubmissionById(id);
  if (!sub) {
    const err = new Error('Submission not found.');
    err.status = 404;
    throw err;
  }

  let nextStatus = sub.status;
  switch (action) {
    case 'approve':
      nextStatus = 'approved';
      break;
    case 'publish':
      nextStatus = 'published';
      break;
    case 'reject':
      if (!reason || reason.trim().length === 0) {
        const err = new Error('A reason is required when rejecting a submission.');
        err.status = 400;
        throw err;
      }
      nextStatus = 'rejected';
      break;
    case 'request_info':
      if (!reason || reason.trim().length === 0) {
        const err = new Error('Specific information instructions are required when requesting more info.');
        err.status = 400;
        throw err;
      }
      nextStatus = 'needs_information';
      break;
    case 'unpublish':
      nextStatus = 'unpublished';
      break;
    default:
      const err = new Error(`Invalid moderation action: '${action}'. Valid actions are approve, publish, reject, request_info, unpublish.`);
      err.status = 400;
      throw err;
  }

  const updatedFields = {
    ...edits,
    status: nextStatus,
    moderation: {
      reviewedBy: adminUser.name,
      reviewedAt: new Date().toISOString(),
      feedbackReason: reason,
      notes: edits.notes || '',
    },
    updatedAt: new Date().toISOString(),
  };

  if (isDbConnected()) {
    return Submission.findByIdAndUpdate(id, updatedFields, { new: true }).lean();
  }

  const current = inMemorySubmissions.get(id);
  const updated = { ...current, ...updatedFields };
  inMemorySubmissions.set(id, updated);
  return updated;
}

/**
 * Get all approved and published submissions for incorporation into public directory
 */
export async function getPublishedSubmissions(category = '') {
  if (isDbConnected()) {
    const query = { status: 'published' };
    if (category) query.category = category;
    return Submission.find(query).lean();
  }

  const list = [];
  for (const s of inMemorySubmissions.values()) {
    if (s.status === 'published') {
      if (!category || s.category.toLowerCase().includes(category.toLowerCase())) {
        list.push(s);
      }
    }
  }
  return list;
}

export default {
  detectDuplicate,
  createSubmission,
  getUserSubmissions,
  getSubmissionById,
  updateSubmission,
  getAllSubmissionsAdmin,
  reviewSubmissionAdmin,
  getPublishedSubmissions,
};
