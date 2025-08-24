import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import es419 from './locales/es-419.json';
import ptBR from './locales/pt-BR.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ar from './locales/ar.json';
import he from './locales/he.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import hi from './locales/hi.json';

const resources = {
  'en': { translation: en },
  'es-419': { translation: es419 },
  'pt-BR': { translation: ptBR },
  'fr': { translation: fr },
  'de': { translation: de },
  'ja': { translation: ja },
  'ko': { translation: ko },
  'ar': { translation: ar },
  'he': { translation: he },
  'ru': { translation: ru },
  'zh-CN': { translation: zh },
  'hi': { translation: hi }
};

// RTL languages
export const RTL_LANGUAGES = ['ar', 'he'];

// Language display names in their native scripts  
export const LANGUAGE_NAMES = {
  'en': 'English',
  'es-419': 'Español (Latinoamérica)',
  'pt-BR': 'Português (Brasil)',
  'fr': 'Français',
  'de': 'Deutsch',
  'ja': '日本語',
  'ko': '한국어',
  'ar': 'العربية',
  'he': 'עברית',
  'ru': 'Русский',
  'zh-CN': '中文 (简体)',
  'hi': 'हिन्दी'
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // fallback language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'lingoDiffLanguage',
      caches: ['localStorage']
    }
  });

// Helper function to check if language is RTL
export const isRTL = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language);
};

// Helper function to get current text direction
export const getTextDirection = (): string => {
  return isRTL(i18n.language) ? 'rtl' : 'ltr';
};

export default i18n;