// Intelligent CSV handling with zero user complexity

export interface SmartColumnMapping {
  detected: string;
  mapped: keyof TextComparisonRecord;
  confidence: number;
  alternatives: string[];
}

export interface TextComparisonRecord {
  id?: string;
  referenceText: string;
  context: string;
  textA: string;
  textB: string;
  notes?: string;
  timestamp?: string;
}

export interface SmartCSVResult {
  success: boolean;
  records: TextComparisonRecord[];
  errors: string[];
  mapping: SmartColumnMapping[];
  suggestions: string[];
}

// Intelligent column name patterns for different languages and contexts
const COLUMN_PATTERNS = {
  referenceText: [
    // English variations
    'reference', 'source', 'original', 'base', 'master', 'reference_text', 'source_text',
    // Spanish variations  
    'referencia', 'fuente', 'texto_referencia', 'original',
    // Portuguese (Brazilian) variations
    'referência', 'fonte', 'texto_referência', 'original',
    // French variations
    'référence', 'source', 'original', 'texte_source',
    // German variations
    'referenz', 'quelle', 'original', 'basis',
    // Japanese romanized
    'moto', 'genpon', 'kihon',
    // Korean romanized  
    'wonseo', 'giwon',
    // Arabic romanized
    'marji', 'asl', 'masdar',
    // Russian romanized
    'istochnik', 'original',
    // Common abbreviations
    'ref', 'src', 'orig'
  ],
  context: [
    // English
    'context', 'usage', 'description', 'notes', 'comments', 'purpose', 'use_case',
    // Spanish
    'contexto', 'uso', 'descripción', 'propósito',
    // Portuguese (Brazilian)
    'contexto', 'uso', 'descrição', 'propósito',
    // French
    'contexte', 'utilisation', 'description', 'objectif',
    // German  
    'kontext', 'verwendung', 'beschreibung', 'zweck',
    // Japanese romanized
    'bunmyaku', 'riyou', 'setsumei',
    // Korean romanized
    'munmaek', 'sayong', 'seolmyeong',
    // Arabic romanized
    'siyaq', 'istikhdam', 'wasf',
    // Russian romanized
    'kontekst', 'ispolzovanie', 'opisanie',
    // Abbreviations
    'desc', 'info'
  ],
  textA: [
    // English variations
    'text_a', 'version_a', 'candidate_1', 'original', 'current', 'old', 'before',
    'translation_1', 'option_1', 'variant_1',
    // Spanish
    'texto_a', 'version_a', 'candidato_1', 'original', 'actual',
    // Portuguese (Brazilian)
    'texto_a', 'versão_a', 'candidato_1', 'original', 'atual',
    // French
    'texte_a', 'version_a', 'candidat_1', 'original', 'actuel',
    // German
    'text_a', 'version_a', 'kandidat_1', 'original', 'aktuell',
    // Japanese romanized
    'tekisuto_a', 'ban_a', 'koho_1', 'genpon',
    // Korean romanized
    'teksteu_a', 'beojeon_a', 'hugbo_1', 'wonbon',
    // Arabic romanized
    'nas_a', 'nuskha_a', 'murashaha_1', 'asliyya',
    // Russian romanized
    'tekst_a', 'versiya_a', 'variant_1', 'originalnyi',
    // Simple patterns
    'a', '1', 'first', 'uno', 'eins', 'un', 'yi', 'hana'
  ],
  textB: [
    // English variations
    'text_b', 'version_b', 'candidate_2', 'revised', 'new', 'after', 'updated',
    'translation_2', 'option_2', 'variant_2',
    // Spanish
    'texto_b', 'version_b', 'candidato_2', 'revisado', 'nuevo',
    // Portuguese (Brazilian)
    'texto_b', 'versão_b', 'candidato_2', 'revisado', 'novo',
    // French
    'texte_b', 'version_b', 'candidat_2', 'révisé', 'nouveau',
    // German  
    'text_b', 'version_b', 'kandidat_2', 'überarbeitet', 'neu',
    // Japanese romanized
    'tekisuto_b', 'ban_b', 'koho_2', 'kaizen',
    // Korean romanized
    'teksteu_b', 'beojeon_b', 'hugbo_2', 'sujeonggwan',
    // Arabic romanized
    'nas_b', 'nuskha_b', 'murashaha_2', 'munaqqaha',
    // Russian romanized
    'tekst_b', 'versiya_b', 'variant_2', 'novyi',
    // Simple patterns
    'b', '2', 'second', 'dos', 'zwei', 'deux', 'er', 'dul'
  ],
  notes: [
    // English
    'notes', 'comments', 'remarks', 'observations', 'feedback',
    // Spanish
    'notas', 'comentarios', 'observaciones', 'retroalimentación',
    // Portuguese (Brazilian)
    'notas', 'comentários', 'observações', 'feedback',
    // French
    'notes', 'commentaires', 'remarques', 'observations',
    // German
    'notizen', 'kommentare', 'bemerkungen', 'feedback',
    // Japanese romanized
    'memo', 'komento', 'bikou', 'kansou',
    // Korean romanized
    'memo', 'daegul', 'gwallyeon', 'uigyeon',
    // Arabic romanized
    'mulahazat', 'taeliqat', 'tajawubu', 'aara',
    // Russian romanized
    'zametki', 'kommentarii', 'zamechaniya', 'otziv',
    // Abbreviations
    'note', 'comment'
  ]
};

