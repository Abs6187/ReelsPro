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
    // Return mock database connection if we should use the mock DB
    if (shouldUseMockDatabase()) {
        console.log("Using mock database for development");
        cached.conn = await connectToMockDatabase();
        return cached.conn;
    }

    if(!MONGODB_URI){
        console.warn('MONGODB_URI is not defined, using mock database');
        cached.conn = await connectToMockDatabase();
        return cached.conn;
    }

    // Use real database connection
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
       const opts = {
         bufferCommands: true,
         maxPoolSize: 10
       } 
       
       cached.promise = mongoose.connect(MONGODB_URI, opts)
           .then(() => mongoose.connection)
           .catch(err => {
               console.error("MongoDB connection error:", err);
               console.log("Falling back to mock database");
               return connectToMockDatabase();
           });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.log(error);
        console.log("Falling back to mock database due to error");
        cached.conn = await connectToMockDatabase();
    }

    return cached.conn;
}
