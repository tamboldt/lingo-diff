import { useState } from 'react';

interface Props {
  sourceTerm: string;
  context: string;
  originalText: string;
  modifiedText: string;
}

const generatePrompt = ({ sourceTerm, context, originalText, modifiedText }: Props) => {
  return `**AI PROMPT: EXPERT LOCALIZATION ANALYSIS**

**Persona:**
You are an expert linguist and localization consultant with deep knowledge of translation nuances, cultural context, and user interface (UI) best practices.

**Task:**
Analyze the following two translation candidates for a software application. Evaluate their accuracy, tone, and suitability for the given context. Compare them, explain the key differences, and provide a clear recommendation.

**Contextual Information:**
- **Source Term (English):** ${sourceTerm || '[Not Provided]'}
- **Target Language:** Japanese
- **Translation Context:** ${context || '[No context provided. Assume it is a generic UI element.]'}

---

**Translation Candidates to Analyze:**

**Candidate 1 (Original):**
${originalText}

**Candidate 2 (Modified):**
${modifiedText}

---

**Required Analysis (Provide your response in this exact format):**

### 1. Analysis of Candidate 1
- **Accuracy & Tone:** Does it accurately convey the source meaning? What is its tone (e.g., formal, casual, direct)?
- **Suitability for Context:** How well does it fit the specified Translation Context?

### 2. Analysis of Candidate 2
- **Accuracy & Tone:** Does it accurately convey the source meaning? What is its tone?
- **Suitability for Context:** How well does it fit the specified Translation Context?

### 3. Comparative Analysis & Recommendation
- **Key Differences:** What are the most important linguistic differences between them? (e.g., "Candidate 2 omits particles for brevity, making it more direct.")
- **Final Recommendation:** Which candidate is better for the given context and why?`;
};

export const ClipboardPromptButton = ({ sourceTerm, context, originalText, modifiedText }: Props) => {
  const [buttonText, setButtonText] = useState('📋 Copy Prompt for AI Analysis');

  const handleCopy = () => {
    if (!originalText && !modifiedText) {
      alert('Please provide text for at least one translation candidate before copying.');
      return;
    }
    
    if (!sourceTerm && !context) {
        if (!confirm("You have not provided a Source Term or Context. The AI's analysis will be less accurate. Do you want to continue?")) {
            return;
        }
    }

    const promptText = generatePrompt({ sourceTerm, context, originalText, modifiedText });

    navigator.clipboard.writeText(promptText).then(() => {
        setButtonText('✅ Copied to Clipboard!');
        setTimeout(() => setButtonText('📋 Copy Prompt for AI Analysis'), 2000);
    }, (err) => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy prompt.');
    });
  };

  return (
    <button onClick={handleCopy} className="w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold">
      {buttonText}
    </button>
  );
}; 