// Calculate similarity between strings (fuzzy matching)
const calculateSimilarity = (str1: string, str2: string): number => {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const s1 = normalize(str1);
  const s2 = normalize(str2);
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Basic Levenshtein-inspired similarity
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  
  const distance = levenshteinDistance(s1, s2);
  return 1 - (distance / maxLen);
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Intelligently map CSV headers to our data structure
export const mapCSVHeaders = (headers: string[]): SmartColumnMapping[] => {
  const mappings: SmartColumnMapping[] = [];
  const usedFields = new Set<string>();
  
  for (const header of headers) {
    let bestMatch: SmartColumnMapping = {
      detected: header,
      mapped: 'notes' as keyof TextComparisonRecord,
      confidence: 0,
      alternatives: []
    };
    
    // Try to match against each field type
    for (const [fieldName, patterns] of Object.entries(COLUMN_PATTERNS)) {
      if (usedFields.has(fieldName)) continue;
      
      for (const pattern of patterns) {
        const similarity = calculateSimilarity(header, pattern);
        
        if (similarity > bestMatch.confidence) {
          bestMatch = {
            detected: header,
            mapped: fieldName as keyof TextComparisonRecord,
            confidence: similarity,
            alternatives: patterns.slice(0, 3) // Show top 3 alternatives
          };
        }
      }
    }
    
    // If confidence is high enough, use this mapping
    if (bestMatch.confidence > 0.6) {
      usedFields.add(bestMatch.mapped);
    } else {
      // Default to notes for unrecognized columns
      bestMatch.mapped = 'notes';
    }
    
    mappings.push(bestMatch);
  }
  
  return mappings;
};

// Detect CSV separator by analyzing the first few lines
const detectSeparator = (csvContent: string): string => {
  const lines = csvContent.split('\n').slice(0, 3).filter(line => line.trim());
  if (lines.length === 0) return ',';

  const separators = [',', ';', '\t', '|'];
  const separatorScores: { [key: string]: number } = {};

  separators.forEach(sep => {
    let score = 0;
    let consistency = 0;
    let firstLineCount = 0;

    lines.forEach((line, index) => {
      const count = parseCSVLine(line, sep).length;
      
      if (index === 0) {
        firstLineCount = count;
      }
      
      // Score based on column count (more columns = better)
      score += count;
      
      // Consistency bonus (all lines have same column count)
      if (count === firstLineCount && count > 1) {
        consistency += 10;
      }
    });

    separatorScores[sep] = score + consistency;
  });

  // Return separator with highest score
  return Object.entries(separatorScores)
    .sort(([,a], [,b]) => b - a)[0][0];
};

// Parse CSV with intelligent header detection
export const parseSmartCSV = (csvContent: string): SmartCSVResult => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return {
      success: false,
      records: [],
      errors: ['CSV must contain at least a header row and one data row'],
      mapping: [],
      suggestions: ['Add a header row with column names', 'Include at least one data row']
    };
  }

  // Auto-detect separator
  const separator = detectSeparator(csvContent);
  
  // Parse header row with detected separator
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine, separator);
  const mapping = mapCSVHeaders(headers);
  
  // Validate that we have essential fields
  const hasMappedTextFields = mapping.some(m => 
    (m.mapped === 'textA' || m.mapped === 'textB') && m.confidence > 0.6
  );
  
  if (!hasMappedTextFields) {
    return {
      success: false,
      records: [],
      errors: ['Could not identify text comparison columns'],
      mapping,
      suggestions: [
        'Ensure columns are named like: "Text_A", "Text_B", "Original", "Revised"',
        'Use clear column names that indicate text comparison',
        'Include at least one text column for comparison'
      ]
    };
  }

  // Parse data rows
  const records: TextComparisonRecord[] = [];
  const errors: string[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line, separator);
    
    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Expected ${headers.length} columns, found ${values.length}`);
      continue;
    }

    const record: TextComparisonRecord = {
      id: generateId(),
      referenceText: '',
      context: '',
      textA: '',
      textB: '',
      timestamp: new Date().toISOString()
    };

    // Apply intelligent mapping
    mapping.forEach((map, index) => {
      const value = values[index]?.trim() || '';
      if (map.confidence > 0.6) {
        switch (map.mapped) {
          case 'referenceText':
            record.referenceText = value;
            break;
          case 'context':
            record.context = value;
            break;
          case 'textA':
            record.textA = value;
            break;
          case 'textB':
            record.textB = value;
            break;
          case 'notes':
            record.notes = value;
            break;
        }
      }
    });

    // Validate that record has at least one text field
    if (!record.textA && !record.textB) {
      errors.push(`Row ${i + 1}: No text content found`);
      continue;
    }

    records.push(record);
  }

  const suggestions: string[] = [];
  const lowConfidenceMappings = mapping.filter(m => m.confidence < 0.8);
  if (lowConfidenceMappings.length > 0) {
    suggestions.push(`Some columns were auto-mapped with low confidence: ${lowConfidenceMappings.map(m => m.detected).join(', ')}`);
  }
  
  // Add separator detection info
  const separatorNames: { [key: string]: string } = {
    ',': 'comma',
    ';': 'semicolon', 
    '\t': 'tab',
    '|': 'pipe'
  };
  suggestions.unshift(`Auto-detected ${separatorNames[separator] || 'separator'}: "${separator}"`);

  return {
    success: errors.length === 0,
    records,
    errors,
    mapping,
    suggestions
  };
};

// Parse a single CSV line with configurable separator (transparent handling of quotes/escapes)
const parseCSVLine = (line: string, separator: string = ','): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip the escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === separator && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, ''));
};

// Export with intelligent headers (user-friendly names)
export const exportSmartCSV = (records: TextComparisonRecord[], language: string = 'en'): string => {
  const headers = getLocalizedHeaders(language);
  const csvRows = [headers.join(',')];

  records.forEach(record => {
    const row = [
      escapeCSVValue(record.referenceText),
      escapeCSVValue(record.context),
      escapeCSVValue(record.textA),
      escapeCSVValue(record.textB),
      escapeCSVValue(record.notes || ''),
      escapeCSVValue(record.timestamp || '')
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

// Get localized headers based on user's language
const getLocalizedHeaders = (language: string): string[] => {
  const headerTranslations: { [key: string]: string[] } = {
    'en': ['Reference_Text', 'Context', 'Text_A', 'Text_B', 'Notes', 'Timestamp'],
    'es': ['Texto_Referencia', 'Contexto', 'Texto_A', 'Texto_B', 'Notas', 'Marca_Tiempo'],
    'pt': ['Texto_Referência', 'Contexto', 'Texto_A', 'Texto_B', 'Notas', 'Marca_Tempo'],
    'pt-BR': ['Texto_Referência', 'Contexto', 'Texto_A', 'Texto_B', 'Notas', 'Data_Hora'],
    'fr': ['Texte_Référence', 'Contexte', 'Texte_A', 'Texte_B', 'Notes', 'Horodatage'],
    'de': ['Referenz_Text', 'Kontext', 'Text_A', 'Text_B', 'Notizen', 'Zeitstempel'],
    'ja': ['参照テキスト', 'コンテキスト', 'テキストA', 'テキストB', 'メモ', 'タイムスタンプ'],
    'ko': ['참조텍스트', '컨텍스트', '텍스트A', '텍스트B', '메모', '타임스탬프'],
    'ar': ['النص_المرجعي', 'السياق', 'النص_أ', 'النص_ب', 'ملاحظات', 'الطابع_الزمني'],
    'ru': ['Исходный_Текст', 'Контекст', 'Текст_А', 'Текст_Б', 'Заметки', 'Время'],
    'hi': ['संदर्भ_पाठ', 'संदर्भ', 'पाठ_A', 'पाठ_B', 'टिप्पणियां', 'समयचिह्न'],
    'zh': ['参考文本', '上下文', '文本A', '文本B', '备注', '时间戳'],
    'zh-CN': ['参考文本', '上下文', '文本A', '文本B', '备注', '时间戳'],
    'zh-TW': ['參考文本', '上下文', '文本A', '文本B', '備註', '時間戳']
  };
  
  return headerTranslations[language] || headerTranslations['en'];
};

// Automatically escape CSV values (transparent to user)
const escapeCSVValue = (value: string): string => {
  if (!value) return '';
  
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  
  return value;
};

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate sample CSV with intelligent examples
export const generateSampleCSV = (language: string = 'en'): string => {
  const sampleRecords: TextComparisonRecord[] = [
    {
      referenceText: 'Select Room',
      context: 'Mobile app button for hotel room selection',
      textA: 'チェックイン時にお部屋を選択',
      textB: 'チェックイン時お部屋選択',
      notes: 'Comparing Japanese translations - particle usage'
    },
    {
      referenceText: 'Save Changes',
      context: 'Form submission button',
      textA: 'Save Changes',
      textB: 'Save',
      notes: 'Testing button text length for mobile'
    },
    {
      referenceText: 'Welcome back!',
      context: 'User greeting message',
      textA: 'Welcome back, John!',
      textB: 'Hi John, welcome back!',
      notes: 'Comparing greeting styles - formal vs casual'
    },
    {
      referenceText: 'File not found',
      context: 'Error message in application',
      textA: 'The requested file could not be found.',
      textB: 'File not found. Please check the path.',
      notes: 'Error message clarity comparison'
    }
  ];

  return exportSmartCSV(sampleRecords, language);
};