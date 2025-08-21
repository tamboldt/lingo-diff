import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../config/features';

// Mock functions when i18n is disabled
const mockUseTranslation = () => ({
  t: (key: string) => {
    const keys: { [key: string]: string } = {
      'constraints.title': 'Technical Constraints',
      'constraints.technicalConstraints': 'Technical Constraints',
      'constraints.quickPresets': 'Quick Presets',
      'constraints.sms': 'SMS Bytes',
      'constraints.characterLimit': 'Character Limit',
      'constraints.mobileUI': 'Mobile UI (chars)',
      'constraints.activeConstraints': 'Active Constraints:',
      'constraints.smsLabel': 'SMS',
      'constraints.mobileUILabel': 'Mobile UI',
      'constraints.charactersLabel': 'Characters',
      'constraints.presets.sms': 'SMS (160 bytes)',
      'constraints.presets.tweet': 'Tweet (280 chars)',
      'constraints.presets.mobileBtnShort': 'Mobile Button (12 chars)',
      'constraints.presets.mobileBtnLong': 'Mobile Button (20 chars)',
      'constraints.presets.metaTitle': 'Meta Title (60 chars)',
      'constraints.presets.metaDesc': 'Meta Description (160 chars)'
    };
    return keys[key] || key;
  }
});

interface ConstraintsPanelProps {
  constraints: { [key: string]: number };
  onConstraintsChange: (constraints: { [key: string]: number }) => void;
}

export const ConstraintsPanel: React.FC<ConstraintsPanelProps> = ({
  constraints,
  onConstraintsChange
}) => {
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : mockUseTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConstraintChange = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const newConstraints = { ...constraints };
    
    if (numValue > 0) {
      newConstraints[key] = numValue;
    } else {
      delete newConstraints[key];
    }
    
    onConstraintsChange(newConstraints);
  };

  const presets = {
    sms: { label: t('constraints.presets.sms'), value: 160 },
    tweet: { label: t('constraints.presets.tweet'), value: 280 },
    mobileBtnShort: { label: t('constraints.presets.mobileBtnShort'), value: 12 },
    mobileBtnLong: { label: t('constraints.presets.mobileBtnLong'), value: 20 },
    metaTitle: { label: t('constraints.presets.metaTitle'), value: 60 },
    metaDesc: { label: t('constraints.presets.metaDesc'), value: 160 },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          {t('constraints.title')}
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
          {/* Quick Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('constraints.quickPresets')}</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handleConstraintChange(
                    key.includes('chars') || key.includes('Btn') || key.includes('meta') ? 'characters' : 'sms',
                    preset.value.toString()
                  )}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="sms-limit" className="block text-xs font-medium text-gray-700">{t('constraints.sms')}</label>
              <input
                id="sms-limit"
                type="number"
                placeholder="160"
                value={constraints.sms || ''}
                onChange={(e) => handleConstraintChange('sms', e.target.value)}
                className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="char-limit" className="block text-xs font-medium text-gray-700">{t('constraints.characterLimit')}</label>
              <input
                id="char-limit"
                type="number"
                placeholder="50"
                value={constraints.characters || ''}
                onChange={(e) => handleConstraintChange('characters', e.target.value)}
                className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="ui-limit" className="block text-xs font-medium text-gray-700">{t('constraints.mobileUI')}</label>
              <input
                id="ui-limit"
                type="number"
                placeholder="15"
                value={constraints.uiMobile || ''}
                onChange={(e) => handleConstraintChange('uiMobile', e.target.value)}
                className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Active Constraints Display */}
          {Object.keys(constraints).length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-600 mb-2">{t('constraints.activeConstraints')}</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(constraints).map(([key, value]) => (
                  <span
                    key={key}
                    className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {key === 'sms' ? t('constraints.smsLabel') : key === 'uiMobile' ? t('constraints.mobileUILabel') : t('constraints.charactersLabel')}: {value}
                    <button
                      onClick={() => handleConstraintChange(key, '')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};