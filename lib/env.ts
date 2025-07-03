// This file provides fallback values for environment variables when not defined
// For development purposes only - use proper environment variables in production

// Set default values for required environment variables
export const envConfig = {
  // MongoDB connection string - using mongodb+srv protocol for valid URI format
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/reelspro',
  
  // NextAuth configuration
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'this-is-a-development-secret-key-not-for-production',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // ImageKit configuration
  NEXT_PUBLIC_PUBLIC_KEY: process.env.NEXT_PUBLIC_PUBLIC_KEY || 'your_imagekit_public_key',
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY || 'your_imagekit_private_key',
  NEXT_PUBLIC_URL_ENDPOINT: process.env.NEXT_PUBLIC_URL_ENDPOINT || 'https://ik.imagekit.io/your_imagekit_id'
};

// Note: This is a development fallback. 
// In production, always set proper environment variables in your deployment platform. 