import mongoose from 'mongoose';

// Function to connect to MongoDB database
const connectDB = async () => {
  try {
    
    // Attempt to connect using connection string from env
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('MongoDB Connected Successfully');
    
  } catch (error) {
    
    // Log error and exit process if connection fails
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
    
  }
};

export default connectDB;