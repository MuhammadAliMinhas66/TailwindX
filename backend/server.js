// Load environment variables FIRST
import './loadEnv.js';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

// Import passport configuration AFTER env is loaded
import './config/passport.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import componentRoutes from './routes/componentRoutes.js';

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'TailwindX API is running!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});