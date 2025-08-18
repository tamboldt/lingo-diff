import { useState } from 'react';

interface Props {
  sourceTerm: string;
  context: string;
  originalText: string;
  modifiedText: string;
}

const generatePrompt = ({ sourceTerm, context, originalText, modifiedText }: Props) => {
  return `**AI PROMPT: EXPERT TEXT ANALYSIS**

**Persona:**
You are an expert linguist and content analyst with deep knowledge of text nuances, cultural context, and communication best practices.

**Task:**
Analyze the following two text variations. Evaluate their clarity, tone, and suitability for the given context. Compare them, explain the key differences, and provide a clear recommendation.

**Contextual Information:**
- **Reference Text:** ${sourceTerm || '[Not Provided]'}
- **Language:** [Auto-detected from text content]
- **Usage Context:** ${context || '[No context provided. Assume general text usage.]'}

---

**Text Variations to Analyze:**

**Version A (Original):**
${originalText}

**Version B (Revised):**
${modifiedText}

---

**Required Analysis (Provide your response in this exact format):**

### 1. Analysis of Version A
- **Clarity & Tone:** How clear is the message? What is its tone (e.g., formal, casual, direct)?
- **Context Suitability:** How well does it fit the specified usage context?

### 2. Analysis of Version B
- **Clarity & Tone:** How clear is the message? What is its tone?
- **Context Suitability:** How well does it fit the specified usage context?

### 3. Comparative Analysis & Recommendation
- **Key Differences:** What are the most important differences between them? (e.g., "Version B is more concise, making it more direct.")
- **Final Recommendation:** Which version is better for the given context and why?`;
};

export const ClipboardPromptButton = ({ sourceTerm, context, originalText, modifiedText }: Props) => {
  const [buttonText, setButtonText] = useState('📋 Copy Prompt → Paste in ChatGPT/Claude');

  const handleCopy = () => {
    if (!originalText && !modifiedText) {
      alert('Please provide text for at least one version before copying.');
      return;
    }
    
    if (!sourceTerm && !context) {
        if (!confirm("You have not provided a Reference Text or Context. The AI's analysis will be less accurate. Do you want to continue?")) {
            return;
        }
    }

    const promptText = generatePrompt({ sourceTerm, context, originalText, modifiedText });

    navigator.clipboard.writeText(promptText).then(() => {
        setButtonText('✅ Copied to Clipboard!');
        setTimeout(() => setButtonText('📋 Copy Prompt → Paste in ChatGPT/Claude'), 2000);
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