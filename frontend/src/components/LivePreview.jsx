import React, { useMemo, Suspense } from 'react';
import { renderJSXComponent } from '../utils/renderComponent';

function LivePreview({ code, className = '' }) {
  // Compile/render the user code once per `code` change. Keep compile errors
  // out of the render path to satisfy lint rules and avoid recreating
  // components during render. Call hooks unconditionally.
  const { Component, compileError } = useMemo(() => {
    if (!code || !code.trim()) return { Component: null, compileError: null };
    try {
      const Comp = renderJSXComponent(code);
      return { Component: Comp, compileError: null };
    } catch (e) {
      console.error('LivePreview compile error:', e);
      return { Component: null, compileError: e };
    }
  }, [code]);

  // If no code, show placeholder
  if (!code || !code.trim()) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-900 rounded-2xl border border-gray-800 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📦</div>
          <div className="text-sm">No preview available</div>
        </div>
      </div>
    );
  }

  if (compileError) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-900 rounded-2xl border border-gray-800 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">⚠️</div>
          <div className="text-sm">Preview Error</div>
          <div className="text-xs mt-2 text-gray-600">{compileError.message}</div>
        </div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className={`flex items-center justify-center p-8 bg-gray-900 rounded-2xl border border-gray-800 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">✨</div>
          <div className="text-sm">Component Preview</div>
          <div className="text-xs mt-2 text-gray-600">Click to view code</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-8 bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-auto ${className}`}>
      <div className="flex items-center justify-center min-h-[200px]">
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
          <Component />
        </Suspense>
      </div>
    </div>
  );
}

export default LivePreview;