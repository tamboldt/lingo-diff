import React from 'react';
import { TextComparisonRecord } from '../utils/csvHandler';

interface CSVPreviewProps {
  records: TextComparisonRecord[];
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

export const CSVPreview: React.FC<CSVPreviewProps> = ({
  records,
  onConfirm,
  onCancel,
  className = ''
}) => {
  const displayRecords = records.slice(0, 5); // Show first 5 records
  const hasMoreRecords = records.length > 5;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Import Preview
        </h3>
        <span className="text-sm text-gray-500">
          {records.length} record{records.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Preview Table */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference Text
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Context
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Text A
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Text B
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayRecords.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate">
                  {record.referenceText || '-'}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate">
                  {record.context || '-'}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate font-mono">
                  {record.textA || '-'}
                </td>
                <td className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate font-mono">
                  {record.textB || '-'}
                </td>
                <td className="px-3 py-2 text-sm text-gray-500 max-w-xs truncate">
                  {record.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMoreRecords && (
        <div className="text-center text-sm text-gray-500 mb-4">
          ... and {records.length - 5} more records
        </div>
      )}

      {/* Data Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Import Summary:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
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
  );
};