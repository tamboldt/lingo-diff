import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CSVManager } from './CSVManager';
import { ConstraintsPanel } from './ConstraintsPanel';
import { ComparisonHistory } from './ComparisonHistory';
import { LLMIntegration } from './LLMIntegration';
import { TextComparisonRecord } from '../utils/smartCSV';
import { FEATURES } from '../config/features';

// Mock functions when i18n is disabled
const mockUseTranslation = () => ({
  t: (key: string) => {
    const keys: { [key: string]: string } = {
      'sidebar.tools': 'Tools',
      'sidebar.history': 'History', 
      'sidebar.ai': 'AI',
      'sidebar.collapse': 'Collapse sidebar',
      'sidebar.expand': 'Expand sidebar'
    };
    return keys[key] || key;
  }
});

interface SidePanelProps {
  isExpanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  
  // CSV Manager props
  onImportRecords: (records: TextComparisonRecord[]) => void;
  currentRecords: TextComparisonRecord[];
  
  // Constraints props
  constraints: { [key: string]: number };
  onConstraintsChange: (constraints: { [key: string]: number }) => void;
  
  // History props
  comparisonHistory: TextComparisonRecord[];
  onSelectRecord: (record: TextComparisonRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearHistory: () => void;
  
  // LLM Integration props
  sourceTerm: string;
  context: string;
  originalText: string;
  modifiedText: string;
  
  // AI Modal props
  onOpenAIModal: (analysis: string, analyzing?: boolean) => void;
  onUpdateAIAnalysis: (analysis: string, analyzing?: boolean) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isExpanded,
  onToggleExpanded,
  onImportRecords,
  currentRecords,
  constraints,
  onConstraintsChange,
  comparisonHistory,
  onSelectRecord,
  onDeleteRecord,
  onClearHistory,
  sourceTerm,
  context,
  originalText,
  modifiedText,
  onOpenAIModal,
  onUpdateAIAnalysis
}) => {
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : mockUseTranslation();
  const [activeTab, setActiveTab] = useState<'tools' | 'history' | 'ai'>('tools');

  // Notify parent when expanded state changes

  const tabs = [
    { id: 'tools', label: t('sidebar.tools'), icon: '🛠️' },
    { id: 'history', label: t('sidebar.history'), icon: '📚' },
    { id: 'ai', label: t('sidebar.ai'), icon: '🤖' }
  ] as const;

  return (
    <>
      {/* Collapsible Sidebar */}
      <div 
        className="fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white shadow-xl border-l border-gray-200 transition-all duration-300 ease-in-out z-30"
        style={{ width: isExpanded ? '384px' : '48px' }}
      >
        
        {/* Collapse/Expand Toggle */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
          <div className="bg-white border border-gray-200 rounded-l-md shadow-md">
            {isExpanded ? (
              // Single collapse button when expanded
              <button
                onClick={() => onToggleExpanded(false)}
                className="p-2 hover:bg-gray-50 transition-colors"
                aria-label={t('sidebar.collapse')}
              >
                <svg 
                  className="w-4 h-4 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            ) : (
              // Three tool icons when collapsed
              <div className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      onToggleExpanded(true);
                    }}
                    className={`p-2 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title={tab.label}
                    aria-label={`${t('sidebar.expand')} ${tab.label}`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}>
          <h2 className="text-lg font-semibold text-gray-800">{t('sidebar.tools')}</h2>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b border-gray-200 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}>
          {isExpanded && tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`flex-1 overflow-y-auto ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300 h-full`}>
          {activeTab === 'tools' && (
            <div className="space-y-6 p-4">
              <CSVManager 
                onImportRecords={onImportRecords}
                currentRecords={currentRecords}
              />
              <ConstraintsPanel 
                constraints={constraints} 
                onConstraintsChange={onConstraintsChange} 
              />
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="p-4">
              <ComparisonHistory
                records={comparisonHistory}
                onSelectRecord={onSelectRecord}
                onDeleteRecord={onDeleteRecord}
                onClearHistory={onClearHistory}
              />
            </div>
          )}
          
          {activeTab === 'ai' && (
            <div className="p-4">
              <LLMIntegration
                sourceTerm={sourceTerm}
                context={context}
                originalText={originalText}
                modifiedText={modifiedText}
                onOpenModal={onOpenAIModal}
                onUpdateAnalysis={onUpdateAIAnalysis}
              />
            </div>
          )}
        </div>

      </div>
    </>
  );
};