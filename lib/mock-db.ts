// This file creates a mock database connection for development without connecting to a real MongoDB instance
// This helps avoid errors when MongoDB connection is not available

import mongoose, { Connection } from 'mongoose';

// Mock data storage
const mockDataStore: Record<string, any[]> = {
  users: [],
  videos: [],
};

// Mock collection implementation
class MockCollection {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    if (!mockDataStore[collectionName]) {
      mockDataStore[collectionName] = [];
    }
  }

  // Find one document
  async findOne(query: Record<string, any>) {
    return mockDataStore[this.collectionName].find(item => 
      Object.keys(query).every(key => item[key] === query[key])
    );
  }

  // Create a new document
  async create(data: Record<string, any>) {
    const id = Math.random().toString(36).substring(2, 15);
    const timestamp = new Date();
    const newDocument = {
      _id: id,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    mockDataStore[this.collectionName].push(newDocument);
    return newDocument;
  }

  // Find all documents
  async find(query: Record<string, any> = {}) {
    if (Object.keys(query).length === 0) {
      return mockDataStore[this.collectionName];
    }
    return mockDataStore[this.collectionName].filter(item => 
      Object.keys(query).every(key => item[key] === query[key])
    );
  }
}

// Mock models for development
export const mockModels = {
  User: new MockCollection('users'),
  Video: new MockCollection('videos'),
};

// Create a minimal mock Connection object that satisfies TypeScript
export function createMockConnection(): Connection {
  // Cast our minimal implementation to Connection type
  return {
    readyState: 1, // Connected state
    db: {} as any,
    close: async () => undefined,
    // Include enough properties to satisfy TypeScript
    models: {},
    collections: {},
    config: {} as any,
    host: 'localhost',
    port: 27017,
    name: 'mock-db',
    // Add other required properties as null or empty implementations
  } as unknown as Connection;
}

// Mock database connection function
export async function connectToMockDatabase(): Promise<Connection> {
  console.log('🔄 Using mock database connection for development');
  return createMockConnection();
}

// Export a utility function to determine if we should use the mock DB
export function shouldUseMockDatabase() {
  // Check if environment indicates development or test mode
  const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  
  // Only use mock DB if we're in dev/test AND don't have a valid MongoDB URI
  const hasMongoDB = process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb');
  
  return isDevOrTest && !hasMongoDB;
} 