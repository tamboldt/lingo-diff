import React, { useState } from 'react';
import { CSVManager } from './CSVManager';
import { ConstraintsPanel } from './ConstraintsPanel';
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
      {/* Collapsible Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-xl border-l border-gray-200 transition-all duration-300 ease-in-out z-30 ${
        isExpanded ? 'w-96' : 'w-12'
      }`} style={{ right: 0 }}>
        
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
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Diff History ({comparisonHistory.length})
                  </h3>
                  {comparisonHistory.length > 0 && (
                    <button
                      onClick={onClearHistory}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      title="Clear all history"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {comparisonHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">No diffs saved yet</p>
                    <p className="text-xs text-gray-400 mt-1">Your saved comparisons will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comparisonHistory.map((record, index) => (
                      <div
                        key={record.id || index}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => onSelectRecord(record)}
                      >
                        <div className="space-y-2">
                          {record.referenceText && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reference:</span>
                              <p className="text-sm text-gray-700 truncate">{record.referenceText}</p>
                            </div>
                          )}
                          {record.context && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Context:</span>
                              <p className="text-sm text-gray-700 truncate">{record.context}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-1 gap-2">
                            <div>
                              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Text A:</span>
                              <p className="text-sm text-gray-700 truncate">{record.textA || '(empty)'}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Text B:</span>
                              <p className="text-sm text-gray-700 truncate">{record.textB || '(empty)'}</p>
                            </div>
                          </div>
                          
                          {record.notes && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes:</span>
                              <p className="text-xs text-gray-600 truncate">{record.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            {record.timestamp && (
                              <span className="text-xs text-gray-400">
                                {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            )}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectRecord(record);
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                                title="Load this comparison"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  record.id && onDeleteRecord(record.id);
                                }}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                                title="Delete this comparison"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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