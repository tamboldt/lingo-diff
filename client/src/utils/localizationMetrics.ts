// Localization metrics utilities for professional translation analysis

export interface TextMetrics {
  characters: number;
  bytes: number;
  words: number;
  script: string;
  isRTL: boolean;
  expansionRate: number;
}

export interface ConstraintCheck {
  type: string;
  limit: number;
  current: number;
  passed: boolean;
  severity: 'info' | 'warning' | 'error';
}

// Calculate UTF-8 byte length
export const getByteLength = (text: string): number => {
  return new TextEncoder().encode(text).length;
};

// Detect primary script of text
export const detectScript = (text: string): string => {
  if (!text) return 'None';
  
  // Remove spaces and punctuation for script detection
  const cleanText = text.replace(/[\s\p{P}]/gu, '');
  
  const scripts = {
    latin: /[\p{Script=Latin}]/u,
    arabic: /[\p{Script=Arabic}]/u,
    hebrew: /[\p{Script=Hebrew}]/u,
    cyrillic: /[\p{Script=Cyrillic}]/u,
    greek: /[\p{Script=Greek}]/u,
    hiragana: /[\p{Script=Hiragana}]/u,
    katakana: /[\p{Script=Katakana}]/u,
    han: /[\p{Script=Han}]/u, // Chinese characters
    hangul: /[\p{Script=Hangul}]/u, // Korean
    devanagari: /[\p{Script=Devanagari}]/u,
    thai: /[\p{Script=Thai}]/u,
  };

  for (const [scriptName, regex] of Object.entries(scripts)) {
    if (regex.test(cleanText)) {
      return scriptName.charAt(0).toUpperCase() + scriptName.slice(1);
    }
  }
  
  return 'Mixed/Other';
};

// Check if text is primarily RTL
export const isRTLText = (text: string): boolean => {
  const rtlScripts = /[\p{Script=Arabic}\p{Script=Hebrew}]/u;
  return rtlScripts.test(text);
};

// Calculate text expansion rate compared to source
export const calculateExpansionRate = (sourceText: string, translatedText: string): number => {
  if (!sourceText) return 0;
  const sourceLength = sourceText.length;
  const translatedLength = translatedText.length;
  return Math.round(((translatedLength - sourceLength) / sourceLength) * 100);
};

// Get comprehensive text metrics
export const getTextMetrics = (text: string, sourceText: string = ''): TextMetrics => {
  const characters = text.length;
  const bytes = getByteLength(text);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const script = detectScript(text);
  const isRTL = isRTLText(text);
  const expansionRate = calculateExpansionRate(sourceText, text);

  return {
    characters,
    bytes,
    words,
    script,
    isRTL,
    expansionRate,
  };
};

// Check various localization constraints
export const checkConstraints = (text: string, constraints: { [key: string]: number }): ConstraintCheck[] => {
  const metrics = getTextMetrics(text);
  const checks: ConstraintCheck[] = [];

  // SMS constraint (160 bytes for single SMS)
  if (constraints.sms) {
    checks.push({
      type: 'SMS Length',
      limit: constraints.sms,
      current: metrics.bytes,
      passed: metrics.bytes <= constraints.sms,
      severity: metrics.bytes > constraints.sms ? 'error' : metrics.bytes > constraints.sms * 0.9 ? 'warning' : 'info'
    });
  }

  // Character limit constraint
  if (constraints.characters) {
    checks.push({
      type: 'Character Limit',
      limit: constraints.characters,
      current: metrics.characters,
      passed: metrics.characters <= constraints.characters,
      severity: metrics.characters > constraints.characters ? 'error' : metrics.characters > constraints.characters * 0.9 ? 'warning' : 'info'
    });
  }

  // UI space constraint (mobile button width approximation)
  if (constraints.uiMobile) {
    const isCJK = ['Han', 'Hiragana', 'Katakana'].includes(metrics.script);
    const estimatedWidth = metrics.characters * (isCJK ? 2 : 1); // CJK characters are wider
    checks.push({
      type: 'Mobile UI Space',
      limit: constraints.uiMobile,
      current: estimatedWidth,
      passed: estimatedWidth <= constraints.uiMobile,
      severity: estimatedWidth > constraints.uiMobile ? 'error' : estimatedWidth > constraints.uiMobile * 0.9 ? 'warning' : 'info'
    });
  }

  return checks;
};

// Industry-standard expansion rates for common language pairs
export const getExpansionGuidelines = (sourceScript: string, targetScript: string): { min: number; max: number; typical: number } => {
  const guidelines: { [key: string]: { min: number; max: number; typical: number } } = {
    'Latin-to-Han': { min: -30, max: -10, typical: -20 }, // English to Chinese/Japanese
    'Latin-to-Arabic': { min: 0, max: 25, typical: 15 },
    'Latin-to-Cyrillic': { min: 10, max: 40, typical: 25 }, // English to Russian
    'Latin-to-Latin': { min: 20, max: 50, typical: 35 }, // English to German/Spanish
    'default': { min: -10, max: 30, typical: 10 }
  };

  const key = `${sourceScript}-to-${targetScript}`;
  return guidelines[key] || guidelines.default;
};