import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { parseSmartCSV, exportSmartCSV, generateSampleCSV, TextComparisonRecord, SmartCSVResult } from '../utils/smartCSV';
import { InfoTooltip } from './Tooltip';
import { CSVPreviewModal } from './CSVPreviewModal';
import { FEATURES } from '../config/features';

// Mock functions when i18n is disabled
const mockUseTranslation = () => ({
  t: (key: string, params?: any) => {
    const keys: { [key: string]: string } = {
      'csv.import.label': 'Import CSV File',
      'csv.import.tooltip': 'Upload any CSV file with text columns. We\'ll automatically detect and map your columns intelligently.',
      'csv.import.smartDetection': '✨ Smart Detection: Works with any column names in any language',
      'csv.import.separatorDetection': '🔍 Auto-detects separators: comma, semicolon, tab, pipe',
      'csv.import.commaHandling': '📝 Handles commas in text automatically (e.g., "Welcome back, John!")',
      'csv.export.label': 'Export Data',
      'csv.export.tooltip': 'Export your comparisons to CSV format. Compatible with Excel, Google Sheets, and all spreadsheet applications.',
      'csv.export.currentData': '📄 Export Current Data',
      'csv.export.sampleFile': '📋 Download Sample CSV',
      'csv.export.compatibility': '💡 Perfect format for Excel with proper UTF-8 encoding',
      'csv.features.title': '✨ Smart Import Features:',
      'csv.features.separatorDetection': 'Auto-detects separators: comma (,), semicolon (;), tab, pipe (|)',
      'csv.features.columnDetection': 'Automatically detects column types in any language',
      'csv.features.flexibleNames': 'Works with flexible column names (Original/Revised, A/B, etc.)',
      'csv.features.specialChars': 'Handles commas, quotes, and special characters seamlessly',
      'csv.features.utf8Support': 'Perfect UTF-8 support for all international text',
      'csv.features.noTechnical': 'No technical CSV formatting knowledge required',
      'messages.invalidFile': 'Please select a CSV file.',
      'messages.fileTooBig': 'File too large. Please select a CSV file smaller than 5MB.',
      'messages.importSuccess': 'Successfully imported {{count}} comparison records.',
      'messages.exportSuccess': 'Exported {{count}} records to CSV.',
      'messages.noDataExport': 'No data to export. Add some text comparisons first.'
    };
    let result = keys[key] || key;
    if (params && params.count !== undefined) {
      result = result.replace('{{count}}', params.count.toString());
    }
    return result;
  }
});

interface CSVManagerProps {
  onImportRecords: (records: TextComparisonRecord[]) => void;
  currentRecords: TextComparisonRecord[];
  className?: string;
}

