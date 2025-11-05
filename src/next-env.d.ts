/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is required for Next.js type definitions
// It ensures TypeScript understands Next.js specific types and modules

// Add type definitions for Node.js
namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_RAZORPAY_KEY_ID: string;
    // Add other environment variables here
  }
}

// Add type definitions for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}
