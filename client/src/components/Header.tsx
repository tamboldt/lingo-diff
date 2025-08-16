import React from 'react';

interface HeaderProps {
  onReset: () => void;
  onResetWelcome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onResetWelcome }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">Lingo-Diff</h1>
            <span className="ml-2 text-sm text-gray-500">Linguistic Diff Checker</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onReset}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Reset All
            </button>
            {onResetWelcome && (
              <button
                onClick={onResetWelcome}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Reset Welcome
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}; 