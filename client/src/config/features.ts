// Feature flags for enabling/disabling features
export const FEATURES = {
  // Internationalization - set to false to disable i18n system
  I18N_ENABLED: false,
  
  // Advanced CSV features
  CSV_PREVIEW: true,
  CSV_BATCH_PROCESSING: true,
  
  // LLM Integration
  LLM_INTEGRATION: true,
  
  // Enhanced accessibility
  ENHANCED_A11Y: true,
  
  // Deployment mode
  PRODUCTION_MODE: false
} as const;

export type FeatureFlag = keyof typeof FEATURES;