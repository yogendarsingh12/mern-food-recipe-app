import React, { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN_LANGUAGES, ADMIN_TRANSLATIONS } from '../locales/adminTranslations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('vyanjan_admin_lang');
      if (saved && ADMIN_TRANSLATIONS[saved]) {
        return saved;
      }
      return 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vyanjan_admin_lang', lang);
    } catch (e) {
      console.error('Failed to save admin language:', e);
    }
  }, [lang]);

  const t = (key) => {
    if (ADMIN_TRANSLATIONS[lang] && ADMIN_TRANSLATIONS[lang][key]) {
      return ADMIN_TRANSLATIONS[lang][key];
    }
    if (ADMIN_TRANSLATIONS.en && ADMIN_TRANSLATIONS.en[key]) {
      return ADMIN_TRANSLATIONS.en[key];
    }
    return key;
  };

  const currentLanguageObj = ADMIN_LANGUAGES.find((l) => l.code === lang) || ADMIN_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLanguage: setLang, t, currentLanguageObj, LANGUAGES: ADMIN_LANGUAGES }}>
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

