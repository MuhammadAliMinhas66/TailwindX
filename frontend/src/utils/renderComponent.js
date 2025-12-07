import * as React from 'react';

export const renderJSXComponent = (jsxCode) => {
  try {
    // Remove imports
    let cleanCode = jsxCode
      .replace(/import\s+.*?from\s+['"].*?['"]\s*;?\s*/g, '')
      .replace(/export\s+(default\s+)?/g, '')
      .trim();

    // Check if it's pure JSX (starts with <)
    if (cleanCode.startsWith('<')) {
      // Create a simple functional component that returns the JSX
      const ComponentFunction = new Function('React', `
        const { useState, useEffect, useRef, Fragment } = React;
        return function DynamicComponent() {
          return (${cleanCode});
        };
      `);
      return ComponentFunction(React);
    }

    // If it's a function component
    if (cleanCode.includes('function') || cleanCode.includes('=>')) {
      // Extract just the JSX return part
      const returnMatch = cleanCode.match(/return\s*\(([\s\S]*)\)\s*[;}]?\s*$/);
      if (returnMatch) {
        const jsxContent = returnMatch[1].trim();
        const ComponentFunction = new Function('React', `
          const { useState, useEffect, useRef, Fragment } = React;
          return function DynamicComponent() {
            return (${jsxContent});
          };
        `);
        return ComponentFunction(React);
      }
    }

    return null;

  } catch (error) {
    console.error('Failed to render component:', error);
    return null;
  }
};