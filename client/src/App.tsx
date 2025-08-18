import { useState, useEffect, useMemo } from 'react';
import { DiffViewer } from './components/DiffViewer';
import { ClipboardPromptButton } from './components/ClipboardPromptButton';
import { Header } from './components/Header';
import { WelcomeModal } from './components/WelcomeModal';
import { TextMetricsCard } from './components/TextMetricsCard';
import { ConstraintsPanel } from './components/ConstraintsPanel';
import { CSVManager } from './components/CSVManager';
import { ComparisonHistory } from './components/ComparisonHistory';
import { getTextMetrics } from './utils/localizationMetrics';
import { TextComparisonRecord } from './utils/csvHandler';

export default function App() {
  // State for all user inputs
  const [sourceTerm, setSourceTerm] = useState('');
  const [context, setContext] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [constraints, setConstraints] = useState<{ [key: string]: number }>({});
  const [comparisonHistory, setComparisonHistory] = useState<TextComparisonRecord[]>([]);

  // Check for first-time visitors and load history
  useEffect(() => {
    const hasVisited = localStorage.getItem('lingoDiffVisited');
    if (!hasVisited) {
      setIsWelcomeVisible(true);
    }
    
    // Load comparison history from localStorage
    const savedHistory = localStorage.getItem('lingoDiffHistory');
    if (savedHistory) {
      try {
        setComparisonHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load comparison history:', error);
      }
    }
  }, []); // Empty array ensures this runs only once on mount

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (comparisonHistory.length > 0) {
      localStorage.setItem('lingoDiffHistory', JSON.stringify(comparisonHistory));
    }
  }, [comparisonHistory]);

  // Calculate metrics for all texts
  const sourceMetrics = useMemo(() => getTextMetrics(sourceTerm), [sourceTerm]);
  const originalMetrics = useMemo(() => getTextMetrics(originalText, sourceTerm), [originalText, sourceTerm]);
  const modifiedMetrics = useMemo(() => getTextMetrics(modifiedText, sourceTerm), [modifiedText, sourceTerm]);

  const handleReset = () => {
    setSourceTerm('');
    setContext('');
    setOriginalText('');
    setModifiedText('');
    setConstraints({});
  };

  const handleCloseWelcome = () => {
    localStorage.setItem('lingoDiffVisited', 'true');
    setIsWelcomeVisible(false);
  };

  const handleShowExample = () => {
    // Set the state with the example data
    setSourceTerm('Select Room');
    setContext('Mobile app button for hotel room selection');
    setOriginalText('チェックイン時にお部屋を選択');
    setModifiedText('チェックイン時お部屋選択');
    setConstraints({ characters: 15, uiMobile: 12 }); // Mobile button constraints
    
    // Close the modal and mark as visited
    handleCloseWelcome();
  };

  const handleResetWelcome = () => {
    localStorage.removeItem('lingoDiffVisited');
    setIsWelcomeVisible(true);
  };

  // Handler for importing CSV records
  const handleImportRecords = (records: TextComparisonRecord[]) => {
    setComparisonHistory(prev => [...records, ...prev]);
  };

  // Handler for selecting a record from history
  const handleSelectRecord = (record: TextComparisonRecord) => {
    setSourceTerm(record.referenceText);
    setContext(record.context);
    setOriginalText(record.textA);
    setModifiedText(record.textB);
  };

  // Handler for deleting a record from history
  const handleDeleteRecord = (id: string) => {
    setComparisonHistory(prev => prev.filter(record => record.id !== id));
  };

  // Handler for clearing all history
  const handleClearHistory = () => {
    setComparisonHistory([]);
    localStorage.removeItem('lingoDiffHistory');
  };

  // Handler for saving current comparison to history
  const handleSaveComparison = () => {
    if (!originalText && !modifiedText) {
      return;
    }

    const newRecord: TextComparisonRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      referenceText: sourceTerm,
      context: context,
      textA: originalText,
      textB: modifiedText,
      timestamp: new Date().toISOString()
    };

    setComparisonHistory(prev => [newRecord, ...prev]);
  };

  // Create current records array for export
  const currentRecords = useMemo(() => {
    if (!originalText && !modifiedText) return comparisonHistory;
    
    const currentRecord: TextComparisonRecord = {
      id: 'current',
      referenceText: sourceTerm,
      context: context,
      textA: originalText,
      textB: modifiedText,
      timestamp: new Date().toISOString()
    };
    
    return [currentRecord, ...comparisonHistory];
  }, [sourceTerm, context, originalText, modifiedText, comparisonHistory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {isWelcomeVisible && (
        <WelcomeModal 
          onClose={handleCloseWelcome}
          onShowExample={handleShowExample}
        />
      )}
      <Header onReset={handleReset} onResetWelcome={handleResetWelcome} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* TOP ROW: CONTROLS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <CSVManager 
                onImportRecords={handleImportRecords}
                currentRecords={currentRecords}
              />
            </div>
            <div className="lg:col-span-1">
              <ConstraintsPanel constraints={constraints} onConstraintsChange={setConstraints} />
            </div>
            <div className="lg:col-span-1">
              <ComparisonHistory
                records={comparisonHistory}
                onSelectRecord={handleSelectRecord}
                onDeleteRecord={handleDeleteRecord}
                onClearHistory={handleClearHistory}
              />
            </div>
          </div>

          {/* MAIN WORKFLOW: TRANSLATION INPUTS AND DIFF */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT: TRANSLATION CANDIDATES - THE CORE DIFF INPUTS */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-green-500 mr-2">📝</span>
                  Text Comparison
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="candidate1" className="block text-sm font-medium text-gray-700">Text A (Original)</label>
                    <textarea
                      id="candidate1"
                      value={originalText}
                      onChange={(e) => setOriginalText(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                      placeholder="Enter original text..."
                    />
                  </div>
                  <div>
                    <label htmlFor="candidate2" className="block text-sm font-medium text-gray-700">Text B (Revised)</label>
                    <textarea
                      id="candidate2"
                      value={modifiedText}
                      onChange={(e) => setModifiedText(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                      placeholder="Enter revised text..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE DIFF VISUALIZATION - THE MAIN OUTPUT */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visual Difference Analysis
                </h2>
                <DiffViewer originalText={originalText} modifiedText={modifiedText} />
              </div>
            </div>
          </div>

          {/* SECONDARY ROW: CONTEXT AND METRICS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT: SOURCE INFORMATION */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-500 mr-2">📄</span>
                Context Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="sourceTerm" className="block text-sm font-medium text-gray-700">Reference Text</label>
                  <textarea
                    id="sourceTerm"
                    value={sourceTerm}
                    onChange={(e) => setSourceTerm(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Select Room"
                  />
                </div>
                <div>
                  <label htmlFor="context" className="block text-sm font-medium text-gray-700">Context & Usage</label>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Mobile app button for hotel room selection"
                  />
                </div>
                {(originalText || modifiedText) && (
                  <button
                    onClick={handleSaveComparison}
                    className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    💾 Save Comparison to History
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: AI ANALYSIS */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Analysis
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Generate expert analysis prompt for AI evaluation of text differences.
              </p>
              <ClipboardPromptButton 
                sourceTerm={sourceTerm}
                context={context}
                originalText={originalText}
                modifiedText={modifiedText}
              />
            </div>
          </div>

          {/* METRICS ROW */}
          {(sourceTerm || originalText || modifiedText) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sourceTerm && (
                <TextMetricsCard
                  text={sourceTerm}
                  label="Reference Text"
                  metrics={sourceMetrics}
                  isSource={true}
                />
              )}
              {originalText && (
                <TextMetricsCard
                  text={originalText}
                  label="Text A"
                  metrics={originalMetrics}
                  constraints={constraints}
                />
              )}
              {modifiedText && (
                <TextMetricsCard
                  text={modifiedText}
                  label="Text B"
                  metrics={modifiedMetrics}
                  constraints={constraints}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 