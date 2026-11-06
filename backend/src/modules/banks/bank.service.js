import mongoose from 'mongoose';
import BankBranch from './bank.model.js';
import { loadJsonDataset } from '../../utils/dataLoader.js';

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * Load baseline bank branch records from active JSON dataset
 */
export function getBaselineBankRecords() {
  return loadJsonDataset('banks.json');
}

/**
 * Seed verified bank branch data into MongoDB if connected and collection is empty
 */
export async function seedBankData() {
  if (!isDbConnected()) return;

  try {
    const count = await BankBranch.countDocuments();
    if (count === 0) {
      const records = getBaselineBankRecords();
      console.log('[Database] Seeding verified bank branches into MongoDB...');
      await BankBranch.insertMany(records, { ordered: false });
      console.log(`[Database] Successfully seeded bank branches.`);
    }
  } catch (error) {
    console.warn(`[Database Warning] Could not seed bank branches: ${error.message}`);
  }
}

/**
 * Retrieve bank branches with search, bank filter, locality filter, and pagination
 */
export async function getBankBranches({
  search = '',
  bank = '',
  locality = '',
  page = 1,
  limit = 10,
} = {}) {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (safePage - 1) * safeLimit;

  // 1. If database connected, query MongoDB
  if (isDbConnected()) {
    try {
      let count = await BankBranch.countDocuments();
      if (count === 0) {
        await seedBankData();
        count = await BankBranch.countDocuments();
      }

      if (count > 0) {
        const query = {};

        if (bank && bank !== 'all') {
          query.bankName = { $regex: new RegExp(`^${bank}$`, 'i') };
        }

        if (locality && locality !== 'all') {
          query.locality = { $regex: new RegExp(`^${locality}$`, 'i') };
        }

        if (search && search.trim()) {
          const regex = new RegExp(search.trim(), 'i');
          query.$or = [
            { name: regex },
            { bankName: regex },
            { branchName: regex },
            { ifsc: regex },
            { address: regex },
            { locality: regex },
          ];
        }

        const [branches, total] = await Promise.all([
          BankBranch.find(query).skip(skip).limit(safeLimit).sort({ bankName: 1, branchName: 1 }).lean(),
          BankBranch.countDocuments(query),
        ]);

        if (branches.length > 0 || search || (bank && bank !== 'all') || (locality && locality !== 'all')) {
          return {
            branches,
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
      }
    } catch (err) {
      console.warn(`[Database Fallback] Bank query failed, using memory: ${err.message}`);
    }
  }

  // 2. Stateless / In-memory Fallback from active JSON dataset
  let results = getBaselineBankRecords();

  if (bank && bank.toLowerCase() !== 'all') {
    const bLower = bank.toLowerCase();
    results = results.filter((item) => (item.bankName || item.name || '').toLowerCase().includes(bLower));
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
        (item.bankName || '').toLowerCase().includes(s) ||
        (item.branchName || '').toLowerCase().includes(s) ||
        (item.ifsc || '').toLowerCase().includes(s) ||
        (item.address || '').toLowerCase().includes(s) ||
        (item.locality || '').toLowerCase().includes(s)
    );
  }

  // Sort alphabetically by bank name then branch name
  results.sort((a, b) => {
    const bA = a.bankName || a.name || '';
    const bB = b.bankName || b.name || '';
    const cmp = bA.localeCompare(bB);
    return cmp !== 0 ? cmp : (a.branchName || '').localeCompare(b.branchName || '');
  });

  const total = results.length;
  const paginated = results.slice(skip, skip + safeLimit);

  return {
    branches: paginated,
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
 * Retrieve single bank branch by ID or IFSC
 */
export async function getBankBranchById(id) {
  if (!id) return null;

  if (isDbConnected()) {
    try {
      const branch = await BankBranch.findOne({
        $or: [
          { id },
          { ifsc: id.toUpperCase() },
          ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : []),
        ],
      }).lean();
      if (branch) return branch;
    } catch (err) {
      console.warn(`[Database Fallback] Failed to get bank by ID: ${err.message}`);
    }
  }

  const idUpper = id.toUpperCase();
  const baseline = getBaselineBankRecords();
  return (
    baseline.find(
      (item) => item.id === id || (item.ifsc && item.ifsc.toUpperCase() === idUpper)
    ) || null
  );
}

export default {
  seedBankData,
  getBankBranches,
  getBankBranchById,
  getBaselineBankRecords,
};
