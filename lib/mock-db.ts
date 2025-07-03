// IMPORTANT: This mock database setup is for local development and testing ONLY.
// It provides a very basic in-memory simulation of Mongoose models and queries.
// Key limitations:
//    - No data persistence between server restarts.
//    - Mocked .populate() is a NO-OP and does not actually link data from different mock collections.
//    - Limited query support compared to a real MongoDB instance.
//    - Not suitable for production or comprehensive testing of complex database interactions.
// For a robust backend, production-ready database setup, or advanced mock database solutions,
// please contact contact2abhaygupta@gmail.com for professional services.

// This file creates a mock database connection for development without connecting to a real MongoDB instance
// This helps avoid errors when MongoDB connection is not available

import mongoose, { Connection } from 'mongoose';

// Mock data storage
const mockDataStore: Record<string, any[]> = {
  users: [
    {
      _id: "mockAdminUserAbhayGupta", // A unique mock ID
      email: "contact2abhaygupta@gmail.com",
      password: "Abhay@6187", // Plaintext password - FOR TESTING ONLY
      // name: "Abhay Gupta", // The IUser interface doesn't have a 'name' field. Adding if appropriate elsewhere.
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    // ... any other existing mock users would be preserved by the apply model if they exist here
  ],
  videos: [],
  comments: [], // Added for Comment model if it uses mock
};

export class MockQuery {
  private data: any[];

  constructor(data: any[]) {
    // Return a copy to prevent direct modification of mockDataStore by sort
    this.data = [...data]; 
  }

  sort(sortParams?: Record<string, 1 | -1>): MockQuery {
    if (sortParams && Object.keys(sortParams).length > 0) {
      const key = Object.keys(sortParams)[0];
      const order = sortParams[key] === -1 ? -1 : 1;

      this.data.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (valA === undefined || valA === null) return order; // or -order for different null sorting
        if (valB === undefined || valB === null) return -order;
        if (valA < valB) return -1 * order;
        if (valA > valB) return 1 * order;
        return 0;
      });
    }
    return this;
  }

  lean(): MockQuery {
    // Mock lean doesn't need to do much as data is already plain objects
    return this;
  }

  populate(path: string | any, select?: string | any): MockQuery {
    // Basic mock populate: if data is simple, this might be a no-op or require actual logic
    // For now, a no-op returning the query for chaining.
    console.log(`MockQuery: .populate called with path: ${JSON.stringify(path)}, select: ${JSON.stringify(select)} - NO-OP`);
    return this;
  }

  // Make it thenable so it can be awaited to get the data
  then<TResult1 = any[], TResult2 = never>(
    onfulfilled?: ((value: any[]) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.data).then(onfulfilled, onrejected);
  }

  // exec is also often used with Mongoose queries
  exec(): Promise<any[]> {
    return Promise.resolve(this.data);
  }
}

// Mock collection implementation
export class MockCollection {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    if (!mockDataStore[collectionName]) {
      mockDataStore[collectionName] = [];
    }
  }

  async findOne(query: Record<string, any>) {
    const result = mockDataStore[this.collectionName].find(item => 
      Object.keys(query).every(key => item[key] === query[key])
    );
    return result ? { ...result } : null; // Return a copy or null
  }

  async findById(id: string | number) { // Common Mongoose method
    const result = mockDataStore[this.collectionName].find(item => item._id === id);
    return result ? { ...result } : null; // Return a copy or null
  }

  async create(data: Record<string, any>) {
    const id = Math.random().toString(36).substring(2, 15); // Simple mock ID
    const timestamp = new Date();
    const newDocument = {
      _id: id,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    mockDataStore[this.collectionName].push(newDocument);
    return { ...newDocument }; // Return a copy
  }

  find(query: Record<string, any> = {}): MockQuery {
    let resultData: any[];
    if (Object.keys(query).length === 0) {
      resultData = mockDataStore[this.collectionName];
    } else {
      resultData = mockDataStore[this.collectionName].filter(item => 
        Object.keys(query).every(key => {
            if (query[key] && typeof query[key] === 'object' && query[key].$in !== undefined) {
                return query[key].$in.includes(item[key]);
            }
            return item[key] === query[key];
        })
      );
    }
    return new MockQuery(resultData);
  }

  async findByIdAndUpdate(id: string, update: Record<string, any>, options?: Record<string, any>) {
    const itemIndex = mockDataStore[this.collectionName].findIndex(item => item._id === id);
    if (itemIndex === -1) {
      return null;
    }
    const updatedItem = { 
        ...mockDataStore[this.collectionName][itemIndex], 
        ...update, 
        updatedAt: new Date() 
    };
    mockDataStore[this.collectionName][itemIndex] = updatedItem;
    return options && options.new ? { ...updatedItem } : { ...mockDataStore[this.collectionName][itemIndex] }; // Return copy
  }
  
  // Add other Mongoose static model methods as needed by your app for the mock
  // e.g., countDocuments, deleteOne, updateOne, etc.
}

// Mock models for development
export const mockModels = {
  User: new MockCollection('users'),
  Video: new MockCollection('videos'),
  Comment: new MockCollection('comments'), // Added for Comment model
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
  // const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  
  // Only use mock DB if we're in dev/test AND don't have a valid MongoDB URI
  // const hasMongoDB = process.env.MONGODB_URI && process.env.MONGODB_URI.startsWith('mongodb');
  
  // return isDevOrTest && !hasMongoDB;
  // return false; // Previous state: Force disable mock database
  return true; // Force enable mock database. For production, this MUST be false and rely on real DB.
} 