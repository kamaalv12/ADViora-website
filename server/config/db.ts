import mongoose from 'mongoose';

// Ensure all models are registered before any query execution
import '@/server/models';

export function getDatabaseNameFromUri(uri: string): string {
  const match = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/);
  if (!match || !match[1] || match[1].trim().length === 0) {
    throw new Error('MONGODB_URI must specify an explicit database path (e.g. mongodb+srv://.../<dbname>?...)');
  }
  return match[1].trim();
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Enforce explicit database path in connection URI
  getDatabaseNameFromUri(uri);

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).catch((err) => {
      // Reset rejected cached promise so subsequent requests can recover
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectToDatabase;
