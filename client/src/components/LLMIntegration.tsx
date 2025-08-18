import React, { useState } from 'react';
import { FEATURES } from '../config/features';

interface LLMIntegrationProps {
  sourceTerm: string;
  context: string;
  originalText: string;
  modifiedText: string;
  className?: string;
  onOpenModal: (analysis: string, analyzing?: boolean) => void;
  onUpdateAnalysis: (analysis: string, analyzing?: boolean) => void;
}

export const LLMIntegration: React.FC<LLMIntegrationProps> = ({
  sourceTerm,
  context,
  originalText,
  modifiedText,
  className = '',
  onOpenModal,
  onUpdateAnalysis
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [provider, setProvider] = useState<'groq' | 'openrouter' | 'custom'>('groq');
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number>(0);

  // Don't render if feature is disabled
  if (!FEATURES.LLM_INTEGRATION) {
    return null;
  }

  const hasRequiredData = originalText && modifiedText;

  // Security: Sanitize input text to prevent injection attacks
  const sanitizeText = (text: string): string => {
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[{}]/g, '') // Remove potential template injection
      .substring(0, 2000); // Limit length to prevent abuse
  };

  // @ts-ignore - Function will be used when API integration is complete
  const generatePrompt = () => {
    return `Please analyze these text variations and provide professional linguistic assessment:

**Context**: ${sanitizeText(context) || 'No context provided'}
**Reference**: ${sanitizeText(sourceTerm) || 'No reference provided'}

**Text A (Original)**: ${sanitizeText(originalText)}
**Text B (Revised)**: ${sanitizeText(modifiedText)}

Please provide:
1. **Accuracy**: Which version better conveys the intended meaning?
2. **Fluency**: Which version sounds more natural?
3. **Cultural Appropriateness**: Any cultural considerations?
4. **Technical Assessment**: Character count, readability, constraints
5. **Recommendation**: Which version to use and why?

Please be specific about differences and provide actionable insights.`;
  };

  const analyzeWithLLM = async () => {
    if (!hasRequiredData || !apiKey.trim()) return;

    // Rate limiting: prevent abuse (30 second cooldown)
    const now = Date.now();
    if (now - lastAnalysisTime < 30000) {
      setError('Please wait 30 seconds between analyses to prevent abuse.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysis('');
    setLastAnalysisTime(now);

    // Open modal with analyzing state
    onOpenModal('', true);

    try {
      // This would be the actual API call
      // const prompt = generatePrompt(); // Will be used when API integration is complete
      // For now, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis response
      const mockAnalysis = `## Analysis Results

**Accuracy Assessment**: Text B appears more concise while maintaining core meaning.

**Fluency Evaluation**: Both versions are grammatically correct. Text B flows more naturally.

**Cultural Context**: ${context ? 'Context considered in evaluation.' : 'No specific cultural concerns identified.'}

**Technical Metrics**:
- Text A: ${originalText.length} characters
- Text B: ${modifiedText.length} characters
- Difference: ${Math.abs(originalText.length - modifiedText.length)} characters

**Recommendation**: ${originalText.length > modifiedText.length ? 'Text B is recommended for better conciseness.' : 'Text A provides more detailed information.'}`;

      setAnalysis(mockAnalysis);
      // Update modal with results
      onUpdateAnalysis(mockAnalysis, false);

    } catch (err) {
      setError('Failed to analyze text. Please check your API key and try again.');
      onUpdateAnalysis('', false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Direct AI Integration
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
            API Key Required
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
            <p><strong>For advanced users:</strong> Connect your own API key for integrated analysis directly within the app. Most users should use the free AI Analysis option in the main window instead.</p>
          </div>
          
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LLM Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="groq">Groq (Fast & Free)</option>
              <option value="openrouter">OpenRouter</option>
              <option value="custom">Custom API</option>
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${provider} API key`}
              className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeWithLLM}
            disabled={!hasRequiredData || !apiKey.trim() || isAnalyzing}
            className="w-full px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            title={
              !hasRequiredData ? "Fill both Text A and Text B to enable analysis" :
              !apiKey.trim() ? "Enter your API key to enable analysis" :
              "Click to analyze text differences"
            }
          >
            {isAnalyzing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analyze with AI
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Show Results Button */}
          {analysis && !isAnalyzing && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-purple-800">AI Analysis Complete</h4>
                  <p className="text-sm text-purple-600">Click to view detailed analysis results</p>
                </div>
                <button
                  onClick={() => onOpenModal(analysis, false)}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                >
                  View Results
                </button>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <p className="font-medium mb-1 text-yellow-800">⚠️ Experimental Feature:</p>
            <p className="text-yellow-700">• Requires external API key (your own account)</p>
            <p className="text-yellow-700">• Analysis quality depends on chosen model</p>
            <p className="text-yellow-700">• Always verify AI recommendations manually</p>
          </div>
        </div>
      )}
    </div>
  );
};