// CSV import/export utilities for batch text comparison

export interface TextComparisonRecord {
  id?: string;
  referenceText: string;
  context: string;
  textA: string;
  textB: string;
  notes?: string;
  timestamp?: string;
}

export interface ImportValidation {
  valid: boolean;
  errors: string[];
  records: TextComparisonRecord[];
}

// Parse CSV content into comparison records
export const parseCSV = (csvContent: string): ImportValidation => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    return {
      valid: false,
      errors: ['CSV must contain at least a header row and one data row'],
      records: []
    };
  }

  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const requiredColumns = ['reference_text', 'context', 'text_a', 'text_b'];
  const missingColumns = requiredColumns.filter(col => !header.includes(col));

  if (missingColumns.length > 0) {
    return {
      valid: false,
      errors: [`Missing required columns: ${missingColumns.join(', ')}`],
      records: []
    };
  }

  const records: TextComparisonRecord[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line);
    
    if (values.length !== header.length) {
      errors.push(`Row ${i + 1}: Column count mismatch (expected ${header.length}, got ${values.length})`);
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

    // Map CSV columns to record properties
    header.forEach((col, index) => {
      const value = values[index];
      switch (col) {
        case 'reference_text':
        case 'source_text':
        case 'source':
          record.referenceText = value;
          break;
        case 'context':
        case 'usage_context':
          record.context = value;
          break;
        case 'text_a':
        case 'original':
        case 'candidate_1':
          record.textA = value;
          break;
        case 'text_b':
        case 'revised':
        case 'candidate_2':
          record.textB = value;
          break;
        case 'notes':
        case 'comments':
          record.notes = value;
          break;
      }
    });

    // Validate required fields
    if (!record.textA && !record.textB) {
      errors.push(`Row ${i + 1}: Must have at least one text version (Text A or Text B)`);
      continue;
    }

    records.push(record);
  }

  return {
    valid: errors.length === 0,
    errors,
    records
  };
};

// Parse a single CSV line handling quoted values and escaped quotes
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote - add literal quote and skip next char
        current += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result.map(val => val.replace(/^"|"$/g, '')); // Remove surrounding quotes
};

// Export comparison records to CSV format
export const exportToCSV = (records: TextComparisonRecord[]): string => {
  const headers = [
    'Reference_Text',
    'Context',
    'Text_A',
    'Text_B',
    'Notes',
    'Timestamp'
  ];

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

// Escape CSV values that contain commas, quotes, or newlines
const escapeCSVValue = (value: string): string => {
  if (!value) return '';
  
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  
  return value;
};

// Generate a simple ID for records
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Create sample CSV content for users
export const generateSampleCSV = (): string => {
  const sampleRecords: TextComparisonRecord[] = [
    {
      referenceText: 'Select Room',
      context: 'Mobile app button for hotel room selection',
      textA: 'チェックイン時にお部屋を選択',
      textB: 'チェックイン時お部屋選択',
      notes: 'Comparing Japanese translations'
    },
    {
      referenceText: 'Save Changes',
      context: 'Form submission button',
      textA: 'Save Changes',
      textB: 'Save',
      notes: 'Testing button text length'
    },
    {
      referenceText: 'Welcome back!',
      context: 'User greeting message',
      textA: 'Welcome back, John!',
      textB: 'Hi John, welcome back!',
      notes: 'Comparing greeting styles'
    }
  ];

  return exportToCSV(sampleRecords);
};