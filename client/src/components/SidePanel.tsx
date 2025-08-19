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
  modifiedText
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'history' | 'ai'>('tools');

  const tabs = [
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'history', label: 'History', icon: '📚' },
    { id: 'ai', label: 'AI', icon: '🤖' }
  ] as const;

  return (
    <>
      {/* Collapsible Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-xl border-l border-gray-200 transition-all duration-300 ease-in-out z-30 ${
        isExpanded ? 'w-96' : 'w-12'
      }`}>
        
        {/* Collapse/Expand Toggle */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white border border-gray-200 rounded-l-md p-2 shadow-md hover:bg-gray-50 transition-colors"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg 
              className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Panel Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}>
          <h2 className="text-lg font-semibold text-gray-800">Tools</h2>
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
              />
            </div>
          )}
        </div>

        {/* Collapsed State Icons */}
        {!isExpanded && (
          <div className="flex flex-col items-center pt-4 space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsExpanded(true);
                }}
                className={`p-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={tab.label}
              >
                <span className="text-lg">{tab.icon}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};