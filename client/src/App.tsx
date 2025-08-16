import { useState, useEffect } from 'react';
import { DiffViewer } from './components/DiffViewer';
import { ClipboardPromptButton } from './components/ClipboardPromptButton';
import { Header } from './components/Header';
import { WelcomeModal } from './components/WelcomeModal';

export default function App() {
  // State for all user inputs
  const [sourceTerm, setSourceTerm] = useState('');
  const [context, setContext] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);

  // Check for first-time visitors
  useEffect(() => {
    const hasVisited = localStorage.getItem('lingoDiffVisited');
    if (!hasVisited) {
      setIsWelcomeVisible(true);
    }
  }, []); // Empty array ensures this runs only once on mount

  const handleReset = () => {
    setSourceTerm('');
    setContext('');
    setOriginalText('');
    setModifiedText('');
  };

  const handleCloseWelcome = () => {
    localStorage.setItem('lingoDiffVisited', 'true');
    setIsWelcomeVisible(false);
  };

  const handleShowExample = () => {
    // Set the state with the example data
    setSourceTerm('Room Selected At Check In');
    setContext('This is a room name label in a hotel booking app.');
    setOriginalText('チェックイン時にお部屋を選択');
    setModifiedText('チェックイン時お部屋選択');
    
    // Close the modal and mark as visited
    handleCloseWelcome();
  };

  const handleResetWelcome = () => {
    localStorage.removeItem('lingoDiffVisited');
    setIsWelcomeVisible(true);
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Primary Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="sourceTerm" className="block text-sm font-medium text-gray-700">Source Term (English)</label>
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
                  <label htmlFor="context" className="block text-sm font-medium text-gray-700">Translation Context</label>
                  <textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., A button on a hotel booking app that confirms the room choice."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Translation Candidates</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="candidate1" className="block text-sm font-medium text-gray-700">Candidate 1 (Original)</label>
                  <textarea
                    id="candidate1"
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="candidate2" className="block text-sm font-medium text-gray-700">Candidate 2 (Modified)</label>
                  <textarea
                    id="candidate2"
                    value={modifiedText}
                    onChange={(e) => setModifiedText(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ANALYSIS & OUTPUTS */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Visual Diff
                </h2>
                <DiffViewer originalText={originalText} modifiedText={modifiedText} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    AI Analysis
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    Generate a detailed prompt for external AI analysis. This will create a comprehensive prompt that you can paste into ChatGPT, Claude, or other LLM tools for expert linguistic analysis.
                </p>
                <ClipboardPromptButton 
                    sourceTerm={sourceTerm}
                    context={context}
                    originalText={originalText}
                    modifiedText={modifiedText}
                />
                 <p className="text-xs text-gray-500 mt-3 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                    Tip: The generated prompt includes all context and translation candidates for comprehensive analysis.
                </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 