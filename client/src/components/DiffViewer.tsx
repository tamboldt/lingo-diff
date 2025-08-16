import React from 'react';
import { diffChars } from 'diff';

// Types for the component props
interface DiffViewerProps {
  originalText: string;
  modifiedText: string;
}

/**
 * DiffViewer Component
 * Displays character-by-character differences between two text strings
 * Uses the 'diff' library to highlight additions (green) and deletions (red)
 */
export const DiffViewer: React.FC<DiffViewerProps> = ({ originalText, modifiedText }) => {
  // Generate diff using the diff library
  const diffResult = diffChars(originalText, modifiedText);

  // Helper function to render diff parts with appropriate styling
  const renderDiffPart = (part: any, index: number) => {
    if (part.added) {
      // Added text - display in green
      return (
        <span
          key={index}
          className="bg-green-100 text-green-800 px-1 py-0.5 rounded font-mono text-sm"
          title="Added text"
        >
          {part.value}
        </span>
      );
    } else if (part.removed) {
      // Removed text - display in red
      return (
        <span
          key={index}
          className="bg-red-100 text-red-800 px-1 py-0.5 rounded font-mono text-sm line-through"
          title="Removed text"
        >
          {part.value}
        </span>
      );
    } else {
      // Unchanged text - display normally
      return (
        <span key={index} className="font-mono text-sm">
          {part.value}
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Visual Diff
      </h3>
      
      <div className="bg-gray-50 rounded-md p-3 min-h-[100px]">
        {originalText || modifiedText ? (
          <div className="whitespace-pre-wrap break-words">
            {diffResult.map(renderDiffPart)}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Enter text to see the visual diff</p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-100 text-red-800 rounded mr-1 flex items-center justify-center text-xs">-</span>
          <span>Removed</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-100 text-green-800 rounded mr-1 flex items-center justify-center text-xs">+</span>
          <span>Added</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-gray-100 text-gray-800 rounded mr-1 flex items-center justify-center text-xs">=</span>
          <span>Unchanged</span>
        </div>
      </div>
    </div>
  );
}; 