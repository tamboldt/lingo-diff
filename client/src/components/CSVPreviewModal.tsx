import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextComparisonRecord } from '../utils/csvHandler';
import { FEATURES } from '../config/features';

// Mock functions when i18n is disabled
const mockUseTranslation = () => ({
  t: (key: string, params?: { [key: string]: any }) => {
    const keys: { [key: string]: string } = {
      'csv.preview.modal.title': 'CSV Import Preview',
      'csv.preview.modal.summary': 'Import Summary:',
      'csv.preview.modal.totalRecords': 'Total Records:',
      'csv.preview.modal.withReference': 'With Reference:',
      'csv.preview.modal.withContext': 'With Context:',
      'csv.preview.modal.readyToCompare': 'Ready to Compare:',
      'csv.preview.modal.referenceText': 'Reference Text',
      'csv.preview.modal.context': 'Context',
      'csv.preview.modal.textA': 'Text A (Original)',
      'csv.preview.modal.textB': 'Text B (Revised)',
      'csv.preview.modal.notes': 'Notes',
      'csv.preview.modal.moreRecords': '... and {{count}} more records will be imported',
      'csv.preview.modal.cancel': 'Cancel',
      'csv.preview.modal.import': 'Import {{count}} Record{{plural}}'
    };
    let result = keys[key] || key;
    if (params) {
      Object.keys(params).forEach(param => {
        result = result.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      });
    }
    return result;
  }
});

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
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : mockUseTranslation();\n  if (!isOpen) return null;

  const displayRecords = records.slice(0, 10); // Show first 10 records
  const hasMoreRecords = records.length > 10;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {t('csv.preview.modal.title')}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('navigation.close')}
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
            <h3 className="text-sm font-medium text-blue-800 mb-2">{t('csv.preview.modal.summary')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600">{t('csv.preview.modal.totalRecords')}</span>
                <span className="font-medium ml-1">{records.length}</span>
              </div>
              <div>
                <span className="text-blue-600">{t('csv.preview.modal.withReference')}</span>
                <span className="font-medium ml-1">
                  {records.filter(r => r.referenceText).length}
                </span>
              </div>
              <div>
                <span className="text-blue-600">{t('csv.preview.modal.withContext')}</span>
                <span className="font-medium ml-1">
                  {records.filter(r => r.context).length}
                </span>
              </div>
              <div>
                <span className="text-blue-600">{t('csv.preview.modal.readyToCompare')}</span>
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
                      {t('csv.preview.modal.referenceText')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      {t('csv.preview.modal.context')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      {t('csv.preview.modal.textA')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      {t('csv.preview.modal.textB')}
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                      {t('csv.preview.modal.notes')}
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
                {t('csv.preview.modal.moreRecords', { count: records.length - 10 })}
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
            {t('csv.preview.modal.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            {t('csv.preview.modal.import', { count: records.length, plural: records.length !== 1 ? 's' : '' })}
          </button>
        </div>
      </div>
    </div>
  );
};