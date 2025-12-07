import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Folder, Calendar } from 'lucide-react';
import ComponentPreview from '../components/ComponentPreview';
import LivePreview from '../components/LivePreview';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ComponentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComponent();
  }, [id]);

  const fetchComponent = async () => {
    try {
      const res = await fetch(`${API_URL}/api/components/${id}`);
      if (!res.ok) throw new Error('Component not found');
      const data = await res.json();
      setComponent(data);
    } catch (error) {
      console.error('Failed to fetch component:', error);
      navigate('/components');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-white mb-4"></div>
          <p className="text-white text-xl font-bold">Loading component...</p>
        </div>
      </div>
    );
  }

  if (!component) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      
      {/* Hero Section */}
      <div className="relative bg-gray-950 pt-24 pb-6 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          
          <button
            onClick={() => navigate('/components')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Back to Components</span>
          </button>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
            {component.name}
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              component.type === 'template'
                ? 'bg-purple-500 text-white'
                : 'bg-blue-500 text-white'
            }`}>
              {component.type}
            </span>

            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Folder size={14} />
              <span className="font-medium capitalize">{component.category}</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400 text-sm">
              <Calendar size={14} />
              <span className="font-medium">
                {new Date(component.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {component.tags && component.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {component.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 text-xs font-medium"
                >
                  <Tag size={12} />
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - Live Preview & Description */}
          <div className="space-y-6">
            
            {/* Live Preview */}
            <div>
              <h2 className="text-2xl font-black text-white mb-4">Live Preview</h2>
              <LivePreview code={component.jsxCode} />
            </div>

            {/* Description */}
            {component.description && (
              <div>
                <h2 className="text-2xl font-black text-white mb-3">Description</h2>
                <p className="text-gray-400 text-base leading-relaxed">
                  {component.description}
                </p>
              </div>
            )}

            {/* How to Use */}
            {component.howToUse && (
              <div>
                <h2 className="text-2xl font-black text-white mb-3">How to Use</h2>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-gray-400 leading-relaxed whitespace-pre-wrap text-sm">
                    {component.howToUse}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Code */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-4">Code</h2>
              <ComponentPreview code={component.jsxCode} maxLines={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentDetailPage;