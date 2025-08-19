import React, { useMemo, useState } from 'react';
import { diffChars } from 'diff';
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../config/features';

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
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : { t: (key: string) => key.split('.').pop() || key };
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoize diff calculation to avoid unnecessary recalculations
  const diffResult = useMemo(() => {
    if (!originalText && !modifiedText) return [];
    
    setIsProcessing(true);
    const result = diffChars(originalText, modifiedText);
    setTimeout(() => setIsProcessing(false), 100); // Brief processing indicator
    return result;
  }, [originalText, modifiedText]);

  // Calculate diff statistics
  const diffStats = useMemo(() => {
    const added = diffResult.filter(part => part.added).reduce((acc, part) => acc + part.value.length, 0);
    const removed = diffResult.filter(part => part.removed).reduce((acc, part) => acc + part.value.length, 0);
    const unchanged = diffResult.filter(part => !part.added && !part.removed).reduce((acc, part) => acc + part.value.length, 0);
    return { added, removed, unchanged, total: added + removed + unchanged };
  }, [diffResult]);

  // Helper function to render diff parts with appropriate styling
  const renderDiffPart = (part: any, index: number) => {
    if (part.added) {
      // Added text - display in green
      return (
        <span
          key={index}
          className="bg-green-100 text-green-800 px-1 py-0.5 rounded font-mono text-sm"
          title={t('analysis.addedText')}
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
          title={t('analysis.removedText')}
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

  const handleManualRefresh = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 200);
  };

  const hasContent = originalText || modifiedText;
  const hasBothTexts = originalText && modifiedText;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('analysis.visualDiff')}
          {isProcessing && (
            <svg className="w-4 h-4 ml-2 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {hasBothTexts && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              {t('analysis.autoUpdating')}
            </span>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={!hasContent}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title={t('analysis.refreshDiff')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-md p-3 min-h-[100px]">
        {hasContent ? (
          <div className="whitespace-pre-wrap break-words">
            {diffResult.length > 0 ? (
              diffResult.map(renderDiffPart)
            ) : (
              <div className="text-amber-600 text-center py-4">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm">{t('analysis.enterBothTexts')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium">{t('analysis.readyForAnalysis')}</p>
            <p className="text-sm text-gray-400 mt-1">{t('analysis.addTextToSee')}</p>
          </div>
        )}
      </div>
      
      {/* Legend and Statistics */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-100 text-red-800 rounded mr-1 flex items-center justify-center text-xs">-</span>
            <span>{t('analysis.removed')} {diffStats.removed > 0 && `(${diffStats.removed})`}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-100 text-green-800 rounded mr-1 flex items-center justify-center text-xs">+</span>
            <span>{t('analysis.added')} {diffStats.added > 0 && `(${diffStats.added})`}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-gray-100 text-gray-800 rounded mr-1 flex items-center justify-center text-xs">=</span>
            <span>{t('analysis.unchanged')} {diffStats.unchanged > 0 && `(${diffStats.unchanged})`}</span>
          </div>
        </div>
        {diffStats.total > 0 && (
          <div className="text-xs text-gray-500">
            {`${t('analysis.totalCharacters').replace('{{count}}', diffStats.total.toString())}`}
          </div>
        )}
      </div>
    </div>
  );
}; 