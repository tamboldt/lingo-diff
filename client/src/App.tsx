import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DiffViewer } from './components/DiffViewer';
import { ClipboardPromptButton } from './components/ClipboardPromptButton';
import { Header } from './components/Header';
import { WelcomeModal } from './components/WelcomeModal';
import { TextMetricsCard } from './components/TextMetricsCard';
import { InfoTooltip } from './components/Tooltip';
import { SidePanel } from './components/SidePanel';
import { AIAnalysisModal } from './components/AIAnalysisModal';
import { getTextMetrics } from './utils/localizationMetrics';
import { TextComparisonRecord } from './utils/smartCSV';
import { FEATURES } from './config/features';

// Mock functions when i18n is disabled
const mockUseTranslation = () => ({
  t: (key: string) => {
    // Return the key as fallback when i18n is disabled
    const keys: { [key: string]: string } = {
      'textComparison.title': 'Text Comparison',
      'textComparison.textA.label': 'Text A (Original)',
      'textComparison.textA.placeholder': 'Enter original text...',
      'textComparison.textA.tooltip': 'Enter the original version of your text. This could be an existing translation, first draft, or current version.',
      'textComparison.textB.label': 'Text B (Revised)',
      'textComparison.textB.placeholder': 'Enter revised text...',
      'textComparison.textB.tooltip': 'Enter the revised version of your text. This could be a new translation, edited version, or alternative option.',
      'analysis.title': 'Visual Difference Analysis',
      'context.title': 'Context Information',
      'context.referenceText.label': 'Reference Text',
      'context.referenceText.placeholder': 'e.g., Select Room',
      'context.referenceText.tooltip': 'Enter the source or reference text (like the original English). This helps provide context for comparison analysis.',
      'context.usage.label': 'Context & Usage',
      'context.usage.placeholder': 'e.g., Mobile app button for hotel room selection',
      'context.usage.tooltip': 'Describe where and how this text is used. Include UI context, target audience, or any constraints that affect the text choice.',
      'context.saveButton': '💾 Save Comparison to History',
      'analysis.aiTitle': 'AI Analysis',
      'analysis.aiDescription': 'Generate expert analysis prompt for AI evaluation of text differences.',
      'metrics.referenceText': 'Reference Text',
      'metrics.characters': 'Characters',
      'metrics.words': 'Words',
      'metrics.lines': 'Lines',
      'metrics.chars': 'chars',
      'analysis.emptyTitle': 'Enter text to see differences',
      'analysis.emptyDescription': 'Add your text versions to see a live comparison',
      'analysis.realTime': 'Real-time'
    };
    return keys[key] || key;
  }
});

