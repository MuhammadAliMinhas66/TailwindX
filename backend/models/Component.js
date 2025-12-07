import mongoose from 'mongoose';

// Define the schema for components
const ComponentSchema = new mongoose.Schema({
  
  // Component name
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Component category like Buttons, Cards, Navbars
  category: {
    type: String,
    required: true,
    trim: true
  },
  
  // Array of tags for filtering
  tags: [{
    type: String,
    trim: true
  }],
  
  // JSX code with Tailwind classes only
  jsxCode: {
    type: String,
    required: true
  },
  
  // Preview image (base64 or URL)
  previewImage: {
    type: String,
    required: true
  },
  
  // Description of component
  description: {
    type: String,
    default: ''
  },
  
  // How to use instructions
  howToUse: {
    type: String,
    default: ''
  },
  
  // Type: component or template
  type: {
    type: String,
    enum: ['component', 'template'],
    default: 'component'
  },
  
  // Timestamp when component was created
  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

// Create and export the model
const Component = mongoose.model('Component', ComponentSchema);

export default Component;