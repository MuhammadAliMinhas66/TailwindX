import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-jsx';

function ComponentPreview({ code, showEditor = true, maxLines = 15, className = '' }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Count lines in code
  const lines = code.split('\n');
  const needsExpansion = lines.length > maxLines;
  const displayCode = expanded || !needsExpansion 
    ? code 
    : lines.slice(0, maxLines).join('\n') + '\n...';

  // Highlight code
  const highlightedCode = Prism.highlight(displayCode, Prism.languages.jsx, 'jsx');

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 ${className}`}>
      
      {showEditor && (
        <div className="relative">
          
          {/* Header with Copy Button */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">JSX Code</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-300"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-400" />
                  <span className="text-green-400 text-xs font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs font-semibold">Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Code Display with Syntax Highlighting */}
          <pre className="overflow-x-auto p-6 text-sm leading-relaxed">
            <code 
              className="language-jsx"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>

          {/* See More/Less Button */}
          {needsExpansion && (
            <div className="flex justify-center py-3 bg-gray-900 border-t border-gray-800">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={16} />
                    See Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    See More ({lines.length - maxLines} more lines)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ComponentPreview;