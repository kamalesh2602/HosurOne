import mongoose from 'mongoose';
import config from './env.js';

let isConnected = false;

/**
 * Connect to MongoDB using Mongoose.
 * Non-blocking: if MONGODB_URI is empty or the database is unavailable,
 * logs the status and allows other non-database routes (such as weather and health) to function normally.
 */
export async function connectDB() {
  if (!config.mongodbUri || config.mongodbUri.trim() === '') {
    console.info('[Database] MONGODB_URI is not configured. Running in stateless mode (Database-independent routes active).');
    return null;
  }

  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.info(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    isConnected = false;
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    console.info('[Database] Continuing application startup without MongoDB. Weather and public information APIs remain available.');
    return null;
  }
}

/**
 * Check current database status for health endpoints
 */
export function getDbStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  if (!config.mongodbUri) {
    return { configured: false, status: 'unconfigured' };
  }

  const readyState = mongoose.connection.readyState;
  return {
    configured: true,
    status: states[readyState] || 'unknown',
  };
}

export default { connectDB, getDbStatus };

