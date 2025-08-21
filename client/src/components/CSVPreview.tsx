import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextComparisonRecord } from '../utils/csvHandler';
import { FEATURES } from '../config/features';

// Mock functions when i18n is disabled
const mockUseTranslation = () => ({
  t: (key: string, params?: { [key: string]: any }) => {
    const keys: { [key: string]: string } = {
      'csv.preview.title': 'Import Preview',
      'csv.preview.recordsFound': '{{count}} record{{plural}} found',
      'csv.preview.referenceText': 'Reference Text',
      'csv.preview.context': 'Context',
      'csv.preview.textA': 'Text A',
      'csv.preview.textB': 'Text B',
      'csv.preview.notes': 'Notes',
      'csv.preview.moreRecords': '... and {{count}} more records',
      'csv.preview.summary': 'Import Summary:',
      'csv.preview.totalRecords': 'Total Records:',
      'csv.preview.withReference': 'With Reference:',
      'csv.preview.withContext': 'With Context:',
      'csv.preview.readyToCompare': 'Ready to Compare:',
      'csv.preview.cancel': 'Cancel',
      'csv.preview.import': 'Import {{count}} Record{{plural}}'
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
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : mockUseTranslation();\n  const displayRecords = records.slice(0, 5); // Show first 5 records
  const hasMoreRecords = records.length > 5;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('csv.preview.title')}
        </h3>
        <span className="text-sm text-gray-500">
          {t('csv.preview.recordsFound', { count: records.length, plural: records.length !== 1 ? 's' : '' })}
        </span>
      </div>

      {/* Preview Table */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('csv.preview.referenceText')}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('csv.preview.context')}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('csv.preview.textA')}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('csv.preview.textB')}
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('csv.preview.notes')}
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
          {t('csv.preview.moreRecords', { count: records.length - 5 })}
        </div>
      )}

      {/* Data Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">{t('csv.preview.summary')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div>
            <span className="text-blue-600">{t('csv.preview.totalRecords')}</span>
            <span className="font-medium ml-1">{records.length}</span>
          </div>
          <div>
            <span className="text-blue-600">{t('csv.preview.withReference')}</span>
            <span className="font-medium ml-1">
              {records.filter(r => r.referenceText).length}
            </span>
          </div>
          <div>
            <span className="text-blue-600">{t('csv.preview.withContext')}</span>
            <span className="font-medium ml-1">
              {records.filter(r => r.context).length}
            </span>
          </div>
          <div>
            <span className="text-blue-600">{t('csv.preview.readyToCompare')}</span>
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
          {t('csv.preview.cancel')}
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          {t('csv.preview.import', { count: records.length, plural: records.length !== 1 ? 's' : '' })}
        </button>
      </div>
    </div>
  );
};