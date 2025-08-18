import React, { useState } from 'react';
import { CSVManager } from './CSVManager';
import { ConstraintsPanel } from './ConstraintsPanel';
import { ComparisonHistory } from './ComparisonHistory';
import { LLMIntegration } from './LLMIntegration';
import { TextComparisonRecord } from '../utils/csvHandler';

interface SidePanelProps {
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'tools' | 'history' | 'ai'>('tools');

  const tabs = [
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'history', label: 'History', icon: '📚' },
    { id: 'ai', label: 'AI', icon: '🤖' }
  ] as const;

  return (
    <>
      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-xl border-l border-gray-200 transition-transform duration-300 ease-in-out z-40 ${
        isExpanded ? 'translate-x-0' : 'translate-x-full'
      }`} style={{ width: '400px' }}>
        
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Controls</h2>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
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
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'tools' && (
            <div className="space-y-6">
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
            <ComparisonHistory
              records={comparisonHistory}
              onSelectRecord={onSelectRecord}
              onDeleteRecord={onDeleteRecord}
              onClearHistory={onClearHistory}
            />
          )}
          
          {activeTab === 'ai' && (
            <LLMIntegration
              sourceTerm={sourceTerm}
              context={context}
              originalText={originalText}
              modifiedText={modifiedText}
              onOpenModal={onOpenAIModal}
              onUpdateAnalysis={onUpdateAIAnalysis}
            />
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(true)}
        className={`fixed top-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-30 ${
          isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Open controls panel"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      </button>

      {/* Overlay when panel is open */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};