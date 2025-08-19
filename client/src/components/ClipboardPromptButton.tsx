import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FEATURES } from '../config/features';

interface Props {
  sourceTerm: string;
  context: string;
  originalText: string;
  modifiedText: string;
}

const generatePrompt = ({ sourceTerm, context, originalText, modifiedText }: Props, t: (key: string) => string) => {
  return `**AI PROMPT: EXPERT TEXT ANALYSIS**

**Persona:**
You are an expert linguist and content analyst with deep knowledge of text nuances, cultural context, and communication best practices.

**Task:**
Analyze the following two text variations. Evaluate their clarity, tone, and suitability for the given context. Compare them, explain the key differences, and provide a clear recommendation.

**Contextual Information:**
- **Reference Text:** ${sourceTerm || t('clipboard.notProvided')}
- **Language:** [Auto-detected from text content]
- **Usage Context:** ${context || t('clipboard.noContext')}

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
  const { t } = FEATURES.I18N_ENABLED ? useTranslation() : { t: (key: string) => key.split('.').pop() || key };
  const [buttonText, setButtonText] = useState(t('clipboard.copyPrompt'));

  const handleCopy = () => {
    if (!originalText && !modifiedText) {
      alert(t('clipboard.pleaseProvideText'));
      return;
    }
    
    if (!sourceTerm && !context) {
        if (!confirm(t('clipboard.missingContext'))) {
            return;
        }
    }

    const promptText = generatePrompt({ sourceTerm, context, originalText, modifiedText }, t);

    navigator.clipboard.writeText(promptText).then(() => {
        setButtonText(t('clipboard.copied'));
        setTimeout(() => setButtonText(t('clipboard.copyPrompt')), 2000);
    }, (err) => {
        console.error('Could not copy text: ', err);
        alert(t('clipboard.copyFailed'));
    });
  };

  return (
    <button onClick={handleCopy} className="w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold">
      {buttonText}
    </button>
  );
}; 