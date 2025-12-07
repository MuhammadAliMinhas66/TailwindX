import dotenv from 'dotenv';

// Load environment variables immediately
dotenv.config();

// Log to verify (remove after testing)
console.log('Environment variables loaded:');
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN);
console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? 'Set' : 'Missing');
console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'Set' : 'Missing');