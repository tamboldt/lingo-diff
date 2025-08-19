import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_NAMES, isRTL } from '../i18n';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language;
  const currentIsRTL = isRTL(currentLanguage);

  // Sort languages alphabetically based on current locale
  const sortedLanguages = Object.entries(LANGUAGE_NAMES).sort(([, nameA], [, nameB]) => {
    return nameA.localeCompare(nameB, currentLanguage, { 
      sensitivity: 'base',
      numeric: true,
      ignorePunctuation: true 
    });
  });

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Update document direction and lang attribute
    document.documentElement.lang = languageCode;
    document.documentElement.dir = isRTL(languageCode) ? 'rtl' : 'ltr';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set initial document attributes
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentIsRTL ? 'rtl' : 'ltr';
  }, [currentLanguage, currentIsRTL]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg 
          className={`w-4 h-4 ${currentIsRTL ? 'ml-2' : 'mr-2'} text-gray-500`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
          />
        </svg>
        <span className="truncate">
          {LANGUAGE_NAMES[currentLanguage as keyof typeof LANGUAGE_NAMES] || currentLanguage}
        </span>
        <svg 
          className={`w-4 h-4 ${currentIsRTL ? 'mr-2' : 'ml-2'} text-gray-400`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute ${currentIsRTL ? 'left-0' : 'right-0'} z-50 mt-2 w-64 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}>
          <div className="py-1 max-h-80 overflow-y-auto">
            {sortedLanguages.map(([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`
                  w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left
                  ${currentLanguage === code ? 'bg-gray-100 text-gray-900 font-medium' : ''}
                  ${isRTL(code) ? 'text-right' : 'text-left'}
                `}
                role="menuitem"
              >
                <div className="flex items-center justify-between">
                  <span className={`${isRTL(code) ? 'font-medium' : ''}`}>
                    {name}
                  </span>
                  {currentLanguage === code && (
                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {/* Show English name for RTL languages */}
                {isRTL(code) && code !== 'en' && (
                  <div className="text-xs text-gray-500 mt-1">
                    {code === 'ar' ? 'Arabic' : code === 'he' ? 'Hebrew' : ''}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};