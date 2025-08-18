import React from 'react';
import { TextComparisonRecord } from '../utils/csvHandler';

interface CSVPreviewModalProps {
  records: TextComparisonRecord[];
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const CSVPreviewModal: React.FC<CSVPreviewModalProps> = ({
  records,
  onConfirm,
  onCancel,
  isOpen
}) => {
  if (!isOpen) return null;

  const displayRecords = records.slice(0, 10); // Show first 10 records
  const hasMoreRecords = records.length > 10;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            CSV Import Preview
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Summary */}
          <div className="p-6 bg-blue-50 border-b border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Import Summary:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">Total Records:</span>
                <span className="font-medium ml-1">{records.length}</span>
              </div>
              <div>
                <span className="text-blue-600">With Reference:</span>
                <span className="font-medium ml-1">
                  {records.filter(r => r.referenceText).length}
                </span>
              </div>
              <div>
                <span className="text-blue-600">With Context:</span>
                <span className="font-medium ml-1">
                  {records.filter(r => r.context).length}
                </span>
              </div>
              <div>
                <span className="text-blue-600">Ready to Compare:</span>
                <span className="font-medium ml-1">
                  {records.filter(r => r.textA && r.textB).length}
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Reference Text
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Context
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Text A (Original)
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Text B (Revised)
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayRecords.map((record, index) => (
                    <tr key={record.id || index} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-sm text-gray-900">
                        <div className="max-w-xs break-words">
                          {record.referenceText || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        <div className="max-w-xs break-words">
                          {record.context || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900 font-mono">
                        <div className="max-w-xs break-words">
                          {record.textA || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900 font-mono">
                        <div className="max-w-xs break-words">
                          {record.textB || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-500">
                        <div className="max-w-xs break-words">
                          {record.notes || '-'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasMoreRecords && (
              <div className="text-center text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-md">
                ... and {records.length - 10} more records will be imported
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Import {records.length} Record{records.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};