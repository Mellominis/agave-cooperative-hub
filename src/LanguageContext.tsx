import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, TranslationKeys } from './i18n';

export type Language = 'en' | 'sn' | 'nd';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('agave_language');
      if (saved === 'en' || saved === 'sn' || saved === 'nd') {
        return saved;
      }
    } catch (err) {
      console.error('Failed to read agave_language from localStorage:', err);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('agave_language', lang);
      setLanguageState(lang);
      // Dispatch a storage event so sibling tabs or listeners are synchronized
      window.dispatchEvent(new Event('agave_language_changed'));
    } catch (err) {
      console.error('Failed to write agave_language to localStorage:', err);
      setLanguageState(lang);
    }
  };

  useEffect(() => {
    const handleLangChange = () => {
      try {
        const saved = localStorage.getItem('agave_language');
        if (saved === 'en' || saved === 'sn' || saved === 'nd') {
          setLanguageState(saved);
        }
      } catch (err) {
        console.error('Failed to sync agave_language:', err);
      }
    };

    window.addEventListener('agave_language_changed', handleLangChange);
    return () => {
      window.removeEventListener('agave_language_changed', handleLangChange);
    };
  }, []);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
