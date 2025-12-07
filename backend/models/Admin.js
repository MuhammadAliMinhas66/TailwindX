import mongoose from 'mongoose';

// Define the schema for admin users
const AdminSchema = new mongoose.Schema({
  
  // Admin email from OAuth provider
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // OAuth provider name like google or github
  provider: {
    type: String,
    required: true
  },
  
  // Unique ID from OAuth provider
  providerId: {
    type: String,
    required: true
  },
  
  // Admin display name
  displayName: {
    type: String,
    required: true
  },
  
  // Profile picture URL from OAuth
  profilePicture: {
    type: String,
    default: ''
  },
  
  // Timestamp when admin was created
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

// Create and export the model
const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;