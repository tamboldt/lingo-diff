import React, { useState, useRef } from 'react';
import { parseCSV, exportToCSV, generateSampleCSV, TextComparisonRecord, ImportValidation } from '../utils/csvHandler';
import { CSVPreviewModal } from './CSVPreviewModal';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState<string>('');
  const [validationResults, setValidationResults] = useState<ImportValidation | null>(null);
  const [previewRecords, setPreviewRecords] = useState<TextComparisonRecord[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setImportStatus('error');
      setImportMessage('Please select a CSV file.');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImportStatus('error');
      setImportMessage('File too large. Please select a CSV file smaller than 5MB.');
      return;
    }

    setIsProcessing(true);
    try {
      const content = await file.text();
      const results = parseCSV(content);
      setValidationResults(results);

      if (results.valid && results.records.length > 0) {
        // Show preview instead of immediately importing
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
      setImportMessage('No data to export. Add some text comparisons first.');
      return;
    }

    const csvContent = exportToCSV(currentRecords);
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
      setImportMessage(`Exported ${currentRecords.length} records to CSV.`);
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
      setImportMessage(`Successfully imported ${previewRecords.length} comparison records.`);
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
    setValidationResults(null);
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Import CSV File</label>
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
              <p className="text-xs text-gray-500">
                Required columns: Reference_Text, Context, Text_A, Text_B
              </p>
            </div>
          </div>

          {/* Export Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Data</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleExport}
                disabled={currentRecords.length === 0}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Export Current Data
              </button>
              <button
                onClick={downloadSampleCSV}
                className="px-3 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
              >
                Download Sample CSV
              </button>
            </div>
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
                    {validationResults && validationResults.errors.length > 0 && (
                      <ul className="mt-2 text-xs space-y-1">
                        {validationResults.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
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

          {/* CSV Format Help */}
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
            <p className="font-medium mb-1">CSV Format Guide:</p>
            <p>• Headers: Reference_Text, Context, Text_A, Text_B, Notes (optional)</p>
            <p>• Text_A and Text_B: At least one must contain text</p>
            <p>• Use quotes for text containing commas or line breaks</p>
            <p>• Download sample CSV to see the exact format</p>
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