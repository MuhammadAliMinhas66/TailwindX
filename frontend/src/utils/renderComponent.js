import * as React from 'react';

/**
 * Enhanced JSX Component Renderer
 * Safely renders user-uploaded JSX code snippets with full React hooks support
 * Handles multiple code formats and patterns
 */

export const renderJSXComponent = (jsxCode) => {
  if (!jsxCode || typeof jsxCode !== 'string') {
    console.warn('Invalid JSX code provided to renderer');
    return null;
  }

  try {
    // Step 1: Clean the code - remove imports and exports
    let cleanCode = jsxCode
      .replace(/import\s+.*?from\s+['"].*?['"]\s*;?\s*/g, '')
      .replace(/import\s+['"].*?['"]\s*;?\s*/g, '')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+/g, '')
      .trim();

    // Step 2: Detect code pattern and extract JSX
    let jsxContent = null;

    // Pattern 1: Pure JSX (starts with < or opening tag)
    if (cleanCode.startsWith('<')) {
      jsxContent = cleanCode;
    }
    
    // Pattern 2: Arrow function component
    else if (cleanCode.includes('=>')) {
      // Try to extract return statement
      const arrowReturnMatch = cleanCode.match(/=>\s*\(([^)]+(?:\([^)]*\)[^)]*)*)\)\s*$/s) || 
                               cleanCode.match(/=>\s*\(([\s\S]*)\)$/);
      
      if (arrowReturnMatch) {
        jsxContent = arrowReturnMatch[1].trim();
      } else {
        // Try to extract from return statement
        const returnMatch = cleanCode.match(/return\s*\(([\s\S]*)\)\s*[;}]?\s*$/);
        if (returnMatch) {
          jsxContent = returnMatch[1].trim();
        } else {
          // Single line arrow function without parentheses
          const singleLineMatch = cleanCode.match(/=>\s*(<[\s\S]*)/);
          if (singleLineMatch) {
            jsxContent = singleLineMatch[1].trim();
          }
        }
      }
    }
    
    // Pattern 3: Function declaration component
    else if (cleanCode.includes('function')) {
      const returnMatch = cleanCode.match(/return\s*\(([\s\S]*)\)\s*[;}]?\s*$/);
      if (returnMatch) {
        jsxContent = returnMatch[1].trim();
      } else {
        // Try without parentheses
        const returnMatchNoParen = cleanCode.match(/return\s+(<[\s\S]*)/);
        if (returnMatchNoParen) {
          jsxContent = returnMatchNoParen[1].trim().replace(/[;}]+$/, '').trim();
        }
      }
    }
    
    // Pattern 4: Const component assignment
    else if (cleanCode.includes('const') && cleanCode.includes('=')) {
      const constMatch = cleanCode.match(/const\s+\w+\s*=\s*\((.*?)\)\s*=>\s*\(([\s\S]*)\)/s);
      if (constMatch) {
        jsxContent = constMatch[2].trim();
      } else {
        const returnMatch = cleanCode.match(/return\s*\(([\s\S]*)\)\s*[;}]?\s*$/);
        if (returnMatch) {
          jsxContent = returnMatch[1].trim();
        }
      }
    }

    // If no JSX extracted, treat entire code as JSX
    if (!jsxContent) {
      jsxContent = cleanCode;
    }

    // Step 3: Extract hooks and state setup from original code
    let hooksSetup = '';
    const hookPatterns = [
      /const\s+\[[\w\s,]+\]\s*=\s*useState\([^)]*\)/g,
      /const\s+\[[\w\s,]+\]\s*=\s*useReducer\([^)]*\)/g,
      /const\s+\w+\s*=\s*useRef\([^)]*\)/g,
      /const\s+\w+\s*=\s*useMemo\([^)]*\)/g,
      /const\s+\w+\s*=\s*useCallback\([^)]*\)/g,
      /useEffect\([^)]*\)/g
    ];

    hookPatterns.forEach(pattern => {
      const matches = cleanCode.match(pattern);
      if (matches) {
        matches.forEach(match => {
          hooksSetup += match + ';\n';
        });
      }
    });

    // Step 4: Extract event handlers and functions
    let functionsSetup = '';
    const functionMatches = cleanCode.match(/const\s+handle\w+\s*=\s*(\([^)]*\)\s*=>\s*\{[\s\S]*?\}|[^;]+)/g);
    if (functionMatches) {
      functionsSetup = functionMatches.join(';\n') + ';\n';
    }

    // Step 5: Build the dynamic component
    const ComponentFunction = new Function(
      'React',
      `
        const { useState, useEffect, useRef, useReducer, useMemo, useCallback, Fragment } = React;
        
        return function DynamicComponent(props) {
          ${hooksSetup}
          ${functionsSetup}
          
          return (
            ${jsxContent}
          );
        };
      `
    );

    // Step 6: Return the component
    const Component = ComponentFunction(React);
    return Component;

  } catch (error) {
    console.error('JSX Rendering Error:', error);
    console.error('Code that failed:', jsxCode);
    
    // Return error component
    return function ErrorComponent() {
      return React.createElement(
        'div',
        { 
          style: { 
            padding: '20px', 
            background: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '12px',
            color: '#ef4444',
            fontFamily: 'monospace',
            fontSize: '12px'
          }
        },
        [
          React.createElement('div', { key: 'title', style: { fontWeight: 'bold', marginBottom: '8px' } }, 'Render Error'),
          React.createElement('div', { key: 'msg', style: { color: '#9ca3af' } }, error.message)
        ]
      );
    };
  }
};

/**
 * Validates if code can be safely rendered
 * Returns { valid: boolean, reason: string }
 */
export const validateJSXCode = (jsxCode) => {
  if (!jsxCode || typeof jsxCode !== 'string') {
    return { valid: false, reason: 'Code is empty or invalid' };
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /eval\(/,
    /Function\(/,
    /localStorage/,
    /sessionStorage/,
    /document\.cookie/,
    /__proto__/,
    /constructor\[/
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(jsxCode)) {
      return { valid: false, reason: 'Code contains potentially unsafe operations' };
    }
  }

  return { valid: true, reason: '' };
};

/**
 * Alternative: Render with error boundary
 */
export const renderWithErrorBoundary = (jsxCode) => {
  const validation = validateJSXCode(jsxCode);
  
  if (!validation.valid) {
    return function ValidationError() {
      return React.createElement(
        'div',
        { 
          style: { 
            padding: '20px', 
            background: '#1f2937', 
            border: '1px solid #374151',
            borderRadius: '12px',
            color: '#f59e0b'
          }
        },
        validation.reason
      );
    };
  }

  return renderJSXComponent(jsxCode);
};