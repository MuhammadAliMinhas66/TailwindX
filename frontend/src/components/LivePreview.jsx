import React, { useState, useEffect, useMemo } from 'react';
import { renderJSXComponent, validateJSXCode } from '../utils/renderComponent';

/**
 * Error Boundary Class Component
 * Catches runtime errors in rendered components
 */
class RenderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Render Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8 bg-gray-900 rounded-2xl border border-red-900/50">
          <div className="text-center">
            <div className="text-4xl mb-3 text-red-500">!</div>
            <div className="text-red-400 font-semibold mb-2">Runtime Error</div>
            <div className="text-gray-500 text-xs font-mono max-w-md break-words">
              {this.state.error?.message || 'Component failed to render'}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * LivePreview Component
 * Renders uploaded JSX code with full isolation and error handling
 */
function LivePreview({ code, className = '', showBorder = true, minHeight = '200px' }) {
  const [renderKey, setRenderKey] = useState(0);

  // Force re-render when code changes
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [code]);

  // Compile component once per code change
  const compiledComponent = useMemo(() => {
    if (!code || !code.trim()) {
      return { Component: null, error: null, validation: { valid: true } };
    }

    // Validate code first
    const validation = validateJSXCode(code);
    if (!validation.valid) {
      return { Component: null, error: null, validation };
    }

    try {
      const Component = renderJSXComponent(code);
      return { Component, error: null, validation };
    } catch (error) {
      console.error('Compilation error:', error);
      return { Component: null, error, validation };
    }
  }, [code]);

  const { Component, error, validation } = compiledComponent;

  // No code provided
  if (!code || !code.trim()) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-900 rounded-2xl ${showBorder ? 'border border-gray-800' : ''} ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-sm">No preview available</div>
        </div>
      </div>
    );
  }

  // Validation failed
  if (!validation.valid) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-900 rounded-2xl ${showBorder ? 'border border-yellow-900/50' : ''} ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3 text-yellow-500">⚠</div>
          <div className="text-yellow-400 font-semibold mb-2">Validation Error</div>
          <div className="text-gray-500 text-sm max-w-md">
            {validation.reason}
          </div>
        </div>
      </div>
    );
  }

  // Compilation error
  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-900 rounded-2xl ${showBorder ? 'border border-red-900/50' : ''} ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3 text-red-500">⚠</div>
          <div className="text-red-400 font-semibold mb-2">Compilation Error</div>
          <div className="text-gray-500 text-xs font-mono max-w-md break-words">
            {error.message}
          </div>
        </div>
      </div>
    );
  }

  // No component generated
  if (!Component) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-900 rounded-2xl ${showBorder ? 'border border-gray-800' : ''} ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">✨</div>
          <div className="text-sm">Component Preview</div>
          <div className="text-xs mt-2 text-gray-600">Unable to render</div>
        </div>
      </div>
    );
  }

  // Render the component with error boundary
  return (
    <div 
      className={`p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl ${showBorder ? 'border border-gray-800' : ''} overflow-auto ${className}`}
      style={{ minHeight }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <RenderErrorBoundary key={renderKey}>
          <React.Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-700 border-t-white mx-auto mb-2"></div>
                <div className="text-sm">Loading component...</div>
              </div>
            </div>
          }>
            <Component />
          </React.Suspense>
        </RenderErrorBoundary>
      </div>
    </div>
  );
}

export default LivePreview;