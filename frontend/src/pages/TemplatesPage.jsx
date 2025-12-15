import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LivePreview from '../components/LivePreview';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// =============== PIXEL CARD COMPONENT ===============
class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value, reducedMotion) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  const parsed = parseInt(value, 10);

  if (parsed <= min || reducedMotion) {
    return min;
  } else if (parsed >= max) {
    return max * throttle;
  } else {
    return parsed * throttle;
  }
}

const VARIANTS = {
  default: {
    gap: 5,
    speed: 35,
    colors: '#1f2937,#374151,#4b5563',
    noFocus: false
  }
};

function PixelCard({ variant = 'default', gap, speed, colors, noFocus, className = '', children, onMouseEnter, onMouseLeave }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(null);
  const timePreviousRef = useRef(null);
  const reducedMotionRef = useRef(null);

  const variantCfg = VARIANTS[variant] || VARIANTS.default;
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;
  const finalNoFocus = noFocus ?? variantCfg.noFocus;

  useEffect(() => {
    if (timePreviousRef.current === null) {
      timePreviousRef.current = performance.now();
    }
    if (reducedMotionRef.current === null) {
      reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  const initPixels = () => {
    if (!containerRef.current || !canvasRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    const ctx = canvasRef.current.getContext('2d');

    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    const colorsArray = finalColors.split(',');
    const pxs = [];
    const reducedMotion = reducedMotionRef.current || false;
    
    for (let x = 0; x < width; x += parseInt(finalGap, 10)) {
      for (let y = 0; y < height; y += parseInt(finalGap, 10)) {
        const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];

        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotion ? 0 : distance;

        pxs.push(new Pixel(canvasRef.current, ctx, x, y, color, getEffectiveSpeed(finalSpeed, reducedMotion), delay));
      }
    }
    pixelsRef.current = pxs;
  };

  const doAnimate = fnName => {
    animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
    
    if (timePreviousRef.current === null) {
      timePreviousRef.current = performance.now();
    }
    
    const timeNow = performance.now();
    const timePassed = timeNow - timePreviousRef.current;
    const timeInterval = 1000 / 60;

    if (timePassed < timeInterval) return;
    timePreviousRef.current = timeNow - (timePassed % timeInterval);

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let allIdle = true;
    for (let i = 0; i < pixelsRef.current.length; i++) {
      const pixel = pixelsRef.current[i];
      pixel[fnName]();
      if (!pixel.isIdle) {
        allIdle = false;
      }
    }
    if (allIdle) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleAnimation = name => {
    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => doAnimate(name));
  };

  const handleMouseEnter = () => {
    handleAnimation('appear');
    if (onMouseEnter) onMouseEnter();
  };
  
  const handleMouseLeave = () => {
    handleAnimation('disappear');
    if (onMouseLeave) onMouseLeave();
  };

  const onFocus = e => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation('appear');
  };
  const onBlur = e => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    handleAnimation('disappear');
  };

  useEffect(() => {
    initPixels();
    const observer = new ResizeObserver(() => {
      initPixels();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [finalGap, finalSpeed, finalColors, finalNoFocus]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden grid place-items-center border border-gray-800 rounded-3xl isolate transition-all duration-300 ease-out select-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={finalNoFocus ? undefined : onFocus}
      onBlur={finalNoFocus ? undefined : onBlur}
      tabIndex={finalNoFocus ? -1 : 0}
    >
      <canvas className="w-full h-full block absolute inset-0 pointer-events-none" ref={canvasRef} />
      {children}
    </div>
  );
}

// =============== SHUFFLE TEXT COMPONENT ===============
function ShuffleText({ text, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !text) return;

    const chars = text.split('');
    ref.current.innerHTML = '';
    
    const spans = [];
    chars.forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'inline-block';
      span.style.opacity = '0';
      ref.current.appendChild(span);
      spans.push(span);
    });

    spans.forEach((span, i) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
      let iterations = 0;
      const maxIterations = 10;

      const interval = setInterval(() => {
        span.textContent = chars[Math.floor(Math.random() * chars.length)];
        span.style.opacity = '1';
        
        if (iterations >= maxIterations) {
          clearInterval(interval);
          span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        }
        
        iterations++;
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
        span.style.opacity = '1';
      }, 50 * maxIterations + i * 30);
    });

  }, [text]);

  return <h1 ref={ref} className={className}></h1>;
}

// =============== TEMPLATE CARD WITH LIVE PREVIEW ===============
function TemplateCard({ template, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group"
      style={{ 
        animation: `fadeInUp 0.6s ease-out forwards`,
        animationDelay: `${index * 0.1}s`,
        opacity: 0
      }}
    >
      <Link to={`/component/${template._id}`}>
        <PixelCard 
          className="w-full aspect-[4/5] cursor-pointer hover:border-gray-700 hover:shadow-xl hover:shadow-purple-500/10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative z-10 w-full h-full flex flex-col p-6">
            
            {/* Live Preview - Centered */}
            <div className="flex-1 flex items-center justify-center mb-4 overflow-hidden rounded-2xl">
              <LivePreview 
                code={template.jsxCode} 
                showBorder={false}
                minHeight="auto"
                className="w-full h-full scale-75"
              />
            </div>

            {/* Template Info */}
            <div className="relative z-10 bg-gray-950/80 backdrop-blur-md rounded-2xl p-4 border border-gray-800/50">
              
              {/* Type Badge */}
              <div className="absolute -top-3 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold shadow-lg bg-purple-500 text-white">
                  Template
                </span>
              </div>

              {/* Template Name */}
              <h3 
                className="text-white font-black text-xl mb-2 mt-2 transition-colors duration-300"
                style={{
                  color: isHovered ? '#a78bfa' : '#ffffff'
                }}
              >
                {template.name}
              </h3>
              
              {/* Category */}
              <p className="text-gray-400 text-sm font-medium mb-3 capitalize">
                {template.category}
              </p>
              
              {/* Tags */}
              {template.tags && template.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {template.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-900/70 text-gray-400 text-xs rounded-lg font-medium border border-gray-800/50"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-900/70 text-gray-500 text-xs rounded-lg font-medium">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </PixelCard>
      </Link>
    </div>
  );
}

// =============== MAIN TEMPLATES PAGE ===============
function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/components`);
      const data = await res.json();
      
      // Filter only templates
      const templatesOnly = data.filter(item => item.type === 'template');
      
      console.log('Fetched templates:', templatesOnly);
      setTemplates(templatesOnly);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-purple-500 mb-4"></div>
          <p className="text-white text-xl font-bold">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      
      {/* Hero Section */}
      <div className="relative bg-gray-950 pt-24 pb-8 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center">
            <ShuffleText 
              text="TEMPLATES" 
              className="text-6xl md:text-7xl font-black text-white tracking-tight uppercase"
            />
            <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
              Full-page templates ready to use in your projects
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto px-6 py-12">
        {templates.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-500 text-2xl font-bold">No templates yet</p>
            <p className="text-gray-600 mt-2">Check back soon for amazing templates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {templates.map((template, index) => (
              <TemplateCard key={template._id} template={template} index={index} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default TemplatesPage;