export const CSVManager: React.FC<CSVManagerProps> = ({
  onImportRecords,
  currentRecords,
  className = ''
}) => {
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : mockUseTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState<string>('');
  const [smartResults, setSmartResults] = useState<SmartCSVResult | null>(null);
  const [previewRecords, setPreviewRecords] = useState<TextComparisonRecord[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setImportStatus('error');
      setImportMessage(t('messages.invalidFile'));
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImportStatus('error');
      setImportMessage(t('messages.fileTooBig'));
      return;
    }

    setIsProcessing(true);
    try {
      const content = await file.text();
      const results = parseSmartCSV(content);
      setSmartResults(results);

      if (results.success && results.records.length > 0) {
        // Show preview instead of immediately importing (our enhancement)
        setPreviewRecords(results.records);
        setImportStatus('idle');
        setImportMessage('');
      } else {
        setImportStatus('error');
        setImportMessage(results.errors.join('. '));
      }
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Failed to read CSV file. Please check the file format.');
    }
    setIsProcessing(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    if (currentRecords.length === 0) {
      setImportStatus('error');
      setImportMessage(t('messages.noDataExport'));
      return;
    }

    const csvContent = exportSmartCSV(currentRecords);
    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `lingo-diff-export-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setImportStatus('success');
      setImportMessage(t('messages.exportSuccess', { count: currentRecords.length }));
    }
  };

  const downloadSampleCSV = () => {
    const sampleContent = generateSampleCSV();
    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + sampleContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'lingo-diff-sample.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleConfirmImport = () => {
    if (previewRecords) {
      onImportRecords(previewRecords);
      setImportStatus('success');
      setImportMessage(t('messages.importSuccess', { count: previewRecords.length }));
      setPreviewRecords(null);
      setIsModalOpen(false);
    }
  };

  const handleCancelImport = () => {
    setIsModalOpen(false);
  };

  const handleDiscardPreview = () => {
    setPreviewRecords(null);
    setIsModalOpen(false);
    setImportStatus('idle');
    setImportMessage('');
  };

  const clearStatus = () => {
    setImportStatus('idle');
    setImportMessage('');
    setSmartResults(null);
    setPreviewRecords(null);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          CSV Import/Export
        </h3>
        <svg 
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Import Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">{t('csv.import.label')}</label>
              <InfoTooltip content={t('csv.import.tooltip')} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
                />
                {isProcessing && (
                  <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </div>
              <div className="text-xs space-y-1">
                <p className="text-green-600">{t('csv.import.smartDetection')}</p>
                <p className="text-blue-600">{t('csv.import.separatorDetection')}</p>
                <p className="text-purple-600">{t('csv.import.commaHandling')}</p>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">{t('csv.export.label')}</label>
              <InfoTooltip content={t('csv.export.tooltip')} />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleExport}
                disabled={currentRecords.length === 0}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
{t('csv.export.currentData')}
              </button>
              <button
                onClick={downloadSampleCSV}
                className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
{t('csv.export.sampleFile')}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
{t('csv.export.compatibility')}
            </p>
          </div>

          {/* Show preview button when records are ready */}
          {previewRecords && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 mb-2">
                ✅ Ready to import {previewRecords.length} records
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Preview Import Data
                </button>
                <button
                  onClick={handleDiscardPreview}
                  className="px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {importStatus !== 'idle' && (
            <div className={`p-3 rounded-md ${
              importStatus === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  {importStatus === 'success' ? (
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <div>
                    <p className="text-sm font-medium">{importMessage}</p>
                    {smartResults && smartResults.errors.length > 0 && (
                      <ul className="mt-2 text-xs space-y-1">
                        {smartResults.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    )}
                    {smartResults && smartResults.success && smartResults.mapping && smartResults.mapping.length > 0 && (
                      <div className="mt-2 text-xs">
                        <p className="font-medium text-green-700">Smart Column Mapping:</p>
                        <ul className="mt-1 space-y-1">
                          {smartResults.mapping.filter(m => m.confidence > 0.6).map((mapping, index) => (
                            <li key={index} className="text-green-600">
                              "{mapping.detected}" → {mapping.mapped} ({Math.round(mapping.confidence * 100)}% confidence)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={clearStatus}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Smart Import Help */}
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
            <p className="font-medium mb-1 text-blue-800">{t('csv.features.title')}</p>
            <p className="text-blue-700">• {t('csv.features.separatorDetection')}</p>
            <p className="text-blue-700">• {t('csv.features.columnDetection')}</p>
            <p className="text-blue-700">• {t('csv.features.flexibleNames')}</p>
            <p className="text-blue-700">• {t('csv.features.specialChars')}</p>
            <p className="text-blue-700">• {t('csv.features.utf8Support')}</p>
            <p className="text-blue-700">• {t('csv.features.noTechnical')}</p>
          </div>
        </div>
      )}

      {/* CSV Preview Modal */}
      {previewRecords && (
        <CSVPreviewModal
          records={previewRecords}
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
          isOpen={isModalOpen}
        />
      )}
    </div>
  );
};