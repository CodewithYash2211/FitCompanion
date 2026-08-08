import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var __mongoose: MongooseCache | undefined
}

const cached: MongooseCache =
  global.__mongoose ?? {
    conn: null,
    promise: null,
  }

if (!global.__mongoose) {
  global.__mongoose = cached
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 15000,
        bufferCommands: false,
      })
      .then((m) => {
        console.log('Successfully connected to MongoDB Atlas')
        return m
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error)
        cached.promise = null
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectToDatabase