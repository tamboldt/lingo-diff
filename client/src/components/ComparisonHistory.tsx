import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../config/features';
import { TextComparisonRecord } from '../utils/csvHandler';

interface ComparisonHistoryProps {
  records: TextComparisonRecord[];
  onSelectRecord: (record: TextComparisonRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export const ComparisonHistory: React.FC<ComparisonHistoryProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onClearHistory,
  className = ''
}) => {
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : { t: (key: string) => key.split('.').pop() || key };
  const [isExpanded, setIsExpanded] = useState(false);

  if (records.length === 0) {
    return null;
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return t('history.empty');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-left"
        >
          <h3 className="font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('history.title')} ({records.length})
          </h3>
          <svg 
            className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {records.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-red-600 hover:text-red-800 text-sm"
            title={t('history.clear')}
          >
            {t('history.clear')}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {records.map((record, index) => (
            <div
              key={record.id || index}
              className="border border-gray-100 rounded-md p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectRecord(record)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">{t('history.reference')}</span>
                      <span className="ml-1 text-gray-600">{truncateText(record.referenceText)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('history.context')}</span>
                      <span className="ml-1 text-gray-600">{truncateText(record.context)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-600">{t('history.textA')}</span>
                      <span className="ml-1 text-gray-600">{truncateText(record.textA)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">{t('history.textB')}</span>
                      <span className="ml-1 text-gray-600">{truncateText(record.textB)}</span>
                    </div>
                  </div>
                  
                  {record.notes && (
                    <div className="mt-2 text-xs text-gray-500">
                      <span className="font-medium">{t('history.notes')}</span> {truncateText(record.notes, 100)}
                    </div>
                  )}
                  
                  {record.timestamp && (
                    <div className="mt-1 text-xs text-gray-400">
                      {formatTimestamp(record.timestamp)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() => onSelectRecord(record)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title={t('history.load')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => record.id && onDeleteRecord(record.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title={t('history.delete')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};