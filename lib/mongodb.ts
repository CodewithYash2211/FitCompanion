/**
 * MongoDB connection utility using Mongoose.
 * Uses a cached connection to avoid creating new connections
 * on every serverless function invocation.
 * Automatically falls back to mongodb-memory-server if local DB is unreachable.
 */

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitcompanion'

/** Cached connection interface */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use global to persist across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var __mongoose: MongooseCache | undefined
  // eslint-disable-next-line no-var
  var __mongod: MongoMemoryServer | undefined
}

const cached: MongooseCache = global.__mongoose ?? { conn: null, promise: null }

if (!global.__mongoose) {
  global.__mongoose = cached
}

/**
 * Connect to MongoDB using Mongoose.
 * Returns the cached connection if available.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      try {
        console.log('Attempting to connect to primary MongoDB:', MONGODB_URI)
        // Short timeout for server selection so it fails fast if not running locally
        const options: mongoose.ConnectOptions = {
          serverSelectionTimeoutMS: 2000,
          bufferCommands: false,
        }
        const m = await mongoose.connect(MONGODB_URI, options)
        console.log('Successfully connected to primary MongoDB.')
        return m
      } catch (err) {
        console.warn('Primary MongoDB unreachable. Spinning up In-Memory fallback...')
        
        try {
          if (!global.__mongod) {
            global.__mongod = await MongoMemoryServer.create()
          }
          
          const memoryUri = global.__mongod.getUri()
          console.log('Successfully connected to In-Memory MongoDB at:', memoryUri)
          
          const m = await mongoose.connect(memoryUri, {
            bufferCommands: false,
          })
          return m
        } catch (memError) {
          console.error('Failed to start In-Memory MongoDB:', memError)
          throw new Error('Database connection failed. Please ensure MongoDB is running or set MONGODB_URI.')
        }
      }
    })()
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

export default connectToDatabase
