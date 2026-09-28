import mongoose from 'mongoose';

// Ensure all models are registered before any query execution
import '@/server/models';

/**
 * Strips accidental wrapping quotes (single or double) and trims whitespace.
 * Prevents MongoParseError ("Invalid scheme") if the URI in Vercel or .env has quotes.
 */
export function cleanMongoUri(rawUri: string): string {
  let cleaned = rawUri.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

export function getDatabaseNameFromUri(rawUri: string): string {
  const uri = cleanMongoUri(rawUri);
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
  const rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  const uri = cleanMongoUri(rawUri);

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
