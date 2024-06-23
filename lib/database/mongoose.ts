import mongoose, { Mongoose } from 'mongoose';

// Get the MongoDB URL from environment variables
const MONGODB_URL = process.env.MONGODB_URL;

// Define an interface for the mongoose connection
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Check if there's a cached mongoose connection in the global scope
let cached: MongooseConnection = (global as any).mongoose

// If no cached connection exists, create an empty cache object
if(!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  }
}

// Function to connect to the database
export const connectToDatabase = async () => {
  // If a connection already exists, return it
  if(cached.conn) return cached.conn;

  // Throw an error if MONGODB_URL is not defined
  if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  // If no existing promise, create a new connection promise
  // If a promise exists, use the existing one
  cached.promise = 
    cached.promise || 
    mongoose.connect(MONGODB_URL, { 
      dbName: 'imaginify', bufferCommands: false 
    })

  // Wait for the connection to be established
  cached.conn = await cached.promise;

  // Return the established connection
  return cached.conn;
}