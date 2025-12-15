import express from 'express';
import Component from '../models/Component.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all components with optional filters (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const { category, search, type } = req.query;
    
    // Build query object
    let query = {};
    
    // Filter by type if provided (component or template)
    if (type) {
      query.type = type;
    }
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Search by name or tags if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Fetch components sorted by newest first
    const components = await Component.find(query).sort({ createdAt: -1 });
    
    res.json(components);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

// Get single component by ID (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    res.json(component);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch component' });
  }
});

// Create new component (ADMIN ONLY)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { name, category, tags, jsxCode, previewImage, type, description, howToUse } = req.body;
    
    // Validate required fields
    if (!name || !category || !jsxCode) {
      return res.status(400).json({ 
        error: 'Name, category, and JSX code are required' 
      });
    }
    
    // Create new component with all fields
    const component = await Component.create({
      name,
      category,
      tags: tags || [],
      jsxCode,
      previewImage: previewImage || '',
      type: type || 'component', // Default to 'component' if not provided
      description: description || '',
      howToUse: howToUse || ''
    });
    
    res.status(201).json(component);
    
  } catch (error) {
    console.error('Create component error:', error);
    res.status(500).json({ error: 'Failed to create component' });
  }
});

// Update component (ADMIN ONLY)
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, category, tags, jsxCode, previewImage, type, description, howToUse } = req.body;
    
    // Build update object with all fields
    const updateData = {
      name,
      category,
      tags,
      jsxCode,
      previewImage,
      type,
      description,
      howToUse
    };
    
    // Find and update component
    const component = await Component.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    res.json(component);
    
  } catch (error) {
    console.error('Update component error:', error);
    res.status(500).json({ error: 'Failed to update component' });
  }
});

// Delete component (ADMIN ONLY)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const component = await Component.findByIdAndDelete(req.params.id);
    
    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }
    
    res.json({ message: 'Component deleted successfully' });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete component' });
  }
});

export default router;