export default function App() {
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : mockUseTranslation();
  
  // State for all user inputs
  const [sourceTerm, setSourceTerm] = useState('');
  const [context, setContext] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [constraints, setConstraints] = useState<{ [key: string]: number }>({});
  const [comparisonHistory, setComparisonHistory] = useState<TextComparisonRecord[]>([]);
  
  // AI Analysis Modal state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiAnalysis, setAIAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // UI state for progressive disclosure
  const [showContextSection, setShowContextSection] = useState(false);

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

  // AI Analysis Modal handlers
  const handleOpenAIModal = (analysis: string, analyzing: boolean = false) => {
    setAIAnalysis(analysis);
    setIsAnalyzing(analyzing);
    setIsAIModalOpen(true);
  };

  const handleCloseAIModal = () => {
    setIsAIModalOpen(false);
  };

  const handleUpdateAIAnalysis = (analysis: string, analyzing: boolean = false) => {
    setAIAnalysis(analysis);
    setIsAnalyzing(analyzing);
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

  // Sidebar expanded state management
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50" style={{paddingRight: isSidebarExpanded ? '384px' : '48px'}}>
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      {isWelcomeVisible && (
        <WelcomeModal 
          onClose={handleCloseWelcome}
          onShowExample={handleShowExample}
        />
      )}
      <Header onReset={handleReset} onResetWelcome={handleResetWelcome} />
      <main id="main-content" className="p-4 sm:p-6 md:p-8 border-r border-gray-200" role="main" style={{ marginRight: '-3rem' }}>
        <div className="max-w-6xl mx-auto">

          {/* WORKFLOW GUIDE */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-blue-900">Quick Start Guide</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <div>
                  <p className="font-medium text-blue-900">Enter Your Text</p>
                  <p className="text-blue-700">Add both versions in the boxes below</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <div>
                  <p className="font-medium text-blue-900">View Differences</p>
                  <p className="text-blue-700">See highlighted changes instantly</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <div>
                  <p className="font-medium text-blue-900">Get AI Analysis</p>
                  <p className="text-blue-700">Copy prompt for expert evaluation</p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN WORKFLOW: TEXT INPUTS AND DIFF */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{/* Focus on main content */}
            
            {/* LEFT: TEXT COMPARISON - THE CORE DIFF INPUTS */}
            <div className="space-y-4">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-green-500 mr-2">📝</span>
                  {t('textComparison.title')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label htmlFor="candidate1" className="block text-sm font-medium text-gray-700">{t('textComparison.textA.label')}</label>
                      <InfoTooltip content={t('textComparison.textA.tooltip')} />
                    </div>
                    <div className="relative">
                      <textarea
                        id="candidate1"
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm font-mono py-3 px-4 pr-20"
                        placeholder={t('textComparison.textA.placeholder')}
                        aria-describedby="candidate1-help"
                      />
                      <div className="absolute bottom-2 right-3 text-xs font-bold text-gray-600 bg-white/80 px-2 py-1 rounded">
                        {originalText.length} {t('metrics.chars')}
                      </div>
                    </div>
                    <div id="candidate1-help" className="sr-only">
                      Enter the original version of your text for comparison
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label htmlFor="candidate2" className="block text-sm font-medium text-gray-700">{t('textComparison.textB.label')}</label>
                      <InfoTooltip content={t('textComparison.textB.tooltip')} />
                    </div>
                    <div className="relative">
                      <textarea
                        id="candidate2"
                        value={modifiedText}
                        onChange={(e) => setModifiedText(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm font-mono py-3 px-4 pr-20"
                        placeholder={t('textComparison.textB.placeholder')}
                        aria-describedby="candidate2-help"
                      />
                      <div className="absolute bottom-2 right-3 text-xs font-bold text-gray-600 bg-white/80 px-2 py-1 rounded">
                        {modifiedText.length} {t('metrics.chars')}
                      </div>
                    </div>
                    <div id="candidate2-help" className="sr-only">
                      Enter the revised version of your text for comparison
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: LIVE DIFF VISUALIZATION - THE MAIN OUTPUT */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {t('analysis.title')}
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {t('analysis.realTime')}
                  </span>
                </h2>
                {(originalText || modifiedText) ? (
                  <DiffViewer originalText={originalText} modifiedText={modifiedText} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">{t('analysis.emptyTitle')}</p>
                    <p>{t('analysis.emptyDescription')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* METRICS ROW */}
          {(sourceTerm || originalText || modifiedText) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
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

          {/* PROGRESSIVE DISCLOSURE: ADVANCED OPTIONS */}
          <div className="mt-8">
            <button
              onClick={() => setShowContextSection(!showContextSection)}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 transition-colors mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800">Advanced Options</h3>
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Optional</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-600 transition-transform ${showContextSection ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-left">Add context information and perform AI analysis for better insights</p>
            </button>

            {showContextSection && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-blue-500 mr-2">📄</span>
                    Context Information
                  </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="sourceTerm" className="block text-sm font-medium text-gray-700">Reference Text</label>
                    <InfoTooltip content="Enter the source or reference text (like the original English). This helps provide context for comparison analysis." />
                  </div>
                  <textarea
                    id="sourceTerm"
                    value={sourceTerm}
                    onChange={(e) => setSourceTerm(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm py-3 px-4"
                    placeholder="e.g., Select Room"
                    aria-describedby="sourceTerm-help"
                  />
                  <div id="sourceTerm-help" className="sr-only">
                    Enter the source or reference text for context
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="context" className="block text-sm font-medium text-gray-700">Context & Usage</label>
                    <InfoTooltip content="Describe where and how this text is used. Include UI context, target audience, or any constraints that affect the text choice." />
                  </div>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm py-3 px-4"
                    placeholder="e.g., Mobile app button for hotel room selection"
                    aria-describedby="context-help"
                  />
                  <div id="context-help" className="sr-only">
                    Describe where and how this text is used
                  </div>
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

              {/* AI PROMPT GENERATOR */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Analysis
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Free
                  </span>
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>For everyone:</strong> Copy the analysis prompt below, then paste it into ChatGPT, Claude, or your preferred AI assistant for expert text evaluation. No API key required.
                </p>
                <ClipboardPromptButton 
                  sourceTerm={sourceTerm}
                  context={context}
                  originalText={originalText}
                  modifiedText={modifiedText}
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 After copying, open your AI assistant in a new tab and paste the prompt for analysis
                </p>
              </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Side Panel for Advanced Controls */}
      <SidePanel
        isExpanded={isSidebarExpanded}
        onToggleExpanded={setIsSidebarExpanded}
        onImportRecords={handleImportRecords}
        currentRecords={currentRecords}
        constraints={constraints}
        onConstraintsChange={setConstraints}
        comparisonHistory={comparisonHistory}
        onSelectRecord={handleSelectRecord}
        onDeleteRecord={handleDeleteRecord}
        onClearHistory={handleClearHistory}
        sourceTerm={sourceTerm}
        context={context}
        originalText={originalText}
        modifiedText={modifiedText}
        onOpenAIModal={handleOpenAIModal}
        onUpdateAIAnalysis={handleUpdateAIAnalysis}
      />

      {/* AI Analysis Modal - Rendered at top level for better UX */}
      <AIAnalysisModal
        isOpen={isAIModalOpen}
        onClose={handleCloseAIModal}
        analysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
} 