import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config/env.js';
import User from './user.model.js';

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// In-memory fallback user store when MongoDB is not connected
const inMemoryUsers = new Map();

// Helper to seed demo accounts in memory
async function initInMemoryUsers() {
  if (inMemoryUsers.size > 0) return;

  const adminHash = await bcrypt.hash('Admin@HosurOne2026', 10);
  const contributorHash = await bcrypt.hash('Contributor@2026', 10);
  const memberHash = await bcrypt.hash('Member@HosurOne2026', 10);

  inMemoryUsers.set('admin@hosurone.in', {
    id: 'user-admin-01',
    _id: 'user-admin-01',
    name: 'HosurOne Civic Administrator',
    email: 'admin@hosurone.in',
    passwordHash: adminHash,
    role: 'admin',
    verifiedCategories: ['*'],
    status: 'active',
    locality: 'Hosur City',
    createdAt: new Date().toISOString(),
  });

  inMemoryUsers.set('contributor@hosurone.in', {
    id: 'user-contributor-01',
    _id: 'user-contributor-01',
    name: 'K. Senthil (Verified Local Volunteer)',
    email: 'contributor@hosurone.in',
    passwordHash: contributorHash,
    role: 'verified_contributor',
    verifiedCategories: ['Parks & Lakes', 'Religious Place', 'Hospitals & Clinics', 'ATMs'],
    status: 'active',
    locality: 'Hosur City',
    createdAt: new Date().toISOString(),
  });

  inMemoryUsers.set('member@hosurone.in', {
    id: 'user-member-01',
    _id: 'user-member-01',
    name: 'Priya Narayanan',
    email: 'member@hosurone.in',
    passwordHash: memberHash,
    role: 'member',
    verifiedCategories: [],
    status: 'active',
    locality: 'Bagalur',
    createdAt: new Date().toISOString(),
  });
}

// Ensure in-memory demo accounts exist
initInMemoryUsers();

/**
 * Generate a signed JWT token
 */
export function generateToken(user) {
  const payload = {
    id: user.id || user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

/**
 * Register a new member
 */
export async function registerUser({ name, email, password, locality = 'Hosur City' }) {
  if (!name || name.trim().length < 2) {
    const err = new Error('Name must be at least 2 characters long.');
    err.status = 400;
    throw err;
  }

  const normalizedEmail = (email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    const err = new Error('Please provide a valid email address.');
    err.status = 400;
    throw err;
  }

  if (!password || password.length < 8) {
    const err = new Error('Password must be at least 8 characters long.');
    err.status = 400;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (isDbConnected()) {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      const err = new Error('An account with this email address already exists.');
      err.status = 409;
      throw err;
    }

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'member',
      verifiedCategories: [],
      status: 'active',
      locality: locality.trim(),
    });

    const token = generateToken(newUser);
    return { user: newUser.toJSON(), token };
  }

  // In-memory fallback
  if (inMemoryUsers.has(normalizedEmail)) {
    const err = new Error('An account with this email address already exists.');
    err.status = 409;
    throw err;
  }

  const userObj = {
    id: `user-${Date.now()}`,
    _id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'member',
    verifiedCategories: [],
    status: 'active',
    locality: locality.trim(),
    createdAt: new Date().toISOString(),
  };

  inMemoryUsers.set(normalizedEmail, userObj);

  const token = generateToken(userObj);
  const { passwordHash: _, ...userSafe } = userObj;
  return { user: userSafe, token };
}

/**
 * Login user
 */
export async function loginUser({ email, password }) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail || !password) {
    const err = new Error('Email and password are required.');
    err.status = 400;
    throw err;
  }

  let user = null;

  if (isDbConnected()) {
    user = await User.findOne({ email: normalizedEmail });
  } else {
    user = inMemoryUsers.get(normalizedEmail);
  }

  if (!user) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  if (user.status === 'suspended') {
    const err = new Error('This account has been suspended by an administrator.');
    err.status = 403;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const token = generateToken(user);
  const userSafe = typeof user.toJSON === 'function' ? user.toJSON() : (({ passwordHash: _, ...rest }) => rest)(user);

  return { user: userSafe, token };
}

/**
 * Get user by ID
 */
export async function getUserById(id) {
  if (isDbConnected()) {
    const user = await User.findById(id);
    return user ? user.toJSON() : null;
  }

  for (const u of inMemoryUsers.values()) {
    if (u.id === id || u._id === id) {
      const { passwordHash: _, ...safe } = u;
      return safe;
    }
  }

  return null;
}

/**
 * Update user verification / role (Admin only)
 */
export async function updateUserVerification(userId, { isVerified, categories = [] }) {
  const newRole = isVerified ? 'verified_contributor' : 'member';

  if (isDbConnected()) {
    const updated = await User.findByIdAndUpdate(
      userId,
      {
        role: newRole,
        verifiedCategories: categories,
      },
      { new: true }
    );
    if (!updated) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }
    return updated.toJSON();
  }

  for (const [email, u] of inMemoryUsers.entries()) {
    if (u.id === userId || u._id === userId) {
      u.role = newRole;
      u.verifiedCategories = categories;
      inMemoryUsers.set(email, u);
      const { passwordHash: _, ...safe } = u;
      return safe;
    }
  }

  const err = new Error('User not found.');
  err.status = 404;
  throw err;
}

/**
 * Update user status (active / suspended) (Admin only)
 */
export async function updateUserStatus(userId, status) {
  if (!['active', 'suspended'].includes(status)) {
    const err = new Error("Status must be 'active' or 'suspended'.");
    err.status = 400;
    throw err;
  }

  if (isDbConnected()) {
    const updated = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!updated) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }
    return updated.toJSON();
  }

  for (const [email, u] of inMemoryUsers.entries()) {
    if (u.id === userId || u._id === userId) {
      u.status = status;
      inMemoryUsers.set(email, u);
      const { passwordHash: _, ...safe } = u;
      return safe;
    }
  }

  const err = new Error('User not found.');
  err.status = 404;
  throw err;
}

export default {
  registerUser,
  loginUser,
  getUserById,
  updateUserVerification,
  updateUserStatus,
  generateToken,
  verifyToken,
};

