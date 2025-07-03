import mongoose from "mongoose";
import { envConfig } from "./env";
import { connectToMockDatabase, shouldUseMockDatabase } from "./mock-db";

// Using the environment variable with correct name and fallback from envConfig
const MONGODB_URI = process.env.MONGODB_URI || envConfig.MONGODB_URI;

// Initialize cached connection
let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
}

export async function connectToDatabase(){
    // If shouldUseMockDatabase() is true (now forced), use the mock database.
    if (shouldUseMockDatabase()) {
        console.log("connectToDatabase: shouldUseMockDatabase is true. Using mock database connection.");
        // Ensure mock connection is established and cached if needed, or just return it.
        // Depending on connectToMockDatabase's idempotency, direct call might be fine.
        cached.conn = await connectToMockDatabase(); 
        return cached.conn;
    }

    // Original logic for real database connection if mock is not used (shouldUseMockDatabase is false)
    if(!MONGODB_URI){
        // If MONGODB_URI is not set, it's a fatal configuration error.
        console.error('FATAL ERROR: MONGODB_URI is not defined. Application cannot start without a database URI.');
        throw new Error('MONGODB_URI is not defined. Please set it in your environment variables.');
    }

    if(cached.conn){ // Check if already connected (real DB connection)
        // If the existing connection is from a previous real attempt and not mock
        // This check might need refinement if cached.conn could be a mock conn from a different flow
        // However, given the top check, if we reach here, shouldUseMockDatabase() was false.
        return cached.conn;
    }

    if(!cached.promise){
       const opts = {
         bufferCommands: true, // Mongoose default is true, explicitly set
         maxPoolSize: 10 // Example pool size
       } 
       
       console.log("Attempting to connect to REAL MongoDB...");
       cached.promise = mongoose.connect(MONGODB_URI, opts)
           .then(mongooseInstance => {
               console.log("REAL MongoDB connected successfully!");
               return mongooseInstance.connection;
            })
           .catch(err => {
               console.error("REAL MongoDB connection error during initial connection:", err);
               // Do not fall back to mock database. Let the error propagate or handle appropriately.
               cached.promise = null; // Reset promise on error
               throw err; // Re-throw the error to indicate connection failure
           });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // This catch block might be redundant if the .catch above re-throws,
        // but kept for safety to ensure promise is nulled.
        cached.promise = null;
        console.error("Failed to resolve REAL MongoDB connection promise:", error);
        // Do not fall back to mock database.
        throw error; // Re-throw error
    }

    return cached.conn;
}
