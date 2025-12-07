import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Shuffle from '../components/Shuffle';
import { convertToBase64, validateImage } from '../utils/imageUpload';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AdminPanel() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [components, setComponents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    tags: '',
    jsxCode: '',
    previewImage: '',
    description: '',
    howToUse: '',
    type: 'component'
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
    
    // Check for unauthorized error in URL
    const error = searchParams.get('error');
    if (error === 'unauthorized') {
      setUnauthorized(true);
    }
  }, [searchParams]);

  // Fetch components when authenticated
  useEffect(() => {
    if (user) {
      fetchComponents();
    }
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/status`, {
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.authenticated) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = `${API_URL}/api/auth/login`;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setComponents([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchComponents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/components`);
      const data = await res.json();
      setComponents(data);
    } catch (error) {
      console.error('Failed to fetch components:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateImage(file);
      const base64 = await convertToBase64(file);
      setFormData({ ...formData, previewImage: base64 });
      setImagePreview(base64);
      setUploadError('');
    } catch (error) {
      setUploadError(error.message);
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate image is uploaded
    if (!formData.previewImage) {
      setUploadError('Preview image is required');
      return;
    }
    
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      const url = editingId 
        ? `${API_URL}/api/components/${editingId}`
        : `${API_URL}/api/components`;
      
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchComponents();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save component:', error);
    }
  };

  const handleEdit = (component) => {
    setFormData({
      name: component.name,
      category: component.category,
      tags: component.tags.join(', '),
      jsxCode: component.jsxCode,
      previewImage: component.previewImage,
      description: component.description || '',
      howToUse: component.howToUse || '',
      type: component.type || 'component'
    });
    setImagePreview(component.previewImage);
    setEditingId(component._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this component?')) return;

    try {
      const res = await fetch(`${API_URL}/api/components/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        fetchComponents();
      }
    } catch (error) {
      console.error('Failed to delete component:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      tags: '',
      jsxCode: '',
      previewImage: '',
      description: '',
      howToUse: '',
      type: 'component'
    });
    setImagePreview('');
    setUploadError('');
    setEditingId(null);
    setShowForm(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!user) {
    // Show unauthorized message if user tried to login but failed
    if (unauthorized) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center overflow-hidden relative">
          
          {/* Glitch background effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]"></div>
          
          <div className="text-center relative z-10 px-6">
            
            {/* Animated Shuffle Text */}
            <Shuffle
              text="UNAUTHORIZED"
              className="text-red-500 mb-8"
              shuffleDirection="right"
              duration={0.5}
              shuffleTimes={3}
              animationMode="evenodd"
              stagger={0.05}
              scrambleCharset="@#$%&*!?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
              colorFrom="#ef4444"
              colorTo="#dc2626"
              triggerOnce={false}
              loop={false}
              style={{ fontSize: '5rem', fontWeight: 900 }}
            />
            
            <div className="space-y-4">
              <p className="text-2xl text-gray-400 font-bold">ACCESS DENIED</p>
              <p className="text-lg text-gray-500">You are not authorized to access this panel</p>
              <p className="text-base text-gray-600">HAHAHAHA</p>
            </div>
            
            <button
              onClick={() => window.location.href = '/'}
              className="mt-12 px-8 py-4 bg-gray-900 text-white border-2 border-gray-800 rounded-lg hover:bg-gray-800 transition font-semibold text-lg"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    
    // Show normal login screen
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black text-white mb-6">Admin Login</h1>
          <p className="text-gray-400 mb-8">Sign in with Auth0 to manage components</p>
          <button
            onClick={handleLogin}
            className="px-8 py-4 bg-white text-gray-950 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
          >
            Login with Auth0
          </button>
        </div>
      </div>
    );
  }

  // Authenticated - show admin dashboard
  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome, {user.displayName}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-950 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              <Plus size={20} />
              Add Component
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gray-900 text-white border border-gray-800 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Component Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-4xl w-full my-8">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-900 z-10 pb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {editingId ? 'Edit Component' : 'Add Component'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                
                {/* Type Selection */}
                <div>
                  <label className="block text-white font-semibold mb-2">Type</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'component'})}
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                        formData.type === 'component'
                          ? 'bg-white text-gray-950'
                          : 'bg-gray-950 text-gray-400 border border-gray-800'
                      }`}
                    >
                      Component
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'template'})}
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition ${
                        formData.type === 'template'
                          ? 'bg-white text-gray-950'
                          : 'bg-gray-950 text-gray-400 border border-gray-800'
                      }`}
                    >
                      Template
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-white font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                    placeholder="e.g. Buttons, Cards, Forms"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white font-semibold mb-2">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                    placeholder="Comma-separated: modern, animated, dark"
                  />
                </div>

                {/* Preview Image Upload */}
                <div>
                  <label className="block text-white font-semibold mb-2">Preview Image</label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-950 border-2 border-dashed border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition">
                      <Upload size={20} className="text-gray-400" />
                      <span className="text-gray-400 font-medium">Upload Screenshot</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {uploadError && (
                    <p className="text-red-400 text-sm mt-2">{uploadError}</p>
                  )}
                  
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData({...formData, previewImage: ''});
                        }}
                        className="absolute top-2 right-2 p-2 bg-gray-950/90 text-white rounded-lg hover:bg-gray-900"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                    rows={3}
                    placeholder="Brief description of the component..."
                  />
                </div>

                {/* How to Use */}
                <div>
                  <label className="block text-white font-semibold mb-2">How to Use</label>
                  <textarea
                    value={formData.howToUse}
                    onChange={(e) => setFormData({...formData, howToUse: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
                    rows={4}
                    placeholder="Instructions on how to use this component..."
                  />
                </div>

                {/* JSX Code */}
                <div>
                  <label className="block text-white font-semibold mb-2">JSX Code</label>
                  <textarea
                    value={formData.jsxCode}
                    onChange={(e) => setFormData({...formData, jsxCode: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700 font-mono text-sm"
                    rows={12}
                    placeholder="Paste your JSX code with Tailwind classes here..."
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-gray-900 pt-6 pb-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-white text-gray-950 rounded-lg hover:bg-gray-100 transition font-semibold"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        )}

        {/* Components Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-950">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Preview</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Tags</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Created</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {components.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No components yet. Add your first one!
                    </td>
                  </tr>
                ) : (
                  components.map((component) => (
                    <tr key={component._id} className="border-t border-gray-800 hover:bg-gray-950/50">
                      <td className="px-6 py-4">
                        <img
                          src={component.previewImage}
                          alt={component.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-800"
                        />
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{component.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          component.type === 'template'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {component.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{component.category}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {component.tags.slice(0, 2).join(', ')}
                        {component.tags.length > 2 && '...'}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(component.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(component)}
                            className="p-2 text-gray-400 hover:text-white transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(component._id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;