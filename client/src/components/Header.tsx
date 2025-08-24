import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';
import { FEATURES } from '../config/features';

interface HeaderProps {
  onReset: () => void;
  onResetWelcome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onResetWelcome }) => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => window.location.href = '/'}
            title="Go to homepage"
          >
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" viewBox="0 0 32 32" aria-label="Lingo-Diff logo">
              {/* Background */}
              <rect width="32" height="32" rx="6" fill="currentColor"/>
              
              {/* Left panel (original) */}
              <rect x="4" y="8" width="10" height="16" rx="2" fill="white" stroke="#E5E7EB"/>
              
              {/* Right panel (modified) */}  
              <rect x="18" y="8" width="10" height="16" rx="2" fill="white" stroke="#E5E7EB"/>
              
              {/* Text lines in left panel */}
              <rect x="6" y="11" width="6" height="1" rx="0.5" fill="#6B7280"/>
              <rect x="6" y="14" width="4" height="1" rx="0.5" fill="#DC2626"/> {/* Red for removed */}
              <rect x="6" y="17" width="5" height="1" rx="0.5" fill="#6B7280"/>
              
              {/* Text lines in right panel */}
              <rect x="20" y="11" width="6" height="1" rx="0.5" fill="#6B7280"/>
              <rect x="20" y="14" width="5" height="1" rx="0.5" fill="#16A34A"/> {/* Green for added */}
              <rect x="20" y="17" width="5" height="1" rx="0.5" fill="#6B7280"/>
              
              {/* Diff arrow */}
              <path d="M15 15L17 13L17 17Z" fill="white"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('app.title')}
            </h1>
            <span className="ml-2 text-sm text-gray-500">
              {t('app.subtitle')}
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {FEATURES.I18N_ENABLED && <LanguageSelector />}
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={onReset}
                className="px-3 py-2 sm:py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors touch-manipulation"
              >
                {t('navigation.reset')}
              </button>
              {onResetWelcome && (
                <button
                  onClick={onResetWelcome}
                  className="px-3 py-2 sm:py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors touch-manipulation"
                >
                  {t('navigation.resetWelcome